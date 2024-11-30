import React from "react";
import { useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
  } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";


const AddBranches = () => {

 const {user} = useSelector(state => state.auth)


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

  const { register, control, formState, handleSubmit } = form;

  const { errors } = formState;

  const onSubmit = async (data) => {

    console.log(data)
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
        business: user.business
      } 

      console.log(body)

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
      console.error("Error adding plan:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: "50%" }}
          className="border-[0.2px] border-black border-opacity-50 p-8 
               pt-3 rounded-lg my-8"
        >
          <h1 className="mb-4 font-medium text-2xl">
            Add Branches
          </h1>

          <ThemeProvider theme={theme}>
            <div className="mb-8">
              <TextField
                variant="outlined"
                id="branch_name"
                label="Branch name"
                error={errors.branch_name ? true : false}
                helperText={errors.branch_name?.message}
                {...register("branch_name")}
                sx={{
                  width: "100%",
                }}
              />
            </div>

            <div className="mb-8">
              <TextField
                variant="outlined"
                id="branch_code"
                label="Branch Code"
                error={errors.branch_code ? true : false}
                helperText={errors.branch_code?.message}
                {...register("branch_code")}
                sx={{
                  width: "100%",
                }}
              />
            </div>

            <div className="mb-8">
              <TextField
                variant="outlined"
                id="branch_email"
                label="Branch Email"
                error={errors.branch_email ? true : false}
                helperText={errors.branch_email?.message}
                {...register("branch_email")}
                sx={{
                  width: "100%",
                }}
              />
            </div>

            <div className="mb-8">
              <TextField
                variant="outlined"
                id="branch_city"
                label="Branch City"
                error={errors.branch_city ? true : false}
                helperText={errors.branch_city?.message}
                {...register("branch_city")}
                sx={{
                  width: "100%",
                }}
              />
            </div>

                        
            <div className="mb-8">
              <TextField
                variant="outlined"
                id="branch_address"
                label="Branch Address"
                error={errors.branch_address ? true : false}
                helperText={errors.branch_address?.message}
                {...register("branch_address")}
                sx={{
                  width: "100%",
                }}
              />
            </div>


            
            <div className="mb-8">
              <TextField
                variant="outlined"
                id="branch_contact"
                label="Branch Contact No."
                error={errors.branch_contact ? true : false}
                helperText={errors.branch_contact?.message}
                {...register("branch_contact")}
                sx={{
                  width: "100%",
                }}
              />
            </div>


            <div className="text-center mt-10">
              <Button
                variant="contained"
                color="primary"
                size="medium"
                type="submit"
                sx={{
                  textTransform: "none",
                  width: "150px",
                  fontSize:'18px',
                  fontWeight:'bold'
                  
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
