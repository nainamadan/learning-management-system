import React, { useContext } from 'react'
import { assets } from "../../assets/assets.js"
import { AppContext } from "../../context/AddContext.jsx"

const Footer = () => {
  const { navigate } = useContext(AppContext)

  return (
    <footer className="bg-gray-900 text-gray-300 w-full mt-10 pt-14 px-6 md:px-24">
      
      {/* top footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 pb-12">
         
        {/* 1st partition */}
        <div className="space-y-4">
          <img
            src={assets.logo_dark}
            onClick={() => navigate('/')}
            alt="logo"
            className="w-28 lg:w-32 cursor-pointer"
          />
          <p className="text-sm text-gray-400 leading-relaxed">
            A smart LMS designed to deliver seamless learning through curated
            content, assessments, and performance insights.
          </p>
        </div>

        {/* 2nd partition */}
        <div className="sm:pl-10">
          <h3 className="text-white font-semibold mb-4">
            Company
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white transition cursor-pointer">Home</li>
            <li className="hover:text-white transition cursor-pointer">About Us</li>
            <li className="hover:text-white transition cursor-pointer">Contact Us</li>
            <li className="hover:text-white transition cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* 3rd partition */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold">
            Subscribe to our LMS
          </h3>

          <p className="text-sm text-gray-400 leading-relaxed">
            Our LMS helps students learn anytime, anywhere with expert-led
            courses and practical knowledge to build real skills.
          </p>

          <div className="flex w-full max-w-sm">
            <input
              type="text"
              placeholder="Enter your name"
              className="flex-1 px-3 py-2 text-sm rounded-l-md outline-none text-gray-800"
            />
            <button className="bg-blue-600 px-5 py-2 text-sm text-white rounded-r-md hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* horizontal line */}
      <hr className="border-gray-700" />

      {/* bottom footer */}
      <div className="text-center text-sm text-gray-400 py-5">
        Copyright 2026 © Edemy. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer
