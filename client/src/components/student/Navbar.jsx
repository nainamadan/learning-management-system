import React, { useContext } from "react";

import {assets} from "../../assets/assets.js"
import {Link} from "react-router-dom"
import {useClerk,UserButton,useUser} from "@clerk/clerk-react"
import { AppContext } from "../../context/AddContext.jsx";
import { toast } from "react-toastify";
import axios from "axios"
const Navbar = () => {
const {navigate,isEducator,backendUrl,setisEducator,getToken}=useContext(AppContext)
  // diffent pages have differnt header
const isCourseListPage=location.pathname.includes('/course-list');

// signuin form will occur when clicked on the button
const {openSignIn}=useClerk();

const {user}=useUser();
// become eduactor fn
const becomeEducator = async () => {
  try {
    if (isEducator) {
      // user already educator
      navigate('/educator');
      return;
    } else {
      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + '/api/educator/update-role',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate('/educator'); // optional redirect after success
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  return (
    <div className={`navbar flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage?'bg-white':'bg-cyan-100/70'}`}>
      {/* Left */}
      <img src={assets.logo} onClick={()=>navigate('/')}
      alt="logo" className="w-28 lg:w-32 cursor-pointer" />
    <div className="hidden md:flex items-center gap-5 text-gray-500">
      <div className="flex items-center gap-5">
     
      {
        // when user is logged in these 2 things will be visible
        user && <>
        <button onClick={()=>{becomeEducator}}>{isEducator?'Educator Dashboard':"Become Educator"}</button>
        <Link to='/my-enrollments'>My Enrollments </Link></>
      }
      </div>
      {user ?<UserButton/>:<button  onClick={()=>openSignIn()} className="bg-blue-600 text-white px-5 py-2 rounded-full">Create Account</button>}

    </div>
    {/* for small screes */}
    <div className=" md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
<div className=" flex items-center gap-1 sm:gap-2 max-sm:text-xs">
       {
        user && <>
        <button onClick={()=>{becomeEducator}}>{isEducator?'Educator Dashboard':"Become Educator"}</button>
        <Link to='/my-enrollments'>My Enrollments </Link></>
      }
      </div>
      {
        user?<UserButton />:
        <button onClick={()=>openSignIn()}><img src={assets.user_icon} alt="" /></button>
      }
      
    </div>
    </div>
  );
};

export default Navbar;
