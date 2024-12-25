import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getBranches, removeBranch } from "../../../../store/actions/branches";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { GrFormView } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Loader } from "../../../../tools";
import { listOrders } from "../../../../store/actions/orders";

const ListOrders = () => {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const {orders, isloading, meta} = useSelector(state => state.orders);

    console.log('ord:', orders);

    const totalOrders = meta?.totalOrders || 0;

   
    const handleNextPage = (page) => {
      const business = user?.business;
      if (business && page) {
        console.log("Next Page:", page);
        dispatch(listOrders({ business, pageNo: page }));
      }
    };

    const handlePrevPage = (page) => {
      const business = user?.business;
      if (business && page) {
        console.log("Previous Page:", page);
        dispatch(listOrders({ business, pageNo: page }));
      }
    };

    // const [open, setOpen] = useState(false);
    // const [toRemove, setToRemove] = useState(null);

    // const handleClickOpen = (productId) => {
    //   console.log("Open:code:", productId);
    //   setToRemove(productId);
    //   setOpen(true);
    // };

    // const handleClose = () => {
    //   setOpen(false);
    // };

    // const handleDelete = () => {
    //   const business = user?.business;
    // console.log("dlete:code:", toRemove);
    //  dispatch(removeProduct({toRemove, business}))
    //     .unwrap()
    //     .finally(() => {
    //       setOpen(false);
    //       setToRemove(null);
    //     }); 
    // };

    useEffect(() => {
      console.log("getting products.....");
      const business = user?.business;
      dispatch(listOrders({business}));

    }, []);

    if(isloading){
      return <Loader/>
    }



  return (
    <div className="relative bg-gray-50 flex flex-col pt-5">
      <div className="mb-4 pl-4 md:pl-8 lg:pl-12">
        <h1 className="text-[#603F26] font-bold text-2xl">Orders</h1>
      </div>

      <div className="w-full flex justify-between items-center px-4 md:px-8 lg:px-12">
        <div className="border border-[#603F26] bg-[#603F26] p-2 w-32 rounded-lg text-white">
          <span className="font-semibold text-2xl">
            {totalOrders < 10 ? 0 : null}
            {totalOrders}
            
          </span>
          <h3 className="text-[14px] font-medium">Total Orders</h3>
        </div>
        
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 mt-10 flex-grow">
        {!orders || orders.length === 0 ? (
          <div className="text-3xl font-bold flex justify-center">
            No Orders found
          </div>
        ) : (
          <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead sx={{ backgroundColor: "#603F26" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Customer
                      </TableCell>

                      <TableCell
                        align="left"
                        sx={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Items
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Total
                      </TableCell>

                      <TableCell
                        align="left"
                        sx={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Payment
                      </TableCell>

                      <TableCell
                        align="left"
                        sx={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Status
                      </TableCell>       
                    </TableRow>
                  </TableHead>
                  <TableBody>

                      {orders.map((order, index)=>(
                        <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {order?.userInfo?.firstname } {order?.userInfo?.lastname}
                        </TableCell>
                        
                        <TableCell align="left">{order?.createdAt}</TableCell>
                        <TableCell align="left">{order?.cartItemCount}</TableCell>
                        <TableCell align="left">{order?.totalAmount}</TableCell>
                        <TableCell align="left">{order?.userInfo?.paymentMethod}</TableCell>
                        <TableCell align="left">{order?.status}</TableCell>
                      
                      </TableRow>
                      ))


                      }
                    
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

          


            <div className="block xl:hidden">
              {orders?.map((order, index) => (
                <div
                  key={index}
                  className="mb-4 bg-white p-4 rounded-lg shadow-md border border-gray-300"
                >
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Customer:</span> {order?.userInfo?.firstname } {order?.userInfo?.lastname} 
                  </p>
                  
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Date:</span> {order?.createdAt}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Items:</span>{order?.cartItemCount}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Total:</span>{order?.totalAmount}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Payment:</span>{order?.userInfo?.paymentMethod}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Status:</span>{order?.status}
                  </p>

                 
                </div>
              ))}

            </div>


          </>
        )} 


      </div>

      {meta?.nextPage || meta?.previousPage ? 
        <nav
          aria-label="Page navigation example"
          className="w-full flex justify-center items-center my-16"
        >
          <ul className="inline-flex items-center -space-x-px text-sm">
            {meta?.previousPage && (
              <>
                <li
                  onClick={() => handlePrevPage(meta?.previousPage)}
                  className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-l-md shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                >
                  Previous
                </li>
                <li
                  onClick={() => handlePrevPage(meta?.previousPage)}
                  className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                >
                  {meta?.previousPage}
                </li>
              </>
            )}

            <li className="flex items-center justify-center px-4 py-2 text-white bg-[#603F26] border border-[#603F26] shadow-md font-bold cursor-default rounded-md">
              {meta?.currentPage}
            </li>

            {meta?.nextPage && (
              <>
                <li
                  onClick={() => handleNextPage(meta?.nextPage)}
                  className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                >
                  {meta?.nextPage}
                </li>
                <li
                  onClick={() => handleNextPage(meta?.nextPage)}
                  className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-r-md shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                >
                  Next
                </li>
              </>
            )}
          </ul>
        </nav>
        : null
      } 

      {/* <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {" Are you really sure ?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              There is no going back.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Oops, close this.</Button>
            <Button onClick={handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div> */}

    </div>
  );
};

export default ListOrders;
