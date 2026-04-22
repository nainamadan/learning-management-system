import React, { useEffect } from 'react'
import { useState } from 'react';

const Rating = ({initialRating,onRate}) => {
  const[rating,setrating]=useState(initialRating||0);
  // fn to handle the rating
  const handlerating=(value)=>{
    setrating(value);
    // onrate  is the rating given by user
    if(onRate) onRate(value)
    
  }
  useEffect(()=>{
if(initialRating){
  setrating(initialRating)
}
  },[initialRating])
  return (
    <div>
      {Array.from({length:5},(_,index)=>{
const starValue=index+1;
return (
  <span key={index} className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue<=rating?'text-yellow-500':'text-gray-400'}`} 
  onClick={()=>handlerating(starValue)}>
    &#9733;
  </span>
)
      })}
    </div>
  )
}

export default Rating
