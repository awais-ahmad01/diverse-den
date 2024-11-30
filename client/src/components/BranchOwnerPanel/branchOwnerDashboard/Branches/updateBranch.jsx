

import React from "react";
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


const UpdateBranch = () => {


    const { register, setValue, handleSubmit, formState } = useForm();
    const { errors } = formState;


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



      useEffect(() => {
        const fetchBranchDetails = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:3000/branch/${branchId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            const branchData = response.data;
            // Populate form fields with branch data
            setValue("branch_name", branchData.name);
            setValue("branch_code", branchData.branchCode);
            setValue("branch_email", branchData.emailAddress);
            setValue("branch_city", branchData.city);
            setValue("branch_address", branchData.address);
            setValue("branch_contact", branchData.contactNo);
          } catch (error) {
            console.error("Error fetching branch details:", error);
          }
        };
    
        fetchBranchDetails();
      }, [branchId, setValue]);
    
      const onSubmit = async (data) => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.put(`http://localhost:3000/branch/${branchId}`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          console.log("Branch updated successfully:", response.data);
        } catch (error) {
          console.error("Error updating branch:", error);
        }
      };
    



  return (
    <div>
      <div>
      <div className="flex flex-col justify-center items-center mt-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: "50%" }}
          className="border-[0.2px] border-black border-opacity-50 p-8 
               pt-3 rounded-lg my-8"
        >
          <h1 className="mb-4 font-medium text-2xl">
            Update Branch
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
                Update
              </Button>
            </div>
          </ThemeProvider>
        </form>
      </div>
    </div>
    </div>
  )
}

export default UpdateBranch
