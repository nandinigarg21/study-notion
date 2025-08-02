const Section = require("../models/section");
const Course = require("../models/Course");
const SubSection = require("../models/subSection");


exports.createSection = async(req,res) => {

    try{
        //fetch data
    const {sectionName, courseId} = req.body;
    //validate data
    if(!sectionName || !courseId) {
        return res.status(401).json({
            success:false,
            message:"All field are required",
        });
    }
    //create section
    const newSection = await Section.create({sectionName});
    //update course with section objectId
    const updateCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent:newSection._id,
                                                }
                                            },
                                            {new:true},
                                            
                                           
    )
    

    //HW- use populate to replace section/subsection both in the updateCourseDetails
    .populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();
    //return response
    return res.status(200).json({
        success:true,
        message:"Section created successfully",
        updateCourseDetails,
    });

    }
    catch(error){
         return res.status(500).json({
        success:false,
        message:"Unable to create section, please try again",
        error:error.message,
        
    });

    }
}

//UPDATE SECTION
exports. updateSection = async(req,res) => {
    try{
        //data input
        const {sectionName, sectionId, courseId} = req.body;
        //data validate
        if(!sectionName || !sectionId){
            return res.status(401).json({
                success:false,
                message:"Misssing details",
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();


        //return response
        return res.status(200).jso({
            success:true,
            message:"Section updated successfully",
        })


    }
    catch(error){
          return res.status(500).json({
        success:false,
        message:"Unable to update section, please try again",
        error:error.message,
        
    });

    }
}

//DELETE SECTION
//*********** */
exports. deleteSection = async(req,res) => {
    try{
       const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();




        //return response
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
        });

    }
    catch(error){
          return res.status(500).json({
        success:false,
        message:"Unable to delete section, please try again",
        error:error.message,
        
    });
    }
}