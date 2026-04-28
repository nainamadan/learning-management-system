import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from "../../components/educator/Navbar.jsx"
import Sidebar from "../../components/educator/Sidebar.jsx"
import Footer from "../../components/educator/Footer.jsx"

const Educator = (props) => {
  return (
    <div className='text-default min-h-screen bg-white flex flex-col'>
      <Navbar />

      {/* Mobile: Sidebar upar (horizontal bar), Desktop: Sidebar baayein */}
      <div className='flex flex-col md:flex-row flex-1'>
        <Sidebar />
        <div className='flex-1 min-w-0'>
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Educator
