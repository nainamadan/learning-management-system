import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AddContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    setCourses(allCourses);
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, [allCourses]);

  if (!courses) return <Loading />;

  return (
    <div className="mt-6 px-3 sm:px-6 space-y-6">
      {/* Heading */}
      <h1 className="text-lg sm:text-xl font-semibold">
        My Courses
      </h1>

      {/* Table Wrapper */}
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
              const earnings = Math.floor(
                course.enrolledStudents.length *
                  (course.coursePrice -
                    (course.discount * course.coursePrice) / 100)
              );

              return (
                <tr
                  key={course._id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  {/* Course */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-14 h-9 rounded object-cover flex-shrink-0"
                      />
                      <span className="font-medium text-gray-700 line-clamp-2">
                        {course.courseTitle}
                      </span>
                    </div>
                  </td>

                  {/* Earnings */}
                  <td className="px-4 py-3 font-medium">
                    {currency}
                    {earnings}
                  </td>

                  {/* Students */}
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
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
