import React from "react";
import { useState, useEffect } from "react";
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
import { motion } from "framer-motion";
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
import { useDispatch, useSelector } from "react-redux";

import { signOut } from "../../store/actions/auth";

import { useForm } from "react-hook-form";
import { searchProduct } from "../../store/actions/products";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../tools";
import { getCartItems } from "../../store/actions/products";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Header = () => {
  const dispatch = useDispatch();
  const { user, isauthenticated } = useSelector((state) => state.auth);
  const { cartItems, isloading } = useSelector((state) => state.products);

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (isauthenticated) {
      const userId = user._id;
      dispatch(getCartItems(userId));
    }
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [opendrawer, setOpenDrawer] = useState(false);

  const navigate = useNavigate();

  const signOutUser = () => {
    dispatch(signOut());
  };

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

  const iconStyles = {
    color: "white",
    fontSize: {
      xs: "20px",
      sm: "24px",
      md: "28px",
      lg: "30px",
    },
  };

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
    display: "block",
  };

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // const { errors } = formState;

  const SearchForm = ({ isDialog = false }) => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      defaultValues: {
        searchQuery: "",
      },
    });

    const onSubmit = async (data) => {
      console.log("Search Query:", data.searchQuery);

      const query = data.searchQuery;

      if (!query.trim()) {
        return;
      }

      dispatch(searchProduct(query))
        .unwrap()
        .then(() => {
          navigate("searchedProduct");
        })
        .catch((error) => {
          console.log("Error:", error);
          showToast("ERROR", "No Related Products Found");
        })
        .finally(() => {
          if (isDialog) {
            handleClosed();
          }
        });
    };

    return (
      <form className="relative" onSubmit={handleSubmit(onSubmit)}>
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
            {...register("searchQuery")}
            // {
            //   required: "Please enter a search term",
            //   minLength: {
            //     value: 2,
            //     message: "Search term must be at least 2 characters"
            //   }
            // })}
            className={`block w-full pl-10 p-4 text-sm text-white border border-transparent 
            rounded-lg bg-[#8e6c4f] focus:outline-none focus:ring-2 focus:ring-white 
            focus:border-transparent ${
              errors.searchQuery ? "border-red-500" : ""
            }`}
            placeholder="Search Products"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className={`absolute ${
              isDialog ? "right-[52px]" : "right-2.5"
            } text-white bg-[#603F26] hover:bg-[#7a5633] 
            focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
            rounded-lg ${
              isDialog ? "text-[12px] px-3 py-2" : "text-sm px-4 py-2"
            } transition-colors duration-200 
            ${searchLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {searchLoading ? "Searching..." : "Search"}
          </button>
          {isDialog && (
            <button
              type="button"
              onClick={handleClosed}
              className="text-white bg-transparent hover:bg-red-500 rounded-full p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        {errors.searchQuery && (
          <div className="text-red-500 mt-2 text-sm">
            {errors.searchQuery.message}
          </div>
        )}
        {searchError && (
          <div className="text-red-500 mt-2 text-sm">{searchError}</div>
        )}
      </form>
    );
  };

  return (
    <div>
      <div className="w-full bg-[#603F26] py-4 px-6 md:px-8 flex justify-between items-center fixed top-0 z-40 text-white">
        <div className="md:hidden">
          <MenuIcon onClick={() => toggleDrawer()} sx={{ fontSize: 25 }} />
        </div>

        <Link to="/customer">
          <h2 className="text-xl md:text-3xl font-bold">Diverse Den</h2>
        </Link>

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
      width: "170px",
      backgroundColor: "#603F26",
      color: "white",
      padding: "5px",
    },
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  disableScrollLock={true}
>
  {!isauthenticated ? (
    <div>
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
    </div>
  ) : (
    <div>
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
          to="/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Profile
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
          to="loyalty"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Loyalty Dashboard
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
          onClick={signOutUser}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Logout
        </Link>
      </MenuItem>
    </div>
  )}
</Menu>
          </div>

          <div>
            <Link to="/customer/cart">
              <IconButton
                aria-label="cart"
                sx={{
                  ...buttonStyles,
                  "& .MuiSvgIcon-root": {
                    ...iconStyles,
                  },
                }}
              >
                <StyledBadge badgeContent={cartItems?.length} color="secondary">
                  <ShoppingCartIcon />
                </StyledBadge>
              </IconButton>
            </Link>
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
              paddingTop: "30px",
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
                  <TreeItem
                    itemId="clothing"
                    label="CLOTHING"
                    sx={{ marginBottom: "6px" }}
                  >
                    <TreeItem itemId="men-clothes" label="MEN">
                      <Link to="/customer/Clothing/Men/T-shirts">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="T-shirts" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Men/Shirts">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Shirts" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Men/Pants">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Pants" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Men/Jackets">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Jackets" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Men/Jeans">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Jeans" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Men/Sweaters">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Sweaters" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Men/Shorts">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Shorts" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Men/Underwear">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Underwear" />
                        </ListItemButton>
                      </Link>
                    </TreeItem>

                    {/* Women clothing */}
                    <TreeItem itemId="women-clothes" label="WOMEN">
                      <Link to="/customer/Clothing/Women/T-shirts">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="T-shirts" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Women/Shirts">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Shirts" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Women/Dresses">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Dresses" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Women/Jeans">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Jeans" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Women/Skirts">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Skirts" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Women/Pants">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Pants" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Women/Jackets">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Jackets" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Women/Sweaters">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Sweaters" />
                        </ListItemButton>
                      </Link>
                    </TreeItem>

                    {/* Kids clothing */}
                    <TreeItem itemId="kids-clothes" label="Kids">
                      <Link to="/customer/Clothing/Kids/T-shirts">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="T-shirts" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Kids/Shirts">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Shirts" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Kids/Pants">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Pants" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Kids/Jackets">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Jackets" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Kids/Jeans">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Jeans" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Kids/Sweaters">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Sweaters" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Clothing/Kids/Shorts">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Shorts" />
                        </ListItemButton>
                      </Link>
                    </TreeItem>
                  </TreeItem>

                  {/* SHOES */}
                  <TreeItem
                    itemId="shoes"
                    label="SHOES"
                    sx={{ marginBottom: "6px" }}
                  >
                    <TreeItem itemId="men-shoes" label="MEN">
                      <Link to="/customer/Shoes/Men/Sneakers">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Sneakers" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Men/Dress Shoes">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Dress Shoes" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Men/Loafers">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Loafers" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Men/Sandals">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Sandals" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Men/Athletic Shoes">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Athletic Shoes" />
                        </ListItemButton>
                      </Link>
                    </TreeItem>

                    {/* Women Shoes */}
                    <TreeItem itemId="women-shoes" label="WOMEN">
                      <Link to="/customer/Shoes/Women/Heels">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Heels" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Women/Casual Shoes">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Casual Shoes" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Women/Sneakers">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Sneakers" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Women/Athletic Shoes">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Athletic Shoes" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Women/Sandals">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Sandals" />
                        </ListItemButton>
                      </Link>
                    </TreeItem>

                    {/* Kids Shoes */}
                    <TreeItem itemId="kids-shoes" label="Kids">
                      <Link to="/customer/Shoes/Kids/School Shoes">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="School Shoes" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Kids/Athletic Shoes">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Athletic Shoes" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Kids/Sneakers">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Sneakers" />
                        </ListItemButton>
                      </Link>

                      <Link to="/customer/Shoes/Kids/Sandals">
                        <ListItemButton
                          onClick={toggleDrawer}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#4d332",
                              color: "#ffedcf",
                            },
                          }}
                        >
                          <ListItemText primary="Sandals" />
                        </ListItemButton>
                      </Link>
                    </TreeItem>
                  </TreeItem>

                  {/* FURNITURE */}
                  <TreeItem
                    itemId="furniture"
                    label="FURNITURE"
                    sx={{ marginBottom: "6px" }}
                  >
                    <Link to="/customer/Furniture/Sofas">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Sofas" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Furniture/Chairs">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Chairs" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Furniture/Tables">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Tables" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Furniture/Beds">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Beds" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Furniture/Cabinets">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Cabinets" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Furniture/Wardrobes">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Wardrobes" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Furniture/Shelving Units">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Shelving Units" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Furniture/Dinning Sets">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Dinning Sets" />
                      </ListItemButton>
                    </Link>
                  </TreeItem>

                  {/* Decoration */}
                  <TreeItem
                    itemId="decoration"
                    label="DECORATION"
                    sx={{ marginBottom: "6px" }}
                  >
                    <Link to="/customer/Decoration/Wall Art">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Wall Art" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Decoration/Sculptures">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Sculptures" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Decoration/Picture Frames">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Picture Frames" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Decoration/Mirrors">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Mirrors" />
                      </ListItemButton>
                    </Link>

                    <Link to="/customer/Decoration/Candle Holders">
                      <ListItemButton
                        onClick={toggleDrawer}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#4d332",
                            color: "#ffedcf",
                          },
                        }}
                      >
                        <ListItemText primary="Candle Holders" />
                      </ListItemButton>
                    </Link>
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
