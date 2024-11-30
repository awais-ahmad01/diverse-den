import React from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa";

import { TextField, Button, ThemeProvider, createTheme } from "@mui/material";
import { Link } from "react-router-dom";

const AddBranches = () => {
  const { user } = useSelector((state) => state.auth);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  const schema = yup.object({
    branch_name: yup.string().required("Branch name is required"),
    branch_code: yup.string().required("Branch code is required"),
    branch_email: yup
      .string()
      .required("Email is required")
      .email("Email format is not valid"),
    branch_city: yup.string().required("Branch city is required"),
    branch_address: yup.string().required("Branch address is required"),
    branch_contact: yup.string().required("Branch contact is required"),
  });

  const form = useForm({
    defaultValues: {
      branch_name: "",
      branch_code: "",
      branch_email: "",
      branch_address: "",
      branch_city: "",
      branch_contact: "",
    },
    resolver: yupResolver(schema),
  });

  const { register, formState, handleSubmit } = form;

  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const token = localStorage.getItem("token");

      console.log("Retrieved Token:", token);
      if (!token) {
        console.error("No token found!");
        return;
      }

      const body = {
        branchCode: data.branch_code,
        name: data.branch_name,
        city: data.branch_city,
        address: data.branch_address,
        contactNo: data.branch_contact,
        emailAddress: data.branch_email,
        business: user.business,
      };

      console.log(body);

      const response = await axios.post(
        "http://localhost:3000/createBranch",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Branch added successfully:", response.data);
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col p-5">
      <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
        <Link to="../branchesList">
          <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
        </Link>
        <h1 className="font-bold text-2xl text-[#603F26]">Add Branch</h1>
      </div>

      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg"
        >
          <ThemeProvider theme={theme}>
            <div className="mb-4">
              <TextField
                variant="outlined"
                id="branch_name"
                label="Branch name"
                error={!!errors.branch_name}
                helperText={errors.branch_name?.message}
                {...register("branch_name")}
                sx={{ width: "100%" }}
              />
            </div>

            <div className="mb-4">
              <TextField
                variant="outlined"
                id="branch_code"
                label="Branch Code"
                error={!!errors.branch_code}
                helperText={errors.branch_code?.message}
                {...register("branch_code")}
                sx={{ width: "100%" }}
              />
            </div>

            <div className="mb-4">
              <TextField
                variant="outlined"
                id="branch_email"
                label="Branch Email"
                error={!!errors.branch_email}
                helperText={errors.branch_email?.message}
                {...register("branch_email")}
                sx={{ width: "100%" }}
              />
            </div>

            <div className="mb-4">
              <TextField
                variant="outlined"
                id="branch_city"
                label="Branch City"
                error={!!errors.branch_city}
                helperText={errors.branch_city?.message}
                {...register("branch_city")}
                sx={{ width: "100%" }}
              />
            </div>

            <div className="mb-4">
              <TextField
                variant="outlined"
                id="branch_address"
                label="Branch Address"
                error={!!errors.branch_address}
                helperText={errors.branch_address?.message}
                {...register("branch_address")}
                sx={{ width: "100%" }}
              />
            </div>

            <div className="mb-4">
              <TextField
                variant="outlined"
                id="branch_contact"
                label="Branch Contact No."
                error={!!errors.branch_contact}
                helperText={errors.branch_contact?.message}
                {...register("branch_contact")}
                sx={{ width: "100%" }}
              />
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="contained"
                color="primary"
                size="medium"
                type="submit"
                sx={{
                  textTransform: "none",
                  width: "150px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Add
              </Button>
            </div>
          </ThemeProvider>
        </form>
      </div>
    </div>
  );
};

export default AddBranches;
