const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");

require("dotenv").config();

//send OTP
exports.sendOtp = async(req,res) => {

    try{
        //fetch email from req body
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});

        //if user already exist , then return a response
        if(checkUserPresent) {
            return res.status(401).json({
                success:true,
                message:"User already present",
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ", otp)
        

        //check otp is unique or not
        let result = await OTP.findOne({otp: otp});
        //if not create another otp
        while(result) {
            otp = otpGenerator(6, {
               upperCaseAlphabets:false,
               lowerCaseAlphabets:false,
               specialChars:false, 
            });
            result = await OTP.findOne({otp: otp});

        }

        const otpPayload = {email, otp};

        //create entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response successfully
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}


//SIGNUP
exports.signUp = async(req,res) => {
    try{
        //data fetch from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPasword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        //validate data
        if(!firstName || !lastName || !email || !password || !confirmPasword || !otp) {
            return res.status(403).json({
                success:false,
                message:"All field are required"
            })
        }

        //match two passwords
        if(password !== confirmPasword) {
            return res.status(400).json({
                success:false,
                message:"password and cnfirm password value are not matchh, plase try again"
            });
        }

        //check user is already exist or not
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Useer is already registered",
            
            });
        }

        //find most recent otp stored for the user
        
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        //validate otp
        if(recentOtp.length == 0) {
            //OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP found",
            })
            
        }
        else if(otp != recentOtp.otp) {
            //Invalid OTP
            return res.status(400).json( {
                success:false,
                message:"Invalid OTP",
            });
        }

        //Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        //entry create in DB
        const profileDetails = await Profiler.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashPassword,
            contactNumber,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https//api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return response
        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json( {
            success:false,
            message:"User cannot be registered",
        })

    }
}

//LOGIN
exports.login = async(req,res) => {
    try{
        //fetch data from req body
        const{email, password} = req.body;
        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All field are required, please try again",
            });
        }
        //check user exist or not
        const user = await user.findOne({email}).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first",
            });
        }
        //generate JWT, after matching password
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                role:user.accountType,
            }
             const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn:"2h",
        });
        user.token = token;
        user.password = undefined;

        //create cookie and send response
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token", token, options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in successfully",
        })
            
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            });
        }
       
        

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure, please try again",
        });

    }
};

//change password

exports.changePassword = async(req,res) => {
    try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}


