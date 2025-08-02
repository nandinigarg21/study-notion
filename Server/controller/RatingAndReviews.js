const RatingAndReviews = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//createRating
exports.createRating = async(req,res) => {
    try{
        //get  user id
        const userId = req.user.id;
        //fetch from req body
        const {rating, review, courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
                                     {_id:courseId,
                                        studentEnrolled: {$elemMatch: {$eq: userId} },
                                     });
        
        if(!courseDetails) {
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course",
            });
        }  
        //check if user is already reviewed the course
        const alreadyReviewd = await RatingAndReviews.findOne({
                                               useer:userId,
                                               course:courseId,
        });

        if(alreadyReviewd) {
            return res.status(403).json({
                success:false,
                message:"Course is reviewed by the user",
            });
        }

        //createreting and reviews
        const ratingReviews = await RatingAndReviews.create({
                                         rating, review,
                                         course:courseId,
                                         user:userId,
        });
        //update course with this rating/reviews
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                       {
                                        $push: {
                                            ratingAndReviews: ratingReviews._id,
                                        }
                                       },
                                       {new:true}
        );
        console.log(updatedCourseDetails);

        //return respopnse
        return res.status(200).json({
            success:true,
            message:"Rating and Reveiws created successfully",
            ratingReviews,
        })



    }
    catch(error){
        console.log(error);
        return res. status(500).json({
            success:false,
            error:error.message,
        });

    }
}

//get Average Rating
exports.getAverageRating = async(req,res) => {
    try{
        //get course Id
        const courseId = req.body.courseId;
        //calculate avg rating
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: { $avg: "$rating"},
                }
            }
        ])

        //return rating
        if(result.length > 0) {
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating/review exist
        return res.status(200).json({
            success:true,
            message:"Average rating is 0, no ratings given till now",
            averageRating:0,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
}

//get all rating and review

exports.getAllRating = async(req, res) => {
    try{
        const allReviews = await RatingAndReviews.find({})
                                       .sort({rating: "desc"})
                                       .populate({
                                         path:"user",
                                         select:"firstName lastName email image",
                                       })
                                       .populate({
                                        path:"course",
                                        select:"courseName",
                                       })
                                       .exec();
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            details:allReviews,
        });                              

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}