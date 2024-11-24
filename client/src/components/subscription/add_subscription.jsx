import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

const AddSubscription = () => {


    const theme = createTheme({
        palette: {
          primary: {
            main: "#603F26",
          },
        },
      });
    


  const schema = yup.object({
    name: yup.string().required('name is required'),
    price: yup.number().required('price is required'),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      price: null,
      features: [],
    },

    resolver: yupResolver(schema),
  });

  const { register, control, formState, handleSubmit } = form;

  const { errors } = formState;

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'features'

  })


  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <div className="w-[450px] flex justify-center items-center mt-4">
        <img src="/images/DD.png" alt="DD" className="w-[50%]"></img>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "70%" }}
        className="border-[0.2px] border-black border-opacity-50 p-8 
                    pt-3 rounded-lg my-8"
      >
        <h1 className="mb-4 font-medium text-2xl">Create Plan</h1>

        <ThemeProvider theme={theme}>
          <div className="mb-8">
            <TextField
              variant="outlined"
              id="name"
              label="Name of the Plan"
              error={errors.name ? true : false}
              helperText={errors.name?.message}
              {...register("name")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          <div className="mb-8">
            <TextField
              variant="outlined"
              id="price"
              label="price"
              error={errors.price ? true : false}
              helperText={errors.price?.message}
              {...register("price")}
              sx={{
                width: "100%",
              }}
            />
          </div>

          {fields.map((filed, index)=>(
                <div key={filed.id}>
                    <TextField
                        variant="outlined"
                        id="name"
                        label="Add feature"
                        error={errors.features ? true : false}
                        helperText={errors.features?.message}
                        {...register(`features[${index}]`)}
                        sx={{
                            width: "100%",
                        }}
                    />
                    <div className="text-center">
                                <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                type="button"
                                onClick={()=> remove(index)}
                                sx={{
                                    textTransform: "none",
                                    width: "150px",
                                }}
                                >
                                remove
                                </Button>

                    </div>
                </div>


          ))

          }

        <div className="text-center">
            <Button
              variant="contained"
              color="primary"
              size="small"
              type="button"
              onClick={()=> append('')}
              sx={{
                textTransform: "none",
                width: "150px",
              }}
            >
            Add new Feature
            </Button>

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
            Add Plan
            </Button>

          </div>
        </ThemeProvider>
      </form>

      
    </div>
  );
};

export default AddSubscription;
