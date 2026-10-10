import React, { useContext, useMemo } from 'react'
import { assets } from "../../assets/assets.js"
import { AppContext } from "../../context/AddContext.jsx"
import SearchBar from "../../components/student/SearchBar.jsx"
import { useParams } from 'react-router-dom'
import CourseCard from "../../components/student/CourseCard.jsx"
import Footer from "../../components/student/Footer.jsx"

const CoursesList = () => {
  const {
    navigate,
    allCourses,
    isCoursesLoading,
    coursesError,
    fetchAllCourses,
  } = useContext(AppContext)

  const { input } = useParams()
  const searchTerm = input?.trim().toLowerCase() || ""
  const filteredCourses = useMemo(() => {
    const courses = Array.isArray(allCourses) ? allCourses : []
    return courses.filter(course =>
      typeof course?.courseTitle === "string" &&
      course.courseTitle.toLowerCase().includes(searchTerm)
    )
  }, [allCourses, searchTerm])

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
            <SearchBar key={input || 'all-courses'} data={input} />
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
          {!isCoursesLoading && !coursesError && filteredCourses.map((course, index) => (
            <CourseCard key={course._id || index} course={course} />
          ))}
        </div>

        {isCoursesLoading && (
          <p className="py-12 text-center text-gray-500" role="status">
            Loading courses...
          </p>
        )}

        {!isCoursesLoading && coursesError && (
          <div className="py-12 text-center" role="alert">
            <p className="text-gray-600">{coursesError}</p>
            <button
              type="button"
              onClick={fetchAllCourses}
              className="mt-4 rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        )}

        {!isCoursesLoading && !coursesError && filteredCourses.length === 0 && (
          <p className="py-12 text-center text-gray-500">
            {searchTerm
              ? `No courses found for "${input}".`
              : "No courses are available yet."}
          </p>
        )}

      </div>

      <Footer />
    </div>
  )
}

export default CoursesList
