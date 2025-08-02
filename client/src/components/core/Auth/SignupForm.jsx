import React from 'react'
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import {setSignupData} from '../../../slices/authSlice';
import Tab from "../../common/Tab"
import { ACCOUNT_TYPE } from '../../../utils/constant';


const SignupForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const[formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

    const { firstName, lastName, email, password, confirmPassword } = formData;

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name] : e.target.value
        }))
    }


    const handleOnSubmit = (e) => {
        e.preventDefault()

        if(password !== confirmPassword) {
            toast.error("Passwords do not match");
            return
    }
    const signupData = {
        ...formData,
        accountType,
    }



    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData))
    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate))

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }

   const tabData =[
    {
        id: 1,
        tabName: "Student",
        type: ACCOUNT_TYPE.STUDENT,
    },
    {
        id: 2,
        tabName: "Instructor",
        type: ACCOUNT_TYPE.INSTRUCTOR,
    }
   ]


  return (

    <div>
        <Tab tabData={tabData} field={accountType} setField={setAccountType}/>
        <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <label>
            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>First Name</p>
            <input
            required
            name='firstName'
            value={firstName}
            onChange={handleOnChange}
            type='text'
            placeholder='Enter First Name'
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
            
        </label>

        <label>
            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>Last Name</p>
            <input 
            required
            name='lastName'
            value={lastName}
            onChange={handleOnChange}
            type='text'
            placeholder='Enter Last Name'
            style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            
            />
            
        </label>

        <label> 
            <p>Email Address</p>
            <input
            required
            name='email'
            type='text'
            value={email}
            onChange={handleOnChange}
            placeholder='Enter email address'
            style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"/>
            
        </label>

        <label>
            <p>Create Password</p>
            <input
            required
            type={showPassword ? "text" : "password"}
            name='password'
            value={password}
            onChange={handleOnChange}
            placeholder='create Password'
            style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"/>

              <span
                onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />

                ) : (
                     <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            
        </label>

        <label>
            <p>Confirm Password</p>
            <input
            required
            type={showConfirmPassword ? "text" : "password"}
            name='confirmPassword'
            value={confirmPassword}
            onChange={handleOnChange}
            placeholder='confirm password'
            style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"/>

              <span
               onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                           {showConfirmPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />

                ) : (
                     <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}



              </span>
        </label>

        <button
           type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
>
            Create Account
        </button>

    </form>
        
    </div>
  )
}

export default SignupForm
