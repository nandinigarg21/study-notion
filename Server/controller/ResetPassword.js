
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken
exports.resetPasswordToken = async(req,res) => {
    try{
    //get mail from req body
    const email = req.body.email;
    //check useer for this mail, email validation
    const user = await User.findOne({email: email});
    if(!user){
        return res.json({
            success:false,
            message:`This Email: ${email} is not Registered With Us Enter a Valid Email `,
        });
    }
    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
                                   {email:email},
                                   {
                                    token:token,
                                    resetPasswordExpires: Date.now() + 5*60*1000,
                                   },
                                   {new:true});
                                   console.log("DETAILS", updateDetails);

    //create url
    const url = `http://localhost:3000/update-password/${token}`
    //send email containing the url
    await mailSender(email,
                     "password reset link",
                     `password reset link: ${url} `);
    
    //return response
    return res.json({
        success:true,
        message:"Email sent successfully, please check email and change password",
    }) ;                
}
catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Somthing went wrong while sending reset password mail",
    });
}
}

//resetPassword
exports.resetPassword = async(req,res) => {
    try{
    //data fetch
    const {password, confirmPassword, token} = req.body;
    //validaation
    if(password != confirmPassword) {
        return res.json({
            success:false,
            message:"Password not matching",
        });
    }
    //get user details fron db using token
    const userDetails = await User.findOne({token: token});
    //if no entry - invalid token
    if(!userDetails ){
        return res.json({
            success:false,
            message:"Token is invalid",
        });
    }
    //token time check
    if(!(userDetails.resetPasswordExpires > Date.now()) ){
        return res.json({
            success:false,
            message:"Token is expired, please regenerate your token",
        });
    }
    //hash pswd
    const hashPassword = await bcrypt.hash(password,10);

    //password update
    await User.findOneAndUpdate(
        {token: token},
        {password: hashPassword},
        {new:true},
    );
    //return response
    return res.status(200).json({
        success:true,
        message:"Password reset successfully",
    });
}
catch(error){
    console.log(error);
    return res.status(500).json({
        success:true,
        message:"Somthing went wrong while ending reset password mail",
    });
}
}
