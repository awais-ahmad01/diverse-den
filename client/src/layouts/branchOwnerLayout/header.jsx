import React from "react";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";

const BranchOwnerDashboardHeader = ({ toggleSidebar, hamburgerRef }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div
        className="flex justify-between items-center text-white 
      px-4 py-2 sm:px-10 sm:py-2 bg-[#603F26] border-b-4 border-[#8e6c4f]
      fixed top-0 left-0 w-full z-50"
      >
        {/* Hamburger Icon */}
        <div className="sm:hidden" ref={hamburgerRef}>
          <FaBars
            onClick={toggleSidebar} // Trigger the sidebar toggle
            className="text-white text-2xl cursor-pointer"
          />
        </div>

        {/* App Title */}
        <div>
          <h1 className="text-2xl font-bold">Diverse Den</h1>
        </div>

        <div className="profile-section">
          <div
            className="flex justify-center items-center gap-2"
            onClick={handleDropdown}
          >
            <Avatar
              alt="Awais"
              src="/images/me.jpeg"
              sx={{ width: 28, height: 28,  border: '1px solid white' }}
            />
            <div className="hidden sm:block">
              <h1>Awais Ahmad</h1>
            </div>
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu w-[150px] sm:w-[100%] border-t-0 pt-2">
              <a href="/profile">View Profile</a>
              <a href="/logout">Logout</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchOwnerDashboardHeader;