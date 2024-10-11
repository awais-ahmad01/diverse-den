import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
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

import { signInUser } from "../../store/actions/auth";


const Signin = () => {

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
    dispatch(signInUser(data))
  };

  return (
    <div className="flex justify-center items-center mt-32">
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "450px" }}>
        <div className="mb-8">
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

        <div className="mb-8">
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

        <div className="text-center">
          <Button
            variant="contained"
            color="success"
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
      </form>
    </div>
  );
};

export default Signin;
