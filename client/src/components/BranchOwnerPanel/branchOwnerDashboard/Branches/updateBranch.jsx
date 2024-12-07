import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";  // Import Controller here
import { useParams, Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { updateBranch } from "../../../../store/actions/branches";
import { FaArrowLeft } from "react-icons/fa";
import { TextField, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";


const UpdateBranch = () => {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      branch_name: "",  // Initialize as empty string
      branch_code: "",  // Initialize as empty string
      branch_email: "", // Initialize as empty string
      branch_address: "", // Initialize as empty string
      branch_city: "", // Initialize as empty string
      branch_contact: "", // Initialize as empty string
    },
    resolver: yupResolver(schema),
  });

  const { register, setValue, handleSubmit, formState, reset, control } = form;
  const { errors } = formState;

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        console.log("Fetching branch...");
  
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
  
        const response = await axios.get('http://localhost:3000/getBranchById', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            branchId: id,
          },
        });
  
        const branchData = response.data.branches[0];
  
        console.log("Branch Data: ", branchData);
  
        // Ensure the fields are reset with values from the fetched data
        reset({
          branch_name: branchData.name || "",
          branch_code: branchData.branchCode || "",
          branch_email: branchData.emailAddress || "",
          branch_city: branchData.city || "",
          branch_address: branchData.address || "",
          branch_contact: branchData.contactNo || "",
        });
  
      } catch (error) {
        console.error("Error fetching branch:", error);
      }
    };
  
    fetchBranch();
  }, [id, reset]);

  const onSubmit = async (data) => {
    const business = user?.business;
    dispatch(updateBranch({ business, data }));

    navigate('../branchesList')
    
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
              <Controller
                name="branch_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="branch_name"
                    label="Branch name"
                    error={!!errors.branch_name}
                    helperText={errors.branch_name?.message}
                    {...field}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="branch_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="branch_code"
                    label="Branch Code"
                    error={!!errors.branch_code}
                    helperText={errors.branch_code?.message}
                    {...field}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="branch_email"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="branch_email"
                    label="Branch Email"
                    error={!!errors.branch_email}
                    helperText={errors.branch_email?.message}
                    {...field}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="branch_city"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="branch_city"
                    label="Branch City"
                    error={!!errors.branch_city}
                    helperText={errors.branch_city?.message}
                    {...field}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="branch_address"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="branch_address"
                    label="Branch Address"
                    error={!!errors.branch_address}
                    helperText={errors.branch_address?.message}
                    {...field}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="branch_contact"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="branch_contact"
                    label="Branch Contact No."
                    error={!!errors.branch_contact}
                    helperText={errors.branch_contact?.message}
                    {...field}
                    sx={{ width: "100%" }}
                  />
                )}
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
  );
};

export default UpdateBranch;
