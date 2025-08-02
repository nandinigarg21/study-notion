
const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.type.ObjectId,
        ref:"Course",
    },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

    completedVideos:[
        {
        type:mongoose.Schema.type.ObjectId,
        ref:"subSection",
    }
],
    

});

module.exports = mongoose("courseProgress", courseProgressSchema);