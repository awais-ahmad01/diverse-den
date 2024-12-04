import React from "react";
import { useForm} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateBranch } from "../../../../store/actions/branches";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import {
    TextField,
    Button,
    
  } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";


const UpdateBranch = () => {

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch;


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


      const { register, setValue, handleSubmit, formState } = form;
      const { errors } = formState;



      // useEffect(() => {
      //   const fetchBranchDetails = async () => {
      //     try {
      //       const token = localStorage.getItem("token");
      //       const response = await axios.get(`http://localhost:3000/branch/${branchId}`, {
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //         },
      //       });
    
      //       const branchData = response.data;
            
      //       setValue("branch_name", branchData.name);
      //       setValue("branch_code", branchData.branchCode);
      //       setValue("branch_email", branchData.emailAddress);
      //       setValue("branch_city", branchData.city);
      //       setValue("branch_address", branchData.address);
      //       setValue("branch_contact", branchData.contactNo);
      //     } catch (error) {
      //       console.error("Error fetching branch details:", error);
      //     }
      //   };
    
      //   fetchBranchDetails();
      // }, [branchId, setValue]);
    
      const onSubmit = async (data) => {
        const business = user?.business;
        dispatch(updateBranch({business, data}))
      };
    



  return (
    <div className="bg-gray-50 flex flex-col p-5">
      <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
        <Link to="../branchesList">
          <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
        </Link>
        <h1 className="font-bold text-2xl text-[#603F26]">Update Branch</h1>
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
                Update
              </Button>
            </div>
          </ThemeProvider>
        </form>
      </div>
    </div>
  )
}

export default UpdateBranch
