import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/AddContext";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/educator/dashboard",
      icon: assets.home_icon,
    },
    {
      name: "Add Courses",
      path: "/educator/add-course",
      icon: assets.add_icon,
    },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Students Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  if (!isEducator) return null;

  return (
    <aside className="w-64 h-[calc(100vh-64px)] bg-white border-r p-4">
      <ul className="space-y-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-5 h-5"
              />
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
