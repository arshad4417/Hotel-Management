const catchAsyncError = require('./../middleware/catchAsyncErrors');
const User = require('./../schemas/userSchema');
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")

//Register User
exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create(
        {name,email,password,avatar:{
            public_id:"hello",
            url:"hey"
        }} 
    )
    const token = user.getJWTToken();
    res.status(201).json({
        success:true,
        token
    })
})

//login user
exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email ||!password){
        return res.status(401).json({
            success:false,
            message:"Enter Email or Password"
        })
    }
    const user = await User.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Invalid Id Password"
        })
    }
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        return res.status(401).json({
            success:false,
            message:"Enter valid Email or Password"
        })
    }
    const token = user.getJWTToken();
    const options = {
        expires: new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true,
    }
    res.status(201).cookie("token",token,options).json({
        success:true,
        user,
        token
    })


})

//Logout user
exports.logoutUser = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(201).json({
        success:true,
        message:"Logout Successfully"
    })
})

//Forget Password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(401).json({
            success:true,
            message:"User Not Found 401",
        })
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/forgotpassword/reset/${resetToken}`
    const message = `Your Reset Password Token URL is :- \n\n${resetPasswordUrl} \n\nif You are not request for this then ignore it`
    try {
        await sendEmail({
            email:user.email,
            subject:"CrossPoles Dining Reset Password Token",
            message,
        })
        return res.status(200).json({
            success:true,
            message:`Mail Send TO ${user.email} Successfully`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false})
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
})
//Reset Password
exports.resetPassword = catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");  
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt : Date.now()}
    })
    if(!user){
        res.status(400).json({
            success:false,
            message:"Reset password token is invalid or has been expired"
        })
    }
    if(req.body.password !== req.body.confirmPassword){
        res.status(400).json({
            success:false,
            message:"Passwords doesNot Match"
        })
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    //JWT WORK
    const token = user.getJWTToken();
    const options = {
        expires: new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true,
    }
    res.status(201).cookie("token",token,options).json({
        success:true,
        user,
        token
    })
})