// this file will have all common logics state and functions
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import {useNavigate, } from 'react-router-dom'
import humanizeDuration from "humanize-duration";
import {useAuth,useUser} from "@clerk/clerk-react"
import axios from "axios"
import {toast} from "react-toastify";
export const AppContext=createContext(null);

export const AppContextProvider=(props)=>{

// creating currency an env variable
const currency=import.meta.env.VITE_CURRENCY

// navigate to home page on clicking on logo from any page
const navigate=useNavigate()
// get all course data
const[allCourses,setAllCourses]=useState([])

// iseducator will get diff nav bar
const[isEducator,setIsEducator]=useState(false)
// enrollements
const[enrolledCourses,setEnrolledCourses]=useState([])

// fn to fetch user data from api and store in a state
const[userData,setuserData]=useState({})
// fn to add data in this state
const fetchenrolledcourse=async()=>{
  // setEnrolledCourses(dummyCourses)
  try {
    if (!user) return; 
     // send token in request to get user data
    const token=await getToken();
      if (!token) return; 
    const {data}=await axios.get(backendUrl+'/api/user/enrolled-courses',{headers:{Authorization:`Bearer ${token}`}})
    if(data.success){
      // reverse the list of courses and will get new courses at first
      setEnrolledCourses(data.enrolledCourses.reverse())
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}
// url backend
const backendUrl=import.meta.env.VITE_BACKEND_URL
const fetchAllCourses=async()=>{
  // setAllCourses(dummyCourses)
  try {
    const {data}=await axios.get(
       // backend url
      backendUrl + 
      // remaining path
      '/api/course/all'
    )
    if(data){
    setAllCourses(data.courses)
    }else{
      // toastify
     toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}
// create user in mongodb after clerk login
const createUserInDB = async () => {
  if (!user) return;

  try {
    const token = await getToken();
    if (!token) return;

    await axios.post(
      backendUrl + "/api/user/create-user",
      {
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        image: user.imageUrl,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

  } catch (error) {
    console.log("Create user error:", error.message);
  }
};

// fetch user data
const fetchuserData=async()=>{
   if (!user) return;
   if(user?.publicMetadata?.role==='educator'){
    setIsEducator(true);
  }
  try {
    // send token in request to get user data
      
    const token=await getToken();
    if (!token) return;
    // mak api call
    const {data}=await axios.get(backendUrl+'/api/user/data',
      // other details also header in which we will pss the authorization
      {headers:{Authorization :`Bearer ${token}`}} )
      // get data and store it in
if(data.success){
  setuserData(data.user)
}else{
  toast.error(data.message)
}
   
  } catch (error) {
    toast.error(error.message)
  }
}
// execute the fn
useEffect(()=>{
  
  fetchAllCourses()
  // fetchenrolledcourse()
},[])
// fn to calculate average rating
const calculateRating = (course) => {
  if (!course?.courseRatings || course.courseRatings.length === 0) {
    return 0
  }

  let totalRating = 0

  course.courseRatings.forEach(rating => {
    totalRating += rating.rating
  })

  return Math.floor(totalRating / course.courseRatings.length)
}


// fn to calculate course chapter time
// each chapter have multile lectures
const calculatelectureTime=(chapter)=>{
  let time=0
  chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration)
// this time is in minutes
return humanizeDuration(time*60*1000,{units:["h","m"]})
}
// course duration

const calculateCourseTime=(course)=>{
  let time=0
  course.courseContent.map((chapter)=>chapter.chapterContent.map((lecture)=>
 time+=lecture.lectureDuration))
// this time is in minutes
return humanizeDuration(time*60*1000,{units:["h","m"]})
}

// total lecture in course
const countlectures=(course)=>{
let count=0;
course.courseContent.forEach(chapter=>{
  if(Array.isArray(chapter.chapterContent)){
    count+=chapter.chapterContent.length
  }
})
return count;
}

// simple user=>educator so can add courses
// http://localhost:5000/api/educator/update-role using token
// generate token.. getauth and getuser from clerk
const {getToken}=useAuth(
)
const {user}=useUser()
// const logToken=async()=>{
//   console.log(await getToken());
  
// }
// function to log token in console
const logToken = async () => {
  try {
    const token = await getToken();
    console.log("Clerk Token:", token);
  } catch (error) {
    console.log("Token error:", error);
  }
};

useEffect(() => {
  if (!user) return;

  const loadData = async () => {
    await logToken();   
    await createUserInDB();   
    await fetchuserData();
    await fetchenrolledcourse();
  };

  loadData();

}, [user]);


  const value={
    // to access these thing in other component
currency,allCourses,navigate,calculateRating,isEducator,setIsEducator,countlectures,calculateCourseTime,calculatelectureTime,enrolledCourses,fetchenrolledcourse,
backendUrl,userData,setuserData,getToken,fetchAllCourses
  }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}