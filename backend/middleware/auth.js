const User = require("../schemas/userSchema");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")


exports.isAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Please Login to Access these Resoures"
        })
    }
    const decodeData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodeData.id);
    next();
})

exports.authorizeRoles=(...roles) => catchAsyncErrors(async(req,res,next)=>{
    const {role}=req.user;
    if(!roles.includes(role)){
        return res.status(201).json({
            success:false,
            message:"You are a User Not Admin"
        })
    }
    next();
})