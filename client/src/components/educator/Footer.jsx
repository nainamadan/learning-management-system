import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img src={assets.logo} alt="logo" className="w-28" />
          
        </div>
<p className="text-2xl text-gray-500">
            Copyright 2026 © Edemy. All rights reserved.
          </p>
        {/* Right - Social Icons */}
        <div className="flex gap-6">
          <a href="#" className="transition hover:opacity-100 opacity-70">
            <img
              src={assets.facebook_icon}
              alt="facebook"
              className="w-7 h-7"
            />
          </a>

          <a href="#" className="transition hover:opacity-100 opacity-70">
            <img
              src={assets.twitter_icon}
              alt="twitter"
              className="w-7 h-7"
            />
          </a>

          <a href="#" className="transition hover:opacity-100 opacity-70">
            <img
              src={assets.instagram_icon}
              alt="instagram"
              className="w-7 h-7"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
