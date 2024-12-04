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

const ListBranches = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { branches, meta } = useSelector((state) => state.branches);

  const totalBranches = meta?.totalItems || 0;

  console.log("id:", user.business);

  const handleNextPage = (page) => {
    const business = user?.business;
    if (business && page) {
      console.log("Next Page:", page);
      dispatch(getBranches({ business, pageNo: page }));
    }
  };

  const handlePrevPage = (page) => {
    const business = user?.business;
    if (business && page) {
      console.log("Previous Page:", page);
      dispatch(getBranches({ business, pageNo: page }));
    }
  };

  const [open, setOpen] = useState(false);
  const [toRemove, setToRemove] = useState(null);

  const handleClickOpen = (branchCode) => {
    console.log("Open:code:", branchCode);
    setToRemove(branchCode);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    const business = user?.business;
    console.log("dlete:code:", toRemove);
    dispatch(removeBranch({ toRemove, business }))
      .unwrap()
      .finally(() => {
        setOpen(false);
        setToRemove(null);
      });
  };

  useEffect(() => {
    console.log("getting.....");
    const business = user?.business;
    dispatch(getBranches({ business }));
  }, []);

  return (
    <div className="relative bg-gray-50 flex flex-col pt-5">
      <div className="mb-4 pl-4 md:pl-8 lg:pl-12">
        <h1 className="text-[#603F26] font-bold text-2xl">Branches</h1>
      </div>

      <div className="w-full flex justify-between items-center px-4 md:px-8 lg:px-12">
        <div className="border border-[#603F26] bg-[#603F26] p-2 w-32 rounded-lg text-white">
          <span className="font-semibold text-2xl">
            {totalBranches < 10 ? 0 : null}
            {totalBranches}
          </span>
          <h3 className="text-[14px] font-medium">Total Branches</h3>
        </div>
        <div className="">
          <Button
            variant="contained"
            color="primary"
            size="small"
            component={Link}
            to="../addBranch"
            sx={{
              textTransform: "none",
              width: "120px",
              fontSize: "16px",
              fontWeight: "semi-bold",
              backgroundColor: "#603F26",
            }}
          >
            Add Branch
          </Button>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 mt-10 flex-grow">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#603F26" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontSize: '16px', fontWeight: 'bold' }}>Code</TableCell>
                  <TableCell align="center" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
                    Name
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
                    City
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
                    Address
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
                    Contact
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
                    Email
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
                    Salesperson
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branches.map((branch, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {branch.branchCode}
                    </TableCell>
                    <TableCell align="right">{branch.name}</TableCell>
                    <TableCell align="right">{branch.city}</TableCell>
                    <TableCell align="right">{branch.address}</TableCell>
                    <TableCell align="right">{branch.contactNo}</TableCell>
                    <TableCell align="right">{branch.emailAddress}</TableCell>
                    <TableCell align="right">
                      {branch.salesperson || "Not Assigned"}
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-center gap-3">
                        <Link to={`../viewbranch`}>
                          <GrFormView
                            className="text-[18px]"
                            style={{ color: "green" }}
                          />
                        </Link>
                        <Link to={`../updatebranch`}>
                          <MdEdit
                            className="text-[16px]"
                            style={{ color: "blue" }}
                          />
                        </Link>
                        <Link
                          onClick={() => handleClickOpen(branch.branchCode)}
                        >
                          <FaTrash
                            className="text-[13px]"
                            style={{ color: "red" }}
                          />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Table for Medium and Larger Screens */}
        {/* <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
          <table className="w-full text-sm text-left rtl:text-right font-medium">
            <thead className="text-sm text-white uppercase font-bold bg-[#603F26]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                  City
                </th>
                <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                  Address
                </th>
                <th scope="col" className="px-6 py-3">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 hidden xl:table-cell">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                  Salesperson
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch, index) => (
                <tr
                  key={index}
                  className="bg-white border-b border-gray-700 text-black hover:bg-gray-300"
                >
                  <td className="px-6 py-3">{branch.branchCode}</td>
                  <td className="px-6 py-3">{branch.name}</td>
                  <td className="px-6 py-3 ">{branch.city}</td>
                  <td className="px-6 py-3 ">{branch.address}</td>
                  <td className="px-6 py-3">{branch.contactNo}</td>
                  <td className="px-6 py-3 ">{branch.emailAddress}</td>
                  <td className="px-6 py-3 ">
                    {branch.salesperson || "Not Assigned"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link>
                        <GrFormView className="text-[18px]" />
                      </Link>
                      <Link to='../updatebranch'>
                        <MdEdit className="text-[16px]" />
                      </Link>
                      <Link onClick={() => handleClickOpen(branch.branchCode)}>
                        <FaTrash className="text-[13px]" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* Card View for Small Screens */}
        <div className="block xl:hidden">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="mb-4 bg-white p-4 rounded-lg shadow-md border border-gray-300"
            >
              <p className="text-sm font-medium text-gray-900">
                <span className="font-bold">Code:</span> {branch.branchCode}
              </p>
              <p className="text-sm font-medium text-gray-900">
                <span className="font-bold">Name:</span> {branch.name}
              </p>
              <p className="text-sm font-medium text-gray-900">
                <span className="font-bold">City:</span> {branch.city}
              </p>
              <p className="text-sm font-medium text-gray-900">
                <span className="font-bold">Address:</span> {branch.address}
              </p>
              <p className="text-sm font-medium text-gray-900">
                <span className="font-bold">Contact:</span> {branch.contactNo}
              </p>
              <p className="text-sm font-medium text-gray-900">
                <span className="font-bold">Email:</span> {branch.emailAddress}
              </p>
              <p className="text-sm font-medium text-gray-900">
                <span className="font-bold">Salesperson:</span>{" "}
                {branch.salesperson || "Not Assigned"}
              </p>
              <div className="mt-3 flex items-center gap-5">
                <Link className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition duration-200">
                  View
                </Link>
                <Link to='../updatebranch'
                className="text-green-600 font-semibold hover:underline hover:text-green-800 transition duration-200">
                  Update
                </Link>
                <Link
                  onClick={() => handleClickOpen(branch.branchCode)}
                  className="text-red-600 font-semibold hover:underline hover:text-red-800 transition duration-200"
                >
                  Delete
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>

      {meta?.nextPage && (
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
      )}

      <div>
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
      </div>
    </div>
  );
};

export default ListBranches;
