import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from "@mui/icons-material/Info";
import { Loader } from "../../../../tools";
import PaymentDetailsDialog from "./paymentDetailsDialog";

const OrderPaymentHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [meta, setMeta] = useState({ totalPayments: 0, currentPage: 1 });

  // Custom theme to match the brown color scheme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API load
    setTimeout(() => {
      const mockPayments = [
        {

          id: 1,
          orderNumber: "ORD-2025-001",
          customerName: "John Smith",
          paymentDate: "2025-02-15",
          amount: 129.99,
          paymentMethod: "Credit Card",
        },
        {
          id: 2,
          orderNumber: "ORD-2025-002",
          customerName: "Sarah Johnson",
          paymentDate: "2025-02-16",
          amount: 89.5,
          paymentMethod: "PayPal",
        },
        {
          id: 3,
          orderNumber: "ORD-2025-003",
          customerName: "Michael Brown",
          paymentDate: "2025-02-17",
          amount: 212.75,
          paymentMethod: "Bank Transfer",
        },
        {
          id: 4,
          orderNumber: "ORD-2025-004",
          customerName: "Emily Davis",
          paymentDate: "2025-02-18",
          amount: 45.25,
          paymentMethod: "Credit Card",
        },
        {
          id: 5,
          orderNumber: "ORD-2025-005",
          customerName: "Robert Wilson",
          paymentDate: "2025-02-19",
          amount: 178.0,
          paymentMethod: "Debit Card",
        },
      ];

      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setMeta({ totalPayments: mockPayments.length, currentPage: 1 });
      setIsLoading(false);
    }, 800);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter payments by date range
  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter((payment) => {
      const paymentDate = payment.paymentDate;

      if (startDate && !endDate) {
        return paymentDate >= startDate;
      }

      if (!startDate && endDate) {
        return paymentDate <= endDate;
      }

      return paymentDate >= startDate && paymentDate <= endDate;
    });

    setFilteredPayments(filtered);
  };

  // Apply filters when date range changes
  useEffect(() => {
    applyDateFilter();
  }, [startDate, endDate, payments]);

  const handleOpenDetails = (payment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
  };

  // Add this function to handle closing the dialog
  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        <div className="mb-4 pl-4 md:pl-8 lg:pl-12">
          <h1 className="text-[#603F26] font-bold text-2xl">
            Order Payment History
          </h1>
        </div>

        <div className="w-full flex justify-between items-center px-4 md:px-8 lg:px-12">
          <div className="border border-[#603F26] bg-[#603F26] p-2 w-48 rounded-lg text-white">
            <span className="font-semibold text-2xl">
              {meta.totalPayments < 10
                ? `0${meta.totalPayments}`
                : meta.totalPayments}
            </span>
            <h3 className="text-[14px] font-medium">Total Payment Records</h3>
          </div>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            className="h-10"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {showFilters && (
          <div className="w-full px-4 md:px-8 lg:px-12 mt-4">
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-wrap gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="start-date"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <TextField
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  variant="outlined"
                  size="small"
                  className="min-w-64"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="end-date"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <TextField
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  variant="outlined"
                  size="small"
                  className="min-w-64"
                />
              </div>

              <Button
                variant="contained"
                color="primary"
                onClick={applyDateFilter}
                className="h-10 self-end"
              >
                Apply Filter
              </Button>
            </div>
          </div>
        )}

        <div className="w-full px-4 md:px-8 lg:px-12 mt-6 flex-grow">
          {!filteredPayments || filteredPayments.length === 0 ? (
            <div className="text-3xl font-bold flex justify-center my-12">
              No payment records found
            </div>
          ) : (
            <>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="payment history table"
                  >
                    <TableHead sx={{ backgroundColor: "#603F26" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Order Number
                        </TableCell>
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
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Payment Date
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Payment Method
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Details
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow
                          key={payment.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {payment.orderNumber}
                          </TableCell>
                          <TableCell>{payment.customerName}</TableCell>
                          <TableCell>
                            {formatDate(payment.paymentDate)}
                          </TableCell>
                          <TableCell align="right">
                            ${payment.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDetails(payment)}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className="block xl:hidden">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="mb-4 bg-white p-4 rounded-lg shadow-md border border-gray-300"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-bold">Order Number:</span>{" "}
                      {payment.orderNumber}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-bold">Customer:</span>{" "}
                      {payment.customerName}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-bold">Payment Date:</span>{" "}
                      {formatDate(payment.paymentDate)}
                    </p>
                    
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-bold">Amount:</span> $
                      {payment.amount.toFixed(2)}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-bold">Payment Method:</span>{" "}
                      {payment.paymentMethod}
                    </p>
                    <div className="mt-3">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<InfoIcon />}
                        size="small"
                        onClick={() => handleOpenDetails(payment)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination (mock) */}
        <nav
          aria-label="Page navigation example"
          className="w-full flex justify-center items-center my-16"
        >
          <ul className="inline-flex items-center -space-x-px text-sm">
            <li className="flex items-center justify-center px-4 py-2 text-white bg-[#603F26] border border-[#603F26] shadow-md font-bold cursor-default rounded-md">
              1
            </li>
          </ul>
        </nav>
      </div>

      <PaymentDetailsDialog
        open={detailsDialogOpen}
        handleClose={handleCloseDetails}
        payment={selectedPayment}
      />
    </ThemeProvider>
  );
};

export default OrderPaymentHistory;



