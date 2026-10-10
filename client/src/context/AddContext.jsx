// this file will have all common logics state and functions
import { createContext, useCallback, useEffect, useState } from "react";
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
const[isCoursesLoading,setIsCoursesLoading]=useState(true)
const[coursesError,setCoursesError]=useState("")

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
const fetchAllCourses=useCallback(async()=>{
  setIsCoursesLoading(true)
  setCoursesError("")

  try {
    if (!backendUrl) {
      throw new Error("Course service is not configured.")
    }

    const {data}=await axios.get(`${backendUrl}/api/course/all`)
    if (!data?.success || !Array.isArray(data.courses)) {
      throw new Error(data?.message || "Unable to load courses.")
    }

    setAllCourses(data.courses)
  } catch (error) {
    const message=error.response?.data?.message || error.message || "Unable to load courses."
    setAllCourses([])
    setCoursesError(message)
    toast.error(message)
  } finally {
    setIsCoursesLoading(false)
  }
},[backendUrl])
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
},[fetchAllCourses])
// fn to calculate average rating
const calculateRating = (course) => {
  const ratings = Array.isArray(course?.courseRating) ? course.courseRating : []
  if (ratings.length === 0) {
    return 0
  }

  const totalRating = ratings.reduce((total, rating) => total + Number(rating.rating || 0), 0)
  return Math.floor(totalRating / ratings.length)
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
currency,allCourses,isCoursesLoading,coursesError,navigate,calculateRating,isEducator,setIsEducator,countlectures,calculateCourseTime,calculatelectureTime,enrolledCourses,fetchenrolledcourse,
backendUrl,userData,setuserData,getToken,fetchAllCourses
  }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}