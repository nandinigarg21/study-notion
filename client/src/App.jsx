
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Navbar from "./components/common/Navbar";
import Login from "./Pages/Login";

function App() {
  

  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
       
    </Routes>
   </div>
  )
}

export default App
