import React, { useState, useEffect, useRef } from "react";
import AdminHeader from "./AdminHeader";
import AdminSideBar from "./adminSidebar";


const AdminLayout = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hamburgerRef = useRef(null); 


  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSidebarOpen(true); 
      } else {
        setIsSidebarOpen(false); 
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-50">
     
      <AdminHeader toggleSidebar={toggleSidebar} hamburgerRef={hamburgerRef} />
      
      
      <div className="flex flex-1 mt-14"> 

        <AdminSideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} toggleSidebar={toggleSidebar} 
        hamburgerRef={hamburgerRef} />

        
        <div className="flex-1 sm:pl-64 pt-1">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
