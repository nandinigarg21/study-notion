const Section = require("../models/section");
const subsection = require("../models/subSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader")


//create subsection

exports.subsection = async(req,res) =>{
    try{
        //fetch data
        const {sectionId, title, timeDuration, description } = req.body;
        //extract files/video
        const video = req.body.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(401).json({
                success:false,
                message:"All fields are required",
            })
            
        }
        console.log(video);

        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER-NAME);
        console.log(uploadDetails);

        //create a sub-section
        const subSectionDetails = await subsection.create({
            title:title,
            timeDuration: `${uploadDetails.duration}`,
             description:description,
            videoUrl:uploadDetails.secure_url,
        });
        //update section with sub section 
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                           {
                                                            $push:{
                                                                subsection:subSectionDetails._id,
                                                            }
                                                           },
                                                           {new:true},
        ).populate("subSection");
        //HW-
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub-Secton created successfully",
        })
;
    }
    catch(error){
        return res.status(500).json({
        success:false,
        error:error.message,
        
    });
    }
}

//UPDATE SUB-SECTION
exports. updateSubSection = async(req,res) => {
    try{
        //data input
        const {subSectionName, subSectionId, title, description} = req.body
        const subSection = await subSection.findById(subSectionId)


        
        //data validate
        if(!subSectionName || !subSectionId){
            return res.status(401).json({
                success:false,
                message:"Misssing details",
            });
        }
        if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()
    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)


     

        //return response
        return res.status(200).jso({
            success:true,
            message:"subSection updated successfully",
        })


    }
    catch(error){
          return res.status(500).json({
        success:false,
        message:"Unable to update subSection, please try again",
        error:error.message,
        
    });

    }
}
//DELETE SUB-SECTION
exports. deleteSubSection = async(req,res) => {
   try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }

}
