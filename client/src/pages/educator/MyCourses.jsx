import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AddContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { currency, backendUrl, getToken } = useContext(AppContext);

  const [courses, setCourses] = useState(null);

  // 🔥 FETCH REAL COURSES FROM BACKEND
  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/educator/courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  return (
    <div className="mt-6 px-3 sm:px-6 space-y-6">

      {/* Heading */}
      <h1 className="text-lg sm:text-xl font-semibold">
        My Courses
      </h1>

      {/* Table */}
      <div className="bg-white border rounded-xl p-4 sm:p-6 overflow-x-auto">

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

              const priceAfterDiscount =
                course.coursePrice -
                (course.coursePrice * course.discount) / 100;

              const earnings =
                (course.enrolledStudents?.length || 0) *
                priceAfterDiscount;

              return (
                <tr
                  key={course._id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  {/* COURSE */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.courseThumbnail}
                        className="w-14 h-9 object-cover rounded"
                        alt="course"
                      />
                      <span className="font-medium text-gray-700">
                        {course.courseTitle}
                      </span>
                    </div>
                  </td>

                  {/* EARNINGS */}
                  <td className="px-4 py-3 font-medium">
                    {currency}
                    {earnings.toFixed(0)}
                  </td>

                  {/* STUDENTS */}
                  <td className="px-4 py-3">
                    {course.enrolledStudents?.length || 0}
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default MyCourses;