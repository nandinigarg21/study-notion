import React from 'react'
import { FaArrowRight } from 'react-icons/fa';
import HighLightText from './HighlightText';
import CTAbutton from './Button';
import Instructor from '../../../assets/Images/Instructor.png';

const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className='flex flex-row items-center gap-20'>

            <div className='lg:w-[50%]'>
                <img src={Instructor} alt='' className='shadow-white'/>
            </div>

            <div className='flex flex-col gap-10 w-[50%]'>
                <h1 className="lg:w-[50%] text-4xl font-semibold ">
              Become an
              <HighLightText text={"instructor"} />
            </h1>


                
                <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
                       Instructors from around the world teach millions of students on
              StudyNotion. We provide the tools and skills to teach what you
              love.
                </p>

                <div className='w-fit'>
                  <CTAbutton active={true} linkto={"/signup"}>
                    <div className='flex  items-center gap-3'>
                        Start Learning Today
                        <FaArrowRight />
                    </div>
                </CTAbutton>
                </div>

            </div>

        </div>
      
    </div>
  )
}

export default InstructorSection
