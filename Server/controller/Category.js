const Category = require("../models/Category");
const {mongoose} = require("mongoose");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }


//create category
exports.createCategory = async(req,res) => {
    try{
        //fetch data
        const {name, description} = req.body;

        //validation
        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message:"All field are require",
            })
        }

        //create an entry in db
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Category creaated successfully",
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })

    }
};

//create allCategory

exports.showAllCategory = async(req,res) => {
    try{
             console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});



    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })


    }
};

//category page details
exports.categoryPageDetails = async(req, res) => {
    try{
        //get categoryId
        const {categoryId} = req.body;
        console.log("PRINTING CATEGORY ID: ", categoryId);

        ///get course for specified category
        const selectCategory = await Category.findById(categoryId)
                                        .populate({
                                             path: "courses",
                                             match: { status: "Published" },
                                             populate: "ratingAndReviews",
                                            })
                                        .exec()
        //validation
        if(!selectCategory) {
            console.log("Category not found.")

            return res.status(404).json({
              
                success:false,
                message:"Data not found",
            });
        } 
        // Handle the case when there are no courses
      if (selectCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
             // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }