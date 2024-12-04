import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {useState } from "react";
import { useDispatch } from "react-redux";


import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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

import { signInUser } from "../../store/actions/auth";


import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';



const Signin = () => {


  const [showPassword, setShowPassword] = useState(false);

  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  const dispatch = useDispatch();

  const schema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Email format is not valid"),
    password: yup.string().required("Password is required"),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, formState } = form;

  const { errors } = formState;

  const onSubmit = (data) => {
    dispatch(signInUser(data));
  };

  
  return (
    
      <div className="flex flex-col justify-center items-center mt-8">
        <div className="w-[450px] flex justify-center items-center mt-4">
          <img src="/images/DD.png" alt="DD" className="w-[50%]"></img>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          style={{ width: "450px" }}
          className="border-[0.2px] border-black border-opacity-50 p-8 
  pt-3 rounded-lg my-8"
        >
          <h1 className="mb-4 font-medium text-2xl">Sign in</h1>

          <ThemeProvider theme={theme}>
            <div className="mb-8">
              <TextField
                variant="outlined"
                id="email"
                label="Email"
                error={errors.email ? true : false}
                helperText={errors.email?.message}
                autoComplete="new-email"
                {...register("email")}
                sx={{
                  width: "100%",
                }}
              />
            </div>

            <div className="mb-8">
      <TextField
        variant="outlined"
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}  // Toggle input type based on state
        error={!!errors.password} // Show error if there's a password validation error
        helperText={errors.password?.message} // Show error message from validation
        autoComplete="new-password" // Disable autocomplete
        {...register("password")} // Register the input field with react-hook-form
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          width: "100%",
        }}
      />
    </div>



            



            <div className="text-center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                sx={{
                  textTransform: "none",
                  width: "150px",
                }}
              >
                Login
              </Button>
            </div>
          </ThemeProvider>
        </form>

        <div className="flex items-center w-[450px] my-3">
          <div className="flex-grow bg-gray-300 h-px"></div>
          <h2 className="mx-4 text-[15px]">New to Diverse Den?</h2>
          <div className="flex-grow bg-gray-300 h-px"></div>
        </div>

        <div className="text-center mt-4">
          <Button
            variant="contained"
            size="medium"
            component={Link} // Makes the button behave as a Link
            to="/signup"
            sx={{
              textTransform: "none",
              width: "300px",
              backgroundColor: "#FFFFFF",
              color: "#603F26",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#603F26",
                color: "#FFFFFF",
              },
              border: "1px solid #603F26",
            }}
          >
            Create Your Account
          </Button>
        </div>
      </div>
    
  );
};

export default Signin;
