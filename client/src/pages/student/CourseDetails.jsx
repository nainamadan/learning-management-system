import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AppContext } from "../../context/AddContext"
import { assets } from "../../assets/assets"
import Loading from "../../components/student/Loading"
import humanizeDuration from "humanize-duration"
import Footer from "../../components/student/Footer"
import YouTube from "react-youtube"
import { toast } from "react-toastify"
import axios from "axios" // ✅ added

const CourseDetails = () => {
  const { id } = useParams()

  const {
    allCourses,
    calculateRating,
    calculatelectureTime,
    calculateCourseTime,
    countlectures,
    currency,
    backendUrl,
    // want data for purchase
    userData,
    getToken
  } = useContext(AppContext)

  const [coursedata, setcoursedata] = useState(null)
  // toggle k liye
  const [openSection, setOpenSection] = useState({})
  const [playerdata, setplayerdata] = useState(null)
  const [enroll] = useState(false)
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false) // ✅ added

  // fetch course
  // ✅ Improved fetch course logic
useEffect(() => {
  const fetchCourse = async () => {
  try {
    const { data } = await axios.get(backendUrl + "/api/course/" + id);
    
    console.log("DEBUG: API Response ->", data); // <--- ADD THIS

    if (data.success) {
      setcoursedata(data.coursedata);
    } else {
      console.error("DEBUG: Success was false", data.message);
      setcoursedata(false);
    }
  } catch (error) {
    console.error("DEBUG: Network Error", error);
    setcoursedata(false);
  }
};

  if (id) {
    fetchCourse();
  }
}, [id, backendUrl]);

  // buy course
  const enrollCourse = async () => {
    try {
      if (!userData) {
        toast.warn("login to enroll")
        return
      }

      // user has already enrolled
      if (isAlreadyEnrolled) {
        toast.warn("already enrolled")
        return
      }

      // to make call api need token
      const token = await getToken()

      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        // provide ata in body
        { courseId: coursedata._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        // user ko is urll pe bhejna h jispe vo payment kre
        const { session_url } = data
        window.location.replace(session_url)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (userData && coursedata) {
      setIsAlreadyEnrolled(
        userData.enrolledCourses?.includes(coursedata._id)
      )
    }
  }, [userData, coursedata])

  // open first chapter
  useEffect(() => {
    if (coursedata?.courseContent?.length) {
      setOpenSection({ 0: true })
    }
  }, [coursedata])

  const toggleSection = index => {
    setOpenSection(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (!coursedata) return <Loading />

  return (
    <div className="relative bg-gray-50">
      {/* gradient */}
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-cyan-100/70 to-white -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-16 flex flex-col lg:flex-row gap-12">

        {/* LEFT CONTENT */}
        <div className="flex-1 text-gray-600">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
            {coursedata.courseTitle}
          </h1>

          <p
            className="pt-4 text-sm sm:text-base leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: coursedata.courseDescription?.slice(0, 200),
            }}
          />

          {/* rating */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
            <span className="font-medium text-gray-800">
              {calculateRating(coursedata)}
            </span>

            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(coursedata))
                      ? assets.star
                      : assets.star_blank
                  }
                  className="w-4 h-4"
                  alt=""
                />
              ))}
            </div>

            <span>
              {coursedata.courseRatings?.length || 0} ratings
            </span>

            <span>
              {coursedata.enrolledStudents?.length || 0} students
            </span>
          </div>

          <p className="mt-3 text-sm">
            Course by{" "}
            <span className="text-blue-600 underline">
              {coursedata.educator?.name}
            </span>
          </p>

          {/* COURSE STRUCTURE */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800">
              Course Content
            </h2>

            <div className="mt-5 space-y-3">
              {coursedata.courseContent?.map((chapter, index) => (
                <div key={index} className="bg-white border rounded-md">
                  <div
                    onClick={() => toggleSection(index)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt=""
                        className={`transition-transform ${
                          openSection[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="font-medium">
                        {chapter.chapterTitle}
                      </p>
                    </div>

                    <p className="text-sm text-gray-500">
                      {chapter.chapterContent.length} lectures ·{" "}
                      {calculatelectureTime(chapter)}
                    </p>
                  </div>

                  {openSection[index] && (
                    <ul className="px-6 pb-4">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li
                          key={i}
                          className="flex justify-between gap-4 py-2 border-t"
                        >
                          <div className="flex gap-2">
                            <img
                              src={assets.play_icon}
                              alt=""
                              className="w-4 h-4 mt-1"
                            />
                            <p className="text-sm text-gray-700">
                              {lecture.lectureTitle}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            {lecture.isPreviewFree && (
                              <span
                                onClick={() =>
                                  setplayerdata({
                                    videoId:
                                      lecture.lectureUrl.split("/").pop(),
                                  })
                                }
                                className="text-blue-600 cursor-pointer hover:underline"
                              >
                                Preview
                              </span>
                            )}

                            <span>
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full lg:w-[360px]">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden sticky top-24">

            {playerdata ? (
              <div className="relative w-full aspect-video">
                <YouTube
                  videoId={playerdata.videoId}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: { autoplay: 1 },
                  }}
                  className="absolute inset-0 w-full h-full"
                  iframeClassName="w-full h-full"
                />
              </div>
            ) : (
              <img
                src={coursedata.courseThumbnail}
                alt=""
                className="w-full aspect-video object-cover"
              />
            )}

            <div className="p-6 space-y-5">

              {/* enroll button */}
              <button
                onClick={enrollCourse}
                className={`w-full py-3 rounded-md text-white font-medium transition ${
                  isAlreadyEnrolled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isAlreadyEnrolled
                  ? "Already Enrolled"
                  : "Enroll Now"}
              </button>

            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default CourseDetails
