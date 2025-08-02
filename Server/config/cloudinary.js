
const cloudinary = require("cloudinary").v2

exports.cloudinaryConnect = () => {
    try{
        cloudinary.config({
            cloud_name:process.env.cloud_name,
            api_key:process.env.API_KEY,
            api_secret:process.entry.API_SECRET,

        })

    }
    catch(error){
        console.log(error);
    }
}