import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AddContext'

const CourseCard = ({ course }) => {

  // Getting currency and rating calculator from context
  const { currency, calculateRating } = useContext(AppContext)

  // Safety check: agar course null ho
  if (!course) return null

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => window.scrollTo(0, 0)}
      className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg hover:shadow-md transition'
    >
      {/* Course Thumbnail */}
      <img
        className='w-full h-40 object-cover'
        src={course.courseThumbnail || assets.course_1_thumbnail}
        alt="course"
      />

      <div className='p-3 text-left space-y-1'>

        {/* Course Title */}
        <h3 className='text-base font-semibold'>
          {course.courseTitle}
        </h3>

        {/* Educator Name (SAFE ACCESS) */}
        <p className='text-sm text-gray-500'>
          {course.educator?.name || "Unknown Educator"}
        </p>

        {/* Rating Section */}
        <div className='flex items-center gap-2'>
          
          {/* Average Rating */}
          <p className='text-sm'>
            {calculateRating(course)}
          </p>

          {/* Star Icons */}
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                className='w-3.5 h-3.5'
                alt="star"
              />
            ))}
          </div>

          {/* Total Ratings Count */}
          <p className='text-sm text-gray-500'>
            ({course.courseRating?.length || 0})
          </p>
        </div>

        {/* Discounted Price */}
        <p className='text-base font-semibold text-gray-800'>
          {currency}
          {(
            course.coursePrice -
            (course.discount * course.coursePrice) / 100
          ).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

export default CourseCard
