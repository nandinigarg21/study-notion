
const mongoose = require("mongoose");

const RatingAndReviewSchema = new mongoose.Schema({
   user:{
     type:mongoose.Schema.type.ObjectId,
     required:true,
     ref:"User",
   },
   rating:{
    type:Number,
    required:true,

   },
   review:{
    type:String,
    required:true,

   },
   course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},

    

});

module.exports = mongoose("RatingAndReview", RatingAndReviewSchema);