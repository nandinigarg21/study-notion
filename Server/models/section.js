
const mongoose = require("mongoose");


const sectionSchema = new mongoose.Schema({

   sectionName:  {
       type:String,
   },
   subSection:{
      type:mongoose.Schema.type.ObjectId,
      required:true,
      ref:"subSection",
   },
});

module.exports = mongoose("section", sectionSchema);