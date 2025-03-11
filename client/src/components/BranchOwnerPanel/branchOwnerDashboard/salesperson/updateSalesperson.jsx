import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";  
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FaArrowLeft } from "react-icons/fa";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Loader } from "../../../../tools";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";

// import { getAllBranches } from "../../../../store/actions/branches";
// import { getSalesperson, updateSalesperson } from "../../../../store/actions/salespersons";

const UpdateSalesperson = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get salesperson ID from URL params
  const { allBranches } = useSelector((state) => state.branches);
  const { user } = useSelector((state) => state.auth);
  const { currentSalesperson, loading } = useSelector((state) => state.salespersons);
  const [isLoading, setIsLoading] = useState(true);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  const schema = yup.object({
    salesperson_name: yup.string().required("Salesperson name is required"),
    salesperson_email: yup
      .string()
      .required("Email is required")
      .email("Email format is not valid"),
    branch: yup.string().required("Branch assignment is required"),
  });

  const form = useForm({
    defaultValues: {
      salesperson_name: "",
      salesperson_email: "",
      branch: "",
    },
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, reset } = form;
  const { errors } = formState;

  useEffect(() => {
    const business = user?.business;
    dispatch(getAllBranches(business));
    
    // Fetch salesperson details
    if (id) {
      dispatch(getSalesperson(id));
    }
  }, [dispatch, user?.business, id]);

  // Update form when salesperson data is loaded
  useEffect(() => {
    if (currentSalesperson) {
      reset({
        salesperson_name: currentSalesperson.name,
        salesperson_email: currentSalesperson.email,
        branch: currentSalesperson.assignBranch,
      });
      setIsLoading(false);
    }
  }, [currentSalesperson, reset]);

  const onSubmit = (data) => {
    const body = {
      name: data.salesperson_name,
      email: data.salesperson_email,
      assignBranch: data.branch,
      business: user.business,
    };

    dispatch(updateSalesperson(id, body));
    navigate("../salespersonsList");
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col p-5">
      {/* <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
        <Link to="../salespersonsList">
          <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
        </Link>
        <h1 className="font-bold text-2xl text-[#603F26]">Update Salesperson</h1>
      </div>

      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg"
        >
          <ThemeProvider theme={theme}>
            <div className="mb-4">
              <Controller
                name="salesperson_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Salesperson Name"
                    error={!!errors.salesperson_name}
                    helperText={errors.salesperson_name?.message}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="salesperson_email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Salesperson Email"
                    error={!!errors.salesperson_email}
                    helperText={errors.salesperson_email?.message}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel>Branch</InputLabel>
                <Controller
                  name="branch"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Branch" error={!!errors.branch}>
                      {allBranches.map((branch, index) => (
                        <MenuItem key={index} value={branch.branchCode}>
                          {branch.branchCode}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.branch && (
                  <FormHelperText error={true}>
                    {errors.branch.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="contained"
                color="primary"
                size="small"
                type="submit"
                sx={{
                  textTransform: "none",
                  width: "120px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Update
              </Button>
            </div>
          </ThemeProvider>
        </form>
      </div> */}
    </div>
  );
};

export default UpdateSalesperson;