const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User , validateRegisterUser,validateLoginUser}= require("../models/User");


/* 
* Register New User - 
* /api/auth/register
*POST
*/
module.exports.registerUserCtrl= asyncHandler(async (req,res) => {
    const {error}= validateRegisterUser(req.body);
  if(error){
    console.error('Validation error:', error.details[0].message);
    return res.status(400).json({message:error.details[0].message})
  }
let user = await User.findOne({email: req.body.email});
if(user){
  console.log('User already exists:', user);
    return res.status(400).json({message:"user already exist"});
} 
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);
user = new User({
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    email:req.body.email,
    password: hashedPassword,
})
await user.save();
console.log('User registered successfully:', user);

// To Do - sending email (verify account )

res.status(201)
.json({message:"you registred succefully,please log in "});
});

module.exports.loginUserCtrl = asyncHandler (async (req,res) => {
    //validation
    const {error}= validateLoginUser(req.body);
    if(error){
      console.error('Validation error:', error.details[0].message);
      return res.status(400).json({message:error.details[0].message})
    }

  // is user exist 
  const user = await User.findOne({email:req.body.email});
  if(!user){
    console.error('User not found');
    return res.status(400).json({message:"invalid email or password"});
  }
const isPasswordMatch = await bcrypt.compare(req.body.password,user.password);
if(!isPasswordMatch){
  console.error('Password does not match');
    return res.status(400).json({message:"invalid email or password"});
  }

// To Do - sending email (verify account )

 const token = user.generateAuthToken();
 console.log('Login successful, token generated');
 res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
 });



});

