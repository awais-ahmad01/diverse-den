import React from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import { FaArrowLeft } from "react-icons/fa";
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
import { Link } from "react-router-dom";

const AddSalesperson = () => {


  const branches = [
    'branch1',
    'branch2',
    'branch3',
    'branch4'
  ]





  const { user } = useSelector((state) => state.auth);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  const schema = yup.object({
    salesperson_name: yup.string().required("Saleperson name is required"),
    salesperson_email: yup
      .string()
      .required("Email is required")
      .email("Email format is not valid"),
    branch: yup.string().required("Branch assign is required"),
    
  });

  const form = useForm({
    defaultValues: {
      salesperson_name: "",
      salesperson_email: "",
      branch: "",
      
    },
    resolver: yupResolver(schema),
  });

  const { register, formState, handleSubmit } = form;

  const { errors } = formState;

  const onSubmit = (data) => {
    

      const body = {
        name: data.salesperson_name,
        email: data.salesperson_email,
        assignBranch: data.assigned_branch,
        business: user.business,
      };

      console.log(body);

    //   dispatch......


  };

  return (
    <div className="bg-gray-50 flex flex-col p-5">
      <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
        <Link to="../branchesList">
          <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
        </Link>
        <h1 className="font-bold text-2xl text-[#603F26]">Add Salesperson</h1>
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
                id="salesperson_name"
                label="salesperson name"
                error={!!errors.salesperson_name}
                helperText={errors.salesperson_name?.message}
                {...register("salesperson_name")}
                sx={{ width: "100%" }}
              />
            </div>

            <div className="mb-4">
              <TextField
                variant="outlined"
                id="salesperson_email"
                label="salesperson email"
                error={!!errors.salesperson_email}
                helperText={errors.salesperson_email?.message}
                {...register("salesperson_email")}
                sx={{ width: "100%" }}
              />
            </div>




            <div className="mb-4">
              <FormControl
                sx={{
                  width: "100%",
                }}
              >
                <InputLabel>Branch</InputLabel>
                <Select
                  name="branch"
                  label="Branch"
                  defaultValue=""
                  {...register("branch")}
                  error={errors.branch ? true : false}
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                >
                  {branches.map((branch, index) => (
                    <MenuItem key={index} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
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

export default AddSalesperson;
