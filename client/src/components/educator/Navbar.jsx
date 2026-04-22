import React from "react";
import { assets } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
// import { AppContext } from "../../context/AddContext.jsx";

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="w-full h-16 px-4 lg:px-8 flex items-center justify-between border-b bg-white">
      
      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 lg:w-32 cursor-pointer"
        // onClick={() => navigate("/")}
      />

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <p className="hidden sm:block text-sm font-medium text-gray-700">
          {user ? user.fullName : "Developers"}
        </p>

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
    </nav>
  );
};

export default Navbar;
