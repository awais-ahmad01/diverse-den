import React from "react";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/actions/auth";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const RiderHeader = ({ toggleSidebar, hamburgerRef }) => {

  const dispatch = useDispatch()

  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };


  const signOutUSer = ()=>{

    dispatch(signOut())
    
  }


  return (
    <div>
      <div
        className="flex justify-between items-center text-white 
      px-4 py-3 sm:px-10 sm:py-4 bg-[#603F26] border-b-4 border-[#8e6c4f]
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

        <div>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            // sx={{
            //   ...buttonStyles,
            //   "& .MuiSvgIcon-root": {
            //     ...iconStyles,
            //   },
            // }}
          >
            <Avatar
              alt="Awais"
              src="/images/me.jpeg"
              sx={{ width: 28, height: 28, border: "1px solid white" }}
            />
            <div className="hidden sm:block text-white ml-2">
              <h1>
                {user.firstname} {user.lastname}
              </h1>
            </div>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            PaperProps={{
              style: {
                width: "150px",
                backgroundColor: "#603F26",
                color: "white",
                padding: "5px",
              },
            }}
            disableScrollLock={true}
          >
            <MenuItem
              onClick={handleClose}
              sx={{
                "&:hover": {
                  backgroundColor: "#8e6c4f",
                },
                fontWeight: "bold",
              }}
            >
              <Link
                to="riderProfile"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                View Profile
              </Link>
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              sx={{
                "&:hover": {
                  backgroundColor: "#8e6c4f",
                },
                fontWeight: "bold",
              }}
            >
              <Link
                onClick={() => signOutUSer()}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Logout
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default RiderHeader;
