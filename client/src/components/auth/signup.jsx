import React, { useRef } from "react";
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearNotifications } from '../../store/reducers/notifications'
import { showToast } from '../../tools';
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

import { registerUser } from "../../store/actions/auth";

const Signup = () => {


  const notifications = useSelector(state => state.notifications);
  let navigate = useNavigate()



  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  const dispatch = useDispatch();

  const schema = yup.object({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Email format is not valid"),
    role: yup.string().required("Role is required"),
    phone: yup.string().required("Phone is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Atleast 8 characters is required!"),
    confirmpassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Password do not match"),
  });

  const form = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "",
      phone: "",
      password: "",
      confirmpassword: "",
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, formState} = form;

  const { errors } = formState;

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };


  useEffect(()=>{
    let { global } = notifications; 
    if(notifications && global.error){
        const msg = global.msg ? global.msg : 'Error';
        showToast('ERROR',msg)
        dispatch(clearNotifications())
    }
    if(notifications && global.success){
        const msg = global.msg ? global.msg : 'Good!!';
        showToast('SUCCESS',msg)
        dispatch(clearNotifications())
        navigate('/signin')

    }
},[notifications])




  return (
    <div className="flex flex-col justify-center items-center">


      <div className="w-[450px] flex justify-center items-center mt-8" >
        <img src="/images/DD.png" alt="DD" className="w-[50%]"></img>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "450px" }} 
      className="flex flex-col justify-center items-center bg-white border-[0.2px] 
      border-opacity-50 border-black p-8 pt-3 rounded-lg mt-10 mb-20 ">

        <h1 className="mb-6 font-bold text-2xl">Create Account</h1>

        <ThemeProvider theme={theme}>
          <div className="mb-8 w-[100%]">
            <TextField
              variant="outlined"
              id="firstname"
              label="Firstname"
              error={errors.firstname ? true : false}
              helperText={errors.firstname?.message}
              {...register("firstname")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="mb-8 w-[100%]">
            <TextField
              variant="outlined"
              id="lastname"
              label="Lastname"
              error={errors.lastname ? true : false}
              helperText={errors.lastname?.message}
              {...register("lastname")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="mb-8 w-[100%]">
            <TextField
              variant="outlined"
              id="email"
              label="Email"
              error={errors.email ? true : false}
              helperText={errors.email?.message}
              {...register("email")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="mb-8 w-[100%]">
            <FormControl  sx={{
                width: "100%",
              }}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                label="Role"
                defaultValue=""
                {...register("role")}
                error={errors.role ? true : false}
                MenuProps={{
                  disableScrollLock: true,
                }}
              >
                <MenuItem value="Branch Owner">Branch Owner</MenuItem>
                <MenuItem value="Rider">Rider</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </Select>
              {errors.role && (
                <FormHelperText error={true}>
                  {errors.role.message}
                </FormHelperText>
              )}
            </FormControl>
          </div>

          <div className="mb-8 w-[100%]">
            <TextField
              variant="outlined"
              id="phone"
              label="Phone"
              error={errors.phone ? true : false}
              helperText={errors.phone?.message}
              {...register("phone")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="mb-8 w-[100%]">
            <TextField
              variant="outlined"
              id="password"
              label="Password"
              error={errors.password ? true : false}
              helperText={errors.password?.message}
              {...register("password")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="mb-8 w-[100%]">
            <TextField
              variant="outlined"
              id="confirmpassword"
              label="Confirm Password"
              error={errors.confirmpassword ? true : false}
              helperText={errors.confirmpassword?.message}
              {...register("confirmpassword")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="text-center w-[100%]">
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
              Signup
            </Button>
          </div>
        </ThemeProvider>

        <div className="flex items-center w-full my-3">
          <div className="flex-grow bg-gray-300 h-px"></div>
          <h2 className="mx-4 text-xl font-medium">or</h2>
          <div className="flex-grow bg-gray-300 h-px"></div>
        </div>



        <div>
          <p>Already have an account?
            <span className="text-blue-700 font-medium"> 
              <Link to="/signin"> Sign in</Link>
            </span>
          </p>
        </div>

      </form>
    </div>
  );
};

export default Signup;
