import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IoSearch } from "react-icons/io5";
import { Dialog, DialogContent, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { ListItemText } from "@mui/material";

import { SimpleTreeView } from "@mui/x-tree-view";
import { TreeItem } from "@mui/x-tree-view";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [opendrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!opendrawer);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [opened, setOpened] = useState(false);

  const handleSearchClick = () => {
    setOpened(true);
  };

  const handleClosed = () => {
    setOpened(false);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 4,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
      // Make badge smaller on mobile
      [theme.breakpoints.down("sm")]: {
        fontSize: "8px",
        minWidth: "13px",
        height: "13px",
        padding: "0 3px",
      },
    },
  }));

  const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-container": {
      alignItems: "flex-start",
    },
    "& .MuiDialog-paper": {
      margin: 0,
      width: "100%",
      position: "fixed",
      top: 0,
      maxHeight: "80px",
      borderRadius: 0,
      zIndex: 9999,
    },
  }));

  // Common icon styles based on screen size
  const iconStyles = {
    color: "white",
    fontSize: {
      xs: "20px", // Extra small screens (mobile)
      sm: "24px", // Small screens
      md: "28px", // Medium screens
      lg: "30px", // Large screens
    },
  };

  // Common button styles
  const buttonStyles = {
    padding: 0,
    minWidth: "auto",
  };

  const searchIconStyles = {
    fontSize: {
      xs: "20px",
      sm: "24px",
      md: "28px",
      lg: "30px",
    },
    display: "block", // This ensures the icon takes the fontSize properly
  };

  const SearchForm = ({ isDialog = false }) => (
    <form className="relative">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full pl-10 p-4 text-sm text-white border border-transparent 
          rounded-lg bg-[#8e6c4f] focus:outline-none focus:ring-2 focus:ring-white 
          focus:border-transparent"
          placeholder="Search Products"
          required
        />
        <button
          type="submit"
          className={`absolute ${
            isDialog ? "right-[52px]" : "right-2.5"
          } text-white bg-[#603F26] hover:bg-[#7a5633] 
                    focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
                    rounded-lg ${
                      isDialog ? "text-[12px] px-3 py-2" : "text-sm px-4 py-2"
                    } transition-colors duration-200`}
        >
          Search
        </button>
        {isDialog && (
          <Button
            onClick={handleClosed}
            sx={{
              color: "white",
              minWidth: "40px",
              marginLeft: "8px",
            }}
          >
            <CloseIcon />
          </Button>
        )}
      </div>
    </form>
  );

  return (
    <div>
      <div className="w-full bg-[#603F26] py-4 px-6 md:px-8 flex justify-between items-center fixed top-0 z-40 text-white">
        <div className="md:hidden">
          <MenuIcon onClick={() => toggleDrawer()} sx={{ fontSize: 25 }} />
        </div>

        <h2 className="text-xl md:text-3xl font-bold">Diverse Den</h2>

        <div className="hidden md:block md:w-[400px] lg:w-[700px] mx-auto">
          <SearchForm isDialog={false} />
        </div>

        <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-12">
          <div className="md:hidden">
            <Button
              onClick={handleSearchClick}
              sx={{
                ...buttonStyles,
                color: "white",
                "& svg": {
                  ...searchIconStyles,
                },
              }}
            >
              <IoSearch />
            </Button>
          </div>

          <div>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                ...buttonStyles,
                "& .MuiSvgIcon-root": {
                  ...iconStyles,
                },
              }}
            >
              <AccountCircleIcon />
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
                  to="/signin"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Signin
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
                  to="/signup"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Signup
                </Link>
              </MenuItem>
            </Menu>
          </div>

          <div>
            <IconButton
              aria-label="cart"
              sx={{
                ...buttonStyles,
                "& .MuiSvgIcon-root": {
                  ...iconStyles,
                },
              }}
            >
              <StyledBadge badgeContent={2} color="secondary">
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>
          </div>
        </div>
      </div>

      <StyledDialog
        open={opened}
        onClose={handleClosed}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          style: {
            backgroundColor: "#603F26",
          },
        }}
      >
        <DialogContent sx={{ padding: "12px" }}>
          <SearchForm isDialog={true} />
        </DialogContent>
      </StyledDialog>

      {/* Side Bar */}

      <div>
        <Drawer
          open={opendrawer}
          onClose={toggleDrawer}
          PaperProps={{
            sx: {
              backgroundColor: "#603F26",
              color: "white",
              paddingTop:'30px'
            },
          }}
        >
          <Box
            sx={{ width: 250, backgroundColor: "#603F26", color: "white" }}
            role="presentation"
            // onClick={toggleDrawer}
          >
            <List>
              <ListItem>
                <SimpleTreeView>
                  {/* Clothing */}
                  <TreeItem itemId="clothing" label="CLOTHING" sx={{marginBottom:'6px'}}>
                    <TreeItem itemId="men-clothes" label="MEN">
                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>
                    </TreeItem>
                    <TreeItem itemId="women-clothes" label="WOMEN">
                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>
                    </TreeItem>
                    <TreeItem itemId="kids-clothes" label="Kids">
                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>
                    </TreeItem>
                  </TreeItem>

                  {/* SHOES */}

                  <TreeItem itemId="shoes" label="SHOES" sx={{marginBottom:'6px'}}>
                    <TreeItem itemId="men-shoes" label="MEN">
                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shirts" />
                      </ListItemButton>
                    </TreeItem>
                    <TreeItem itemId="women-shoes" label="WOMEN">
                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jeans" />
                      </ListItemButton>
                    </TreeItem>


                    {/* Kids */}
                    <TreeItem itemId="kids-shoes" label="Kids">
                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>
                    </TreeItem>
                  </TreeItem>



                  {/* FURNITURE */}
                  
                  <TreeItem itemId="furniture" label="FURNITURE" sx={{marginBottom:'6px'}}>
                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>
                    </TreeItem>

                     {/* Decoration */}
                  
                  
                  <TreeItem itemId="decoration" label="DECORATION" sx={{marginBottom:'6px'}}>
                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Jackets" />
                      </ListItemButton>
                    </TreeItem>

                </SimpleTreeView>
              </ListItem>
            </List>
            
            
          </Box>
        </Drawer>
      </div>
    </div>
  );
};

export default Header;
