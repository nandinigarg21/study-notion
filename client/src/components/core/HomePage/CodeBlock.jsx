import React from "react";
import CTAbutton from "../HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";


const CodeBlock = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient,codeColour }) => {
  return (
    <div>
       <div className={`flex ${position} my-20 justify-between gap-10`}>

            {/*section1*/}
            <div className="w-[50%] flex flex-col gap-8">
                {heading}
           

            <div className="text-richblack-300 font-bold">
                {subheading}
            </div>

            <div className="flex gap-7 mt-7">
                <CTAbutton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className="flex gap-2 item-center">
                        {ctabtn1.btntext}
                         { <FaArrowRight/> }

                    </div>
                </CTAbutton>

                <CTAbutton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    {ctabtn2.btntext}

                </CTAbutton>
            </div>
             </div>

             {/*section2*/}
             <div className="h-fit flex flex-row text-[10px] w-[100%] py-4 lg:w-[500px]">
                {/* HW-bg-gradient*/}

                <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                     <p>11</p>
                </div>

                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColour} pr-2`}>
                   <TypeAnimation
                     sequence={[codeblock, 2000, ""]}
                     repeat={Infinity}
                     cursor={true}

                     style={
                        {
                            whiteSpace: "pre-line",
                            display:"block",
                        }
                     }
                     omitDeletionAnimation={true}
                   />
                </div>
             </div>


        </div>
    </div>
  )
}

export default CodeBlock
