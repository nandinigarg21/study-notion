// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
// Configuring dotenv to load environment variables from .env file
dotenv.config();


//auth
exports.auth = async(req,res,next) => {
    try{
        //extract token
        const token = req.cookies.token
                      || req.body.token 
                      || req.header("Authorisation").replace("Bearer ","");

        //if token missing , then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            });
        }  
        
        //verifying the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

        }
        catch(error){
            //verification issue
            return res.status(401).json({
                success:false,
                message:"token is missing",
            })

        }
        next();

    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong, while validating the token"
        });

    }

}
//isStudent
exports.isStudent = async(req,res,next) => {
    try{
        const userDetails = await User.findOne({ email: req.user.email });
        if(userDetails.accountType != "Student") {
            return res.status(401).json({
                success:false,
                message:"This is protected route for student only",
            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        })

    }
}

//isInstructor
exports.isInstructor = async(req,res) => {
    try{
        const userDetails = await User.findOne({ email: req.user.email });
        console.log(userDetails);

		console.log(userDetails.accountType);

        if(userDetails.accountType != "Instructor") {
            return res.status(401).json({
                success:false,
                message:"This is protected route for instructor only",
            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        })

    }
}

//isAdmin
exports.isAdmin = async(req,res) => {
    try{
        const userDetails = await User.findOne({ email: req.user.email });

        if(userDetails.accountType != "Admin") {
            return res.status(401).json({
                success:false,
                message:"This is protected route for admin only",
            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        })

    }
}
