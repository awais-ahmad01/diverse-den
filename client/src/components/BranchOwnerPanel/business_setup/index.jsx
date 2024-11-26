import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import axios from 'axios'

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

const BusinessSetup = () => {

  const [bankNames, setBankNames] = useState([])

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });



  const schema = yup.object({
    business_name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    account_holder: yup.string().required("Account holder name is required"),
    bank: yup.string().required("Bank selection is required"),
    account_number: yup
      .string()
      .required("Bank account is required")
      .matches(/^\d+$/, "Account number must contain only numbers")
      .test(
        "len",
        "Account number must be between 10 and 16 digits",
        (val) => val && val.length >= 10 && val.length <= 16
      ),
  });
    

  const form = useForm({
  defaultValues: {
    business_name: '',
    description: '',
    account_number: '',
    account_holder: '',
    bank: ''
  },

  resolver: yupResolver(schema),
  });

  const { register, control, formState, handleSubmit } = form;

  const { errors } = formState;



  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token"); 
  
      console.log("Retrieved Token:", token);
      if (!token) {
        console.error("No token found!");
        return; 
      }
  
      const response = await axios.post(
        "http://localhost:3000/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Plan added successfully:", response.data);
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };
  

  // console.log(bankNames)


  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('/pakistani_banks.json'); 
        const data = await response.json();
        console.log(data)
        setBankNames(data);
      } catch (error) {
        console.error('Error fetching bank data:', error);
      }
    };

    fetchBanks();
  }, []);





  return (
    <div>

<div className="flex flex-col justify-center items-center mt-8">


      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "70%" }}
        className="border-[0.2px] border-black border-opacity-50 p-8 
                     pt-3 rounded-lg my-8"
      >
        <h1 className="mb-4 font-medium text-2xl">Add Business Information</h1>

        <ThemeProvider theme={theme}>
          <div className="mb-8">
            <TextField
              variant="outlined"
              id="name"
              label="Business name"
              error={errors.business_name ? true : false}
              helperText={errors.business_name?.message}
              {...register("business_name")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="mb-8">
            <TextField
              variant="outlined"
              id="description"
              label="Business Description"
              error={errors.description ? true : false}
              helperText={errors.description?.message}
              {...register("description")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="mb-8">
            <TextField
              variant="outlined"
              id="account_holder"
              label="Account Holder"
              error={errors.account_holder ? true : false}
              helperText={errors.account_holder?.message}
              {...register("account_holder")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="mb-8">
            <TextField
              variant="outlined"
              id="account_number"
              label="Account Number"
              error={errors.account_number ? true : false}
              helperText={errors.account_number?.message}
              {...register("account_number")}
              sx={{
                width: "100%",
              }}
            />
          </div>


          <div className="mb-8 w-[100%]">
            <FormControl  sx={{
                width: "100%",
              }}>
              <InputLabel>Bank</InputLabel>
              <Select
                name="bank"
                label="Bank"
                defaultValue=""
                {...register("bank")}
                error={errors.bank ? true : false}
                MenuProps={{
                  disableScrollLock: true,
                }}
              >
                {bankNames.map(bank => (
                  <MenuItem key={bank.id} value={bank.name}>{bank.name}</MenuItem>
                ))

                }
                
              </Select>
              {errors.bank && (
                <FormHelperText error={true}>
                  {errors.bank.message}
                </FormHelperText>
              )}
            </FormControl>
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
              }}
            >
            Submit
            </Button>

          </div>
        </ThemeProvider>
      </form>

      
    </div>
        
      
    </div>
  )
}

export default BusinessSetup
