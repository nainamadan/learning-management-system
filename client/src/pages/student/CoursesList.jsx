import React, { useContext, useEffect, useState } from 'react'
import { assets } from "../../assets/assets.js"
import { AppContext } from "../../context/AddContext.jsx"
import SearchBar from "../../components/student/SearchBar.jsx"
import { useParams } from 'react-router-dom'
import CourseCard from "../../components/student/CourseCard.jsx"
import Footer from "../../components/student/Footer.jsx"

const CoursesList = (props) => {
  const { navigate, allCourses } = useContext(AppContext)

  // take input
  const { input } = useParams()

  // filtered data ..the thing we will search will get data acc to it
  const [filteredCourse, setFilteredCourse] = useState([])

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempcourses = allCourses.slice()
      input
        ? setFilteredCourse(
            tempcourses.filter(item =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempcourses)
    }
  }, [allCourses, input])

  return (
    <div className="relative bg-gray-50 min-h-screen flex flex-col">
      
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-16 py-10 flex-grow">
        
        {/* top section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          
          {/* left part */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Course List
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate('/')}
              >
                Home
              </span>
              {' '} / Course
            </p>
          </div>

          {/* right part */}
          <div className="w-full md:w-[420px]">
            <SearchBar data={input} />
          </div>
        </div>

        {/* active filter chip */}
        {input && (
          <div className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 w-fit mb-8">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt="remove filter"
              className="cursor-pointer w-4 h-4"
              onClick={() => navigate('/course-list')}
            />
          </div>
        )}

        {/* all courses grid */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >
          {filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default CoursesList
