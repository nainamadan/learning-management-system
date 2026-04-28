import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../../assets/assets.js";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AddContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext);

  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/update-role", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate("/educator");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className={`navbar flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      {/* Logo */}
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        alt="logo"
        className="w-28 lg:w-32 cursor-pointer"
      />

      {/* ── DESKTOP MENU (md and above) ── */}
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        {user && (
          <>
            <button onClick={becomeEducator} className="hover:text-gray-800 transition">
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>
            <Link to="/my-enrollments" className="hover:text-gray-800 transition">
              My Enrollments
            </Link>
          </>
        )}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>

      {/* ── MOBILE MENU (below md) ── */}
      <div className="md:hidden flex items-center gap-3">

        {/* Not logged in: user icon */}
        {!user && (
          <button onClick={() => openSignIn()} className="flex items-center">
            <img src={assets.user_icon} alt="login" className="w-7 h-7" />
          </button>
        )}

        {/* Logged in: UserButton + hamburger with correct options */}
        {user && (
          <>
            <UserButton />

            <div className="relative" ref={menuRef}>
              {/* Hamburger button */}
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex flex-col justify-center items-center w-9 h-9 rounded-md border border-gray-300 bg-white shadow-sm gap-1.5 cursor-pointer"
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>

              {/* Dropdown — only correct options */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <button
                        onClick={() => { becomeEducator(); setMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        🎓 {isEducator ? "Educator Dashboard" : "Become Educator"}
                      </button>
                    </li>
                    <li>
                      <Link
                        to="/my-enrollments"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        📚 My Enrollments
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
