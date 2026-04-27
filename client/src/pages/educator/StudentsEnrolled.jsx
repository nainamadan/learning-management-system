import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Loading from "../../components/student/Loading.jsx";
import { AppContext } from "../../context/AddContext.jsx";

const StudentsEnrolled = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const [enrolledStudents, setEnrolledStudents] = useState(null);

  // 🔥 FETCH REAL DATA
  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents);
      } else {
        setEnrolledStudents([]);
      }
    } catch (error) {
      console.log(error);
      setEnrolledStudents([]);
    }
  };

  useEffect(() => {
    fetchEnrolledStudents();
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
              <tr key={index} className="border-t hover:bg-gray-50">

                <td className="p-3">{index + 1}</td>

                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.student.image}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{item.student.name}</span>
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

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-4">

        {enrolledStudents.map((item, index) => (
          <div key={index} className="border p-4 rounded bg-white">

            <div className="flex items-center gap-3 mb-2">
              <img
                src={item.student.image}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{item.student.name}</p>
                <p className="text-sm text-gray-500">#{index + 1}</p>
              </div>
            </div>

            <p><b>Course:</b> {item.courseTitle}</p>

            <p className="text-sm text-gray-600">
              <b>Date:</b> {new Date(item.purchaseDate).toLocaleDateString()}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
};

export default StudentsEnrolled;