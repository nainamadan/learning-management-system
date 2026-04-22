import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AddContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { currency } = useContext(AppContext);

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!dashboardData) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6  px-4">
        
        {/* Total Enrollments */}
        <div className="bg-white border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <img
            src={assets.patients_icon}
            alt="enrollments"
            className="w-12 h-12"
          />
          <div>
            <p className="text-2xl font-semibold">
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-sm text-gray-500">Total Enrollments</p>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <img
            src={assets.appointments_icon}
            alt="courses"
            className="w-12 h-12"
          />
          <div>
            <p className="text-2xl font-semibold">
              {dashboardData.totalCourses}
            </p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <img
            src={assets.earning_icon}
            alt="earnings"
            className="w-12 h-12"
          />
          <div>
            <p className="text-2xl font-semibold">
              {currency}
              {dashboardData.totalEarnings}
            </p>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>
        </div>
      </div>

    {/* Latest Enrolled Students */}
<div className="bg-white border rounded-xl p-5 mx-4">
  <h2 className="text-lg font-semibold mb-4">
    Latest Enrolled Students
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="text-left px-4 py-3">#</th>
          <th className="text-left px-4 py-3">Student</th>
          <th className="text-left px-4 py-3">Course</th>
        </tr>
      </thead>

      <tbody>
        {dashboardData.enrolledStudentsData.map((item, index) => (
          <tr
            key={index}
            className="border-b last:border-none hover:bg-gray-50 transition"
          >
            <td className="px-4 py-3">{index + 1}</td>

            <td className="px-4 py-3 flex items-center gap-3">
              <img
                src={item.student.imageUrl}
                alt={item.student.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-700">
                {item.student.name}
              </span>
            </td>

            <td className="px-4 py-3 text-gray-600">
              {item.courseTitle}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default Dashboard;
