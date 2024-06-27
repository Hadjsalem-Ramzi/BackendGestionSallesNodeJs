const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
//User Schema
const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim:true,
        minlength:2,
        maxlength:100,
    },
    lastname: {
         type: String,
        required: true,
        trim:true,
        minlength:2,
        maxlength:100,
    },
    email: {
        type: String,
        required: true,
        trim:true,
        minlength:5,
        maxlength:100,
        unique: true,
    },
    password:{
        type: String,
        required : true,
        trim : true,
        minlength: 8,
    },
    profilePhoto:{
     type: Object,
     default :{
        url: "https://pixabay.com/fr/vectors/avatar-personne-neutre-homme-vide-159236/",
        publicId: null
     }
    },
     bio : {
        type: String,
     },
     isAdmin: {
        type: Boolean,
        default: false,
     },
     isAccountVerified: {
        type:Boolean,
        default:false,
     },
    },{

    timestamps: true,
});

// Genearte Auth Token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET);
}

//User Model
const User = mongoose.model("User",UserSchema);

// Validate Register User
function validateRegisterUser(obj){
    const Schema = Joi.object({
        firstname: Joi.string().trim().min(2).max(100).required(),
        lastname: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8),
    })
    return Schema.validate(obj);
}

// Validate Login User
function validateLoginUser(obj){
    const Schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8),
    })
    return Schema.validate(obj);
}


// Validate update User
function validateUpdateUser(obj){
    const Schema = Joi.object({
        firstname:Joi.string().trim().min(2).max(100),
        lastname:Joi.string().trim().min(2).max(100),
        password: Joi.string().trim().min(8),
        bio:Joi.string(),
    })
    return Schema.validate(obj);
}

module.exports = {
    User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser
}