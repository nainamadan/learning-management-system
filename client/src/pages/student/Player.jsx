import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AddContext.jsx";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Player = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const {
    enrolledCourses,
    calculatelectureTime,
    userData,
    getToken,
    backendUrl,
    fetchenrolledcourse,
  } = context;

  const { courseId } = useParams();

  const [coursedata, setcoursedata] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerdata, setplayerdata] = useState(null);
  const [progressData, setprogressData] = useState(null);
  const [initialRating, setinitialRating] = useState(0);

  // ✅ SAFE YouTube ID extractor
  const getVideoId = (url) => {
    try {
      const u = new URL(url);

      if (u.hostname.includes("youtube.com")) {
        return u.searchParams.get("v");
      }

      if (u.hostname.includes("youtu.be")) {
        return u.pathname.slice(1);
      }

      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!userData || !enrolledCourses?.length) return;

    const course = enrolledCourses.find((c) => c._id === courseId);
    if (!course) return;

    setcoursedata(course);

    if (course?.courseRating?.length) {
      const userRating = course.courseRating.find(
        (item) => item.userId === userData?._id
      );
      if (userRating) {
        setinitialRating(userRating.rating);
      }
    }
  }, [enrolledCourses, courseId, userData]);

  useEffect(() => {
    if (courseId && userData) {
      getCourseProgress();
    }
  }, [courseId, userData]);

  const marklectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchenrolledcourse();
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setprogressData(data.progressData);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchenrolledcourse();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!userData) {
    return <div className="p-10 text-center">Loading user...</div>;
  }

  if (!coursedata) {
    return <div className="p-10 text-center">Loading course...</div>;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-4">

        {/* LEFT SIDE */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-4">Course Structure</h1>

          {coursedata?.courseContent?.map((chapter, index) => (
            <div key={index} className="bg-white border rounded-md mb-3">
              <div
                onClick={() => toggleSection(index)}
                className="flex justify-between px-4 py-3 cursor-pointer"
              >
                <p>{chapter.chapterTitle}</p>
                <p className="text-sm text-gray-500">
                  {calculatelectureTime(chapter)}
                </p>
              </div>

              {openSection[index] &&
                chapter.chapterContent?.map((lecture, i) => (
                  <div
                    key={i}
                    className="flex justify-between px-6 py-2"
                  >
                    <p>{lecture.lectureTitle}</p>

                    <span
                      onClick={() =>
                        setplayerdata({
                          videoId: getVideoId(lecture.lectureUrl), // ✅ FIXED
                          lectureTitle: lecture.lectureTitle,
                          chapter: index + 1,
                          lecture: i + 1,
                          lectureId: lecture._id,
                        })
                      }
                      className="text-blue-600 cursor-pointer"
                    >
                      Watch
                    </span>
                  </div>
                ))}
            </div>
          ))}

          <div className="flex items-center gap-2 py-3 mt-6">
            <h1>Rate this course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-[420px] w-full">

          {playerdata?.videoId ? (
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">

              {/* VIDEO */}
              <div className="w-full aspect-video">
                <YouTube
                  videoId={playerdata.videoId}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: { autoplay: 1 },
                  }}
                />
              </div>

              <div className="p-3">
                <button
                  onClick={() =>
                    marklectureAsCompleted(playerdata.lectureId)
                  }
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {progressData?.lectureCompleted?.includes(
                    playerdata.lectureId
                  )
                    ? "Completed"
                    : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="w-full h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
  <img
    src={coursedata?.courseThumbnail}
    alt="course"
    className="max-w-full max-h-full object-contain"
  />
</div>

              <div className="p-3 text-sm text-gray-600">
                Select a lecture to start learning
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Player;