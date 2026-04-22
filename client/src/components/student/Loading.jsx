import React from "react"
import { useEffect } from "react"
import {useNavigate,useParams} from 'react-router-dom'
const LoadingPage = ({ text = "Loading, please wait..." }) => {


  // path
  const {path}=useParams()
  const navigate=useNavigate()
useEffect(()=>{
  if(path){
    // add time
    const timer=setTimeout(()=>{
navigate(`/${path}`)
    },5000)
    return ()=>clearTimeout(timer)
  }
},[])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      
      {/* Spinner */}
      <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

      {/* Text */}
      <p className="mt-5 text-sm sm:text-base text-gray-600">
        {text}
      </p>

    </div>
  )
}

export default LoadingPage
