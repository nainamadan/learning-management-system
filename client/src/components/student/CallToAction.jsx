import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = (props) => {
  return (
    <div className='bg-blue-50 py-10 px-4'>
      
      <div className='max-w-3xl mx-auto text-center'>
        
        <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800'>
          Learn anything, anytime, anywhere
        </h1>

        <p className='mt-3 text-gray-600 text-sm max-w-xl mx-auto'>
          Our LMS makes learning easy and flexible, letting students learn at their own pace with expert-designed courses.
        </p>

        <div className='mt-5 flex flex-col sm:flex-row gap-3 justify-center'>
          
          <button className='px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition'>
            Get started
          </button>

          <button className='px-5 py-2 border border-blue-600 text-blue-600 text-sm rounded-md flex items-center justify-center gap-2 hover:bg-blue-100 transition'>
            Learn More
            <img className='h-3' src={assets.arrow_icon} alt="arrow icon" />
          </button>

        </div>
      </div>

    </div>
  )
}

export default CallToAction
