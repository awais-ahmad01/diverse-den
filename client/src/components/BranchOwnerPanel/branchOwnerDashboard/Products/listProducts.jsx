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
import CircularProgress from "@mui/material/CircularProgress";

import { getAllBranches } from "../../../../store/actions/branches";
import { Loader } from "../../../../tools";




const ListProducts = () => {
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);

//   const { branches, meta, isloading } = useSelector((state) => state.branches);

//   const totalBranches = meta?.totalItems || 0;

//   console.log("id:", user.business);

//   const handleNextPage = (page) => {
//     const business = user?.business;
//     if (business && page) {
//       console.log("Next Page:", page);
//       dispatch(getBranches({ business, pageNo: page }));
//     }
//   };

//   const handlePrevPage = (page) => {
//     const business = user?.business;
//     if (business && page) {
//       console.log("Previous Page:", page);
//       dispatch(getBranches({ business, pageNo: page }));
//     }
//   };

//   const [open, setOpen] = useState(false);
//   const [toRemove, setToRemove] = useState(null);

//   const handleClickOpen = (branchCode) => {
//     console.log("Open:code:", branchCode);
//     setToRemove(branchCode);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleDelete = () => {
//     const business = user?.business;
//     console.log("dlete:code:", toRemove);
//     dispatch(removeBranch({ toRemove, business }))
//       .unwrap()
//       .finally(() => {
//         setOpen(false);
//         setToRemove(null);
//       });
//   };

//   useEffect(() => {
//     console.log("getting.....");
//     const business = user?.business;
//     dispatch(getBranches({ business }));

//   }, []);



//   if(isloading){

//     return <Loader/>

//     // return (
//     //   <div className="text-center mt-28">
//     //     <CircularProgress />
//     //   </div>
//     // );
//   }


  return (
    <div className="relative bg-gray-50 flex flex-col pt-5">
      <div className="mb-4 pl-4 md:pl-8 lg:pl-12">
        <h1 className="text-[#603F26] font-bold text-2xl">Products</h1>
      </div>

      <div className="w-full flex justify-between items-center px-4 md:px-8 lg:px-12">
        <div className="border border-[#603F26] bg-[#603F26] p-2 w-32 rounded-lg text-white">
          <span className="font-semibold text-2xl">
            {/* {totalBranches < 10 ? 0 : null}
            {totalBranches} */}
            10
          </span>
          <h3 className="text-[14px] font-medium">Total Products</h3>
        </div>
        <div className="">
          <Button
            variant="contained"
            color="primary"
            size="small"
            component={Link}
            to="../addProduct"
            sx={{
              textTransform: "none",
              width: "120px",
              fontSize: "16px",
              fontWeight: "semi-bold",
              backgroundColor: "#603F26",
            }}
          >
            Add Product
          </Button>
        </div>
      </div>


   

      

   
    </div>
  );
};

export default ListProducts;
