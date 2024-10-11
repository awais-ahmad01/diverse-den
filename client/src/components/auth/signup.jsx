import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, FormHelperText} from "@mui/material";

import { registerUser } from "../../store/actions/auth";


const Signup = () => {

  const dispatch = useDispatch();

  const schema = yup.object({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Email format is not valid"),
    role: yup
      .string()
      .required("Role is required"),
    phone: yup
      .string()
      .required("Phone is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, 'Atleast 8 characters is required!'),
    confirmpassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref('password')], 'Password do not match')
  });

  const form = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role:"",
      phone:"",
      password:"",
      confirmpassword:""
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, formState, watch } = form;

  const { errors } = formState;


  const onSubmit = (data) => {
    dispatch(registerUser(data))
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '400px' }}>
        <div className="mb-8">
          <TextField
            variant="outlined"
            id="firstname"
            label="Firstname"
            error={errors.firstname? true:false}
            helperText={errors.firstname?.message}
            {...register("firstname")}
            sx={{
                width:'400px'
            }}
          />
        </div>

        <div className="mb-8">
          <TextField
            variant="outlined"
            id="lastname"
            label="Lastname"
            error={errors.lastname? true:false}
            helperText={errors.lastname?.message}
            {...register("lastname")}
            sx={{
                width:'100%'
            }}
          />
        </div>

        <div className="mb-8">
          <TextField
            variant="outlined"
            id="email"
            label="Email"
            error={errors.email? true:false}
            helperText={errors.email?.message}
            {...register("email")}
            sx={{
              width:'100%'
          }}
          />
        </div>

        <div className="mb-8">
          <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            label="Role"
            defaultValue=''
            {...register("role")}
            error={errors.role?true:false}
            MenuProps={{
              disableScrollLock: true 
            }}
          >
        
            <MenuItem value='Branch Owner'
            >Branch Owner</MenuItem>
            <MenuItem value='Rider'
            >Rider</MenuItem>
            <MenuItem value='Customer'
            >Customer</MenuItem>
          </Select>
          {errors.role&&(
            <FormHelperText error={true}>{errors.role.message}</FormHelperText>
          )}
          </FormControl>
        </div>

        <div className="mb-8">
          <TextField
            variant="outlined"
            id="phone"
            label="Phone"
            error={errors.phone? true:false}
            helperText={errors.phone?.message}
            {...register("phone")}
            sx={{
              width:'100%'
          }}
          />
        </div>

        <div className="mb-8">
          <TextField
            variant="outlined"
            id="password"
            label="Password"
            error={errors.password? true:false}
            helperText={errors.password?.message}
            {...register('password')}
            sx={{
              width:'100%'
          }}
          />
        </div>

        <div className="mb-8">
          <TextField
            variant="outlined"
            id="confirmpassword"
            label="Confirm Password"
            error={errors.confirmpassword? true:false}
            helperText={errors.confirmpassword?.message}
            {...register('confirmpassword')}
            sx={{
              width:'100%'
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
                    textTransform:'none',
                    width:'150px'
                }}
                
            >
                Signup
            </Button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
