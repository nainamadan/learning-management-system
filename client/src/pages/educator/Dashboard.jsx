import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AddContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { currency, backendUrl, getToken } = useContext(AppContext);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!dashboardData) return <Loading />;

  return (
    <div className="space-y-6 pb-10">

      {/* ── TOP CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 px-4">

        {/* Total Enrollments */}
        <div className="bg-white border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <img src={assets.patients_icon} className="w-12 h-12" />
          <div>
            <p className="text-2xl font-semibold">
              {dashboardData.enrolledStudentsData?.length || 0}
            </p>
            <p className="text-sm text-gray-500">Total Enrollments</p>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <img src={assets.appointments_icon} className="w-12 h-12" />
          <div>
            <p className="text-2xl font-semibold">
              {dashboardData.totalCourses || 0}
            </p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <img src={assets.earning_icon} className="w-12 h-12" />
          <div>
            <p className="text-2xl font-semibold">
              {currency}{dashboardData.totalEarnings || 0}
            </p>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>
        </div>

      </div>

      {/* ── LATEST STUDENTS ── */}
      <div className="bg-white border rounded-xl p-5 mx-4">
        <h2 className="text-lg font-semibold mb-4">Latest Enrolled Students</h2>

        {/* DESKTOP TABLE (sm and above) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Course</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.enrolledStudentsData?.map((item, index) => (
                <tr key={index} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.student.imageUrl}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <span className="font-medium text-gray-700">
                        {item.student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS (below sm) */}
        <div className="sm:hidden flex flex-col gap-3">
          {dashboardData.enrolledStudentsData?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50"
            >
              {/* Index badge */}
              <span className="text-xs font-semibold text-gray-400 w-5 text-center flex-shrink-0">
                {index + 1}
              </span>

              {/* Avatar */}
              <img
                src={item.student.imageUrl}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />

              {/* Info */}
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-gray-800 text-sm truncate">
                  {item.student.name}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {item.courseTitle}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
