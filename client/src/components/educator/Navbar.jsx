import React, { useState, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full h-16 px-4 lg:px-8 flex items-center justify-between border-b bg-white">

      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 lg:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Desktop: name + UserButton */}
        <p className="hidden sm:block text-sm font-medium text-gray-700">
          {user ? user.fullName : "Developers"}
        </p>
        <div className="hidden sm:flex items-center">
          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <img
              src={assets.profile_img}
              alt="profile"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          )}
        </div>

        {/* Mobile: Hamburger */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex flex-col justify-center items-center w-9 h-9 rounded-md border border-gray-200 bg-white shadow-sm gap-1.5 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">

              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                {user ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <img src={assets.profile_img} alt="profile" className="w-8 h-8 rounded-full" />
                )}
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user ? user.fullName : "Developers"}
                </p>
              </div>

              {/* Options */}
              <ul className="py-1 text-sm text-gray-700">

                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    onClick={() => { navigate("/"); setMenuOpen(false); }}
                  >
                    🏠 Home
                  </button>
                </li>

                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    onClick={() => { navigate("/my-enrollments"); setMenuOpen(false); }}
                  >
                    👤 My Account
                  </button>
                </li>

                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                    onClick={() => { signOut(); setMenuOpen(false); }}
                  >
                    🚪 Logout
                  </button>
                </li>

              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
