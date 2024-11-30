import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Use react-router Link or any routing library
import { FaHome, FaBox } from 'react-icons/fa'; // Icons for navigation

const SideBar = ({ isSidebarOpen, setIsSidebarOpen, toggleSidebar, hamburgerRef }) => {
  const sidebarRef = useRef(null); // Reference to sidebar element


  const handleSideBar = () => {
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  };



  
  const handleClickOutside = (event) => {

    console.log("SideBArRef: ", sidebarRef)
    // Check if sidebar is open and sidebarRef is not null before calling .contains()
    if (
      isSidebarOpen &&
      sidebarRef.current &&  
      !sidebarRef.current.contains(event.target) && // Only proceed if click is outside the sidebar
      !hamburgerRef.current.contains(event.target) // Exclude the hamburger icon click
    ) {
      setIsSidebarOpen(false); // Close the sidebar if clicked outside
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside the sidebar
    if (isSidebarOpen && window.innerWidth < 640) {
        document.addEventListener('mousedown', handleClickOutside);  // Add listener on open sidebar
      } else {
        document.removeEventListener('mousedown', handleClickOutside);  // Remove listener if sidebar is closed
      }

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`${
        isSidebarOpen ? 'w-60' : 'hidden'
      } sm:w-60 bg-[#603F26] text-white h-full p-5 fixed top-10
        sm:top-12 left-0 transition-all duration-300`}
    >

      {/* <div className='mb-2'>
        <h1 className='text-2xl font-bold p-2'>Branch Owner</h1>
      </div> */}
      <nav className='my-2'>
        <ul>
          <li>
            <Link 
              to="test" 
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  // Close sidebar on link click
            >
              <FaHome /> {isSidebarOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to=""
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  // Close sidebar on link click
            >
              <FaBox /> {isSidebarOpen && <span>Manage Branches</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
