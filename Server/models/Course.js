
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
       type:String,
    },
    courseDescription:{
       type:String,
    },
    instructor:{
        type:mongoose.Schema.type.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },

    courseContent:[{
        type:mongoose.Schema.type.ObjectId,
        ref:"Section",
    }],

    ratingAndReviews:[{
        type:mongoose.Schema.type.ObjectId,
        ref:"RatingAndReviews",
    }],

    price:{
        type:Number,
    },
    thumbnail:{
         type:String,
    },
    tag:{
        type:[String],
        required:true,

    },
    category:{
      type:mongoose.Schema.type.ObjectId,
        ref:"Category",
    },
    studentEnrolled:{
       type:mongoose.Schema.type.ObjectId,
        ref:"User",
    },
    instructions:{
        type:[string],
    },
    status:{
        type:String,
        enum:["Draft", "Published"],
    },
    createdAt: {
		type:Date,
		default:Date.now
	},

    

});

module.exports = mongoose("Course", courseSchema);