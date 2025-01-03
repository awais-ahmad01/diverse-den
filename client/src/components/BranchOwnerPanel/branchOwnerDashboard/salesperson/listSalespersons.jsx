import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import {
  getSalespersons,
  removeSalesperson,
} from "../../../../store/actions/salespersons";

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
import { CircularProgress } from "@mui/material";

import { Loader } from "../../../../tools";

const ListSalespersons = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { salespersons, meta, isloading } = useSelector(
    (state) => state.salespersons
  );

  const totalSalespersons = meta?.totalItems || 0;

  const handleNextPage = (page) => {
    const business = user?.business;
    if (business && page) {
      console.log("Next Page:", page);
      dispatch(getSalespersons({ business, pageNo: page }));
    }
  };

  const handlePrevPage = (page) => {
    const business = user?.business;
    if (business && page) {
      console.log("Previous Page:", page);
      dispatch(getSalespersons({ business, pageNo: page }));
    }
  };

  const [open, setOpen] = useState(false);
  const [toRemove, setToRemove] = useState(null);

  const handleClickOpen = (id) => {
    console.log("Open:code:", id);
    setToRemove(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    const business = user?.business;
    console.log("dlete:code:", toRemove);
    dispatch(removeSalesperson({ toRemove, business }))
      .unwrap()
      .finally(() => {
        setOpen(false);

        setToRemove(null);
      });
  };

  useEffect(() => {
    console.log("getting.....");
    const business = user?.business;
    dispatch(getSalespersons({ business }));
  }, []);

  if (isloading) {
    return <Loader />;
  }

  return (
    <div className="relative bg-gray-50 flex flex-col pt-5">
      <div className="mb-4 pl-4 md:pl-8 lg:pl-12">
        <h1 className="text-[#603F26] font-bold text-2xl">Salespersons</h1>
      </div>

      <div className="w-full flex justify-between items-center px-4 md:px-8 lg:px-12">
        <div className="border border-[#603F26] bg-[#603F26] p-2 w-36 rounded-lg text-white">
          <span className="font-semibold text-2xl">
            {totalSalespersons < 10 ? 0 : null}
            {totalSalespersons}
          </span>
          <h3 className="text-[14px] font-medium">Total Salespersons</h3>
        </div>
        <div className="">
          <Button
            variant="contained"
            color="primary"
            size="medium"
            component={Link}
            to="../addSalesperson"
            sx={{
              textTransform: "none",
              width: "165px",
              fontSize: "16px",
              fontWeight: "semi-bold",
              backgroundColor: "#603F26",
            }}
          >
            Add Salesperson
          </Button>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 mt-10 flex-grow">
        {!salespersons || salespersons.length === 0 ? (
          <div className="text-3xl font-bold flex justify-center">No Salesperson found</div>
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
                        Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Email ID
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Branch
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salespersons.map((salesperson, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {salesperson.name}
                        </TableCell>
                        <TableCell align="center">
                          {salesperson.email}
                        </TableCell>
                        <TableCell align="center">
                          {salesperson.assignBranch}
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex items-center justify-center gap-6">
                            <Link to={``}>
                              <GrFormView
                                className="text-[20px]"
                                style={{ color: "green" }}
                              />
                            </Link>
                            <Link
                              onClick={() => handleClickOpen(salesperson._id)}
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


            {/* Mobile view */}

            <div className="block xl:hidden">
              {salespersons.map((salesperson, index) => (
                <div
                  key={index}
                  className="mb-4 bg-white p-4 rounded-lg shadow-md border border-gray-300"
                >
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Name:</span> {salesperson.name}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Email:</span>{" "}
                    {salesperson.email}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Branch:</span>{" "}
                    {salesperson.assignBranch}
                  </p>
                  <div className="mt-3 flex items-center gap-5">
                    <Link className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition duration-200">
                      View
                    </Link>
                    <Link
                      onClick={() => handleClickOpen(salesperson._id)}
                      className="text-red-600 font-semibold hover:underline hover:text-red-800 transition duration-200"
                    >
                      Delete
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {meta?.nextPage || meta?.previousPage ? (
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
      ) : null}

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

export default ListSalespersons;
