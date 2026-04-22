import React, { useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets.js";
import Loading from "../../components/student/Loading.jsx";

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  useEffect(() => {
    setEnrolledStudents(dummyStudentEnrolled);
  }, []);

  if (!enrolledStudents) return <Loading />;

  return (
    <div className="p-4">
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{index + 1}</td>

                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.student.imageUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">
                    {item.student.name}
                  </span>
                </td>

                <td className="p-3">{item.courseTitle}</td>

                <td className="p-3">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {enrolledStudents.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={item.student.imageUrl}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{item.student.name}</p>
                <p className="text-sm text-gray-500">
                  #{index + 1}
                </p>
              </div>
            </div>

            <p className="text-sm">
              <span className="font-semibold">Course:</span>{" "}
              {item.courseTitle}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(item.purchaseDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsEnrolled;