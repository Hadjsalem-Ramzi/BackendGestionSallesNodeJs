const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const  path = require ("path");
const {cloudinaryUploadImage,cloudinaryRemoveImage } = require("../utils/cloudinary");
const fs  = require("fs");





module.exports.getAllUsersCtrl = asyncHandler(async (req,res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
})


// Get User Profile
//route /api/users/profile/:id
//method Get
module.exports.getUserProfileCtrl = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select("-password");
    if(!user){
        return res.status(400).json({message:"user not found"});
    }

    res.status(200).json(user);
})


//Update User Profile
module.exports.updateUserProfileCtrl = asyncHandler(async (req,res) =>{
    const { error } = validateUpdateUser(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }

  if( req.body.password){
  const salt= await bcrypt.genSalt(10);
  req.body.password =  await bcrypt.hash(req.body.password, salt);
  }

 const updatedUser = await User.findByIdAndUpdate(req.params.id,{
    $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        bio:req.body.bio
    }
 },{new: true}).select("-password");
 res.status(200).json(updatedUser);

})


// Get Users Count
module.exports.getAllUsersCountCtrl = asyncHandler(async (req,res) => {
    const count = await User.count();
    res.status(200).json(count);
})

module.exports.profilePhotoUploadCtrl = asyncHandler(async (req,res) =>{
    // 1. validation
    if(!req.file){
        return res.status(400).json({message :'no file provided'});
    }

  // 2. Get the path to the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  // 3. Upload to cloudinary
   const result = await cloudinaryUploadImage(imagePath);
   console.log(result);
  // 4. Get the user from DB
 const user = await User.findById(req.user.id);

  // 5. delete the old profile photo if exist

  if( user.profilePhoto.publicId !== null){
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }
  // 6. change the profilePhoto field in the DB
   user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
   }
    await user.save();
 // 7. Send response to client

    res.status(200).json({message:"your profile photo uploaded succefully",
      //profilePhoto: {url:result.secure_url, publicId: result.public_id }  
    });
  // remove image from the server
   fs.unlinkSync(imagePath);


})


// delete User Profile

// @Route     /api/users/profile/:id

// @Method Delete 

// @Access private (only admin or user himself)

module.exports.deleteUserProfileCtrl = asyncHandler(async (req,res) =>{
  // 1. Get the user from DB
  const user = await User.findById(req.params.id);
  if(!user) {
    return res.status(404).json({message: "user not found"});
  }
  // Delete the Profile picture from cloudinary 
  await cloudinaryRemoveImage(user.profilePhoto.publicId);

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({message:"our profile has been deleted"});


} );
