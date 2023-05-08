const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Please Enter Name With Less Than 30 Characters"],
        minLength:[4,"Please Enter Name With more Than 3 Characters"],
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        maxLength:[8,"Password has minimum 8 length"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

//Password hasing
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

//method for JWTToken
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
}  

//compare Password
userSchema.methods.comparePassword = async function(comparePassword){
    return await bcrypt.compare(comparePassword,this.password)
}

//Generating resetPassword Token
userSchema.methods.getResetPasswordToken= function(){
    const resetToken = crypto.randomBytes(20).toString("hex")
    //Hasing and Adding reset Token to user Schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now()+15*60*1000;
    return resetToken;
}


module.exports = mongoose.model('User', userSchema);

