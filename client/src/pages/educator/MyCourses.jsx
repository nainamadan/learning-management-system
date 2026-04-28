import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AddContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { currency, backendUrl, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCourses(data.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.log(error);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, []);

  if (!courses) return <Loading />;

  const getCourseStats = (course) => {
    const priceAfterDiscount =
      course.coursePrice - (course.coursePrice * course.discount) / 100;
    const students = course.enrolledStudents?.length || 0;
    const earnings = students * priceAfterDiscount;
    const date = new Date(course.createdAt).toLocaleDateString();
    return { students, earnings, date };
  };

  return (
    <div className="mt-6 px-3 sm:px-6 space-y-6 pb-10">

      <h1 className="text-lg sm:text-xl font-semibold">My Courses</h1>

      {/* ── DESKTOP TABLE (md and above) ── */}
      <div className="hidden md:block bg-white border rounded-xl p-4 sm:p-6 overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Course</th>
              <th className="text-left px-4 py-3">Earnings</th>
              <th className="text-left px-4 py-3">Students</th>
              <th className="text-left px-4 py-3">Published On</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const { students, earnings, date } = getCourseStats(course);
              return (
                <tr key={course._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.courseThumbnail}
                        className="w-14 h-9 object-cover rounded flex-shrink-0"
                        alt="course"
                      />
                      <span className="font-medium text-gray-700">
                        {course.courseTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {currency}{earnings.toFixed(0)}
                  </td>
                  <td className="px-4 py-3">{students}</td>
                  <td className="px-4 py-3 text-gray-600">{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS (below md) ── */}
      <div className="md:hidden flex flex-col gap-4">
        {courses.map((course) => {
          const { students, earnings, date } = getCourseStats(course);
          return (
            <div
              key={course._id}
              className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3"
            >
              {/* Thumbnail + Title */}
              <div className="flex gap-3 items-start">
                <img
                  src={course.courseThumbnail}
                  className="w-20 h-13 object-cover rounded flex-shrink-0"
                  alt="course"
                />
                <p className="font-medium text-gray-800 text-sm leading-snug line-clamp-3">
                  {course.courseTitle}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x border rounded-lg overflow-hidden text-center text-xs">
                <div className="py-2 px-1">
                  <p className="font-semibold text-gray-800">
                    {currency}{earnings.toFixed(0)}
                  </p>
                  <p className="text-gray-500 mt-0.5">Earnings</p>
                </div>
                <div className="py-2 px-1">
                  <p className="font-semibold text-gray-800">{students}</p>
                  <p className="text-gray-500 mt-0.5">Students</p>
                </div>
                <div className="py-2 px-1">
                  <p className="font-semibold text-gray-800">{date}</p>
                  <p className="text-gray-500 mt-0.5">Published</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MyCourses;
