import React, { useState, useEffect, useRef } from "react";
import SideBar from "./sideBar";
import BranchOwnerDashboardHeader from "./header";

const BranchOwnerLayout = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hamburgerRef = useRef(null); // Ref for hamburger icon

  // Toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Handle window resizing to open or collapse the sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSidebarOpen(true); // Automatically open sidebar on large screens
      } else {
        setIsSidebarOpen(false); // Collapse sidebar on small screens
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <BranchOwnerDashboardHeader toggleSidebar={toggleSidebar} hamburgerRef={hamburgerRef} />
      
      {/* Layout with Sidebar and Main Content */}
      <div className="flex flex-1 mt-16"> {/* mt-16 creates space for the fixed header */}
        {/* Sidebar */}
        <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} toggleSidebar={toggleSidebar} 
        hamburgerRef={hamburgerRef} />

        {/* Main Content */}
        <div className="flex-1 ml-10 sm:ml-64 p-5 mt-4 sm:mt-10">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default BranchOwnerLayout;
