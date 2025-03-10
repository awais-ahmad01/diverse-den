// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm, Controller } from "react-hook-form"; // Import Controller from react-hook-form
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import axios from "axios";

// import { FaArrowLeft } from "react-icons/fa";
// import { TextField, Button, ThemeProvider, createTheme } from "@mui/material";
// import { Link } from "react-router-dom";
// import { errorGlobal, successGlobal } from "../../../../store/reducers/notifications";

// const AddBranches = () => {
//   const { user } = useSelector((state) => state.auth);
  
//   const dispatch = useDispatch();

//   const theme = createTheme({
//     palette: {
//       primary: {
//         main: "#603F26",
//       },
//     },
//   });

//   const schema = yup.object({
//     branch_name: yup.string().required("Branch name is required"),
//     branch_code: yup.string().required("Branch code is required"),
//     branch_email: yup
//       .string()
//       .required("Email is required")
//       .email("Email format is not valid"),
//     branch_city: yup.string().required("Branch city is required"),
//     branch_address: yup.string().required("Branch address is required"),
//     branch_contact: yup.string().required("Branch contact is required"),
//   });

//   const form = useForm({
//     defaultValues: {
//       branch_name: "",
//       branch_code: "",
//       branch_email: "",
//       branch_address: "",
//       branch_city: "",
//       branch_contact: "",
//     },
//     resolver: yupResolver(schema),
//   });

//   const { control, formState, handleSubmit, reset } = form;
//   const { errors } = formState;

//   const onSubmit = async (data) => {
//     console.log(data);
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         console.error("No token found!");
//         return;
//       }

//       const body = {
//         branchCode: data.branch_code,
//         name: data.branch_name,
//         city: data.branch_city,
//         address: data.branch_address,
//         contactNo: data.branch_contact,
//         emailAddress: data.branch_email,
//         business: user.business,
//       };

//       const response = await axios.post(
//         "http://localhost:3000/createBranch",
//         body,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       dispatch(successGlobal('Branch added successfully'));
//       reset();
      
//     } catch (error) {
//       dispatch(errorGlobal(error?.response?.data?.message || 'Failed to add branch'));
//       console.error("Error adding branch:", error);
//     }
//   };

//   return (
//     <div className="bg-gray-50 flex flex-col p-5">
//       <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
//         <Link to="../branchesList">
//           <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
//         </Link>
//         <h1 className="font-bold text-2xl text-[#603F26]">Add Branch</h1>
//       </div>

//       <div className="flex justify-center items-center">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg"
//         >
//           <ThemeProvider theme={theme}>
//             {/* Controller for branch_name */}
//             <div className="mb-4">
//               <Controller
//                 name="branch_name"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     variant="outlined"
//                     id="branch_name"
//                     label="Branch name"
//                     error={!!errors.branch_name}
//                     helperText={errors.branch_name?.message}
//                     {...field} // Spread the field props from Controller
//                     sx={{ width: "100%" }}
//                   />
//                 )}
//               />
//             </div>

//             {/* Controller for branch_code */}
//             <div className="mb-4">
//               <Controller
//                 name="branch_code"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     variant="outlined"
//                     id="branch_code"
//                     label="Branch Code"
//                     error={!!errors.branch_code}
//                     helperText={errors.branch_code?.message}
//                     {...field}
//                     sx={{ width: "100%" }}
//                   />
//                 )}
//               />
//             </div>

//             {/* Controller for branch_email */}
//             <div className="mb-4">
//               <Controller
//                 name="branch_email"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     variant="outlined"
//                     id="branch_email"
//                     label="Branch Email"
//                     error={!!errors.branch_email}
//                     helperText={errors.branch_email?.message}
//                     {...field}
//                     sx={{ width: "100%" }}
//                   />
//                 )}
//               />
//             </div>

//             {/* Controller for branch_city */}
//             <div className="mb-4">
//               <Controller
//                 name="branch_city"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     variant="outlined"
//                     id="branch_city"
//                     label="Branch City"
//                     error={!!errors.branch_city}
//                     helperText={errors.branch_city?.message}
//                     {...field}
//                     sx={{ width: "100%" }}
//                   />
//                 )}
//               />
//             </div>

//             {/* Controller for branch_address */}
//             <div className="mb-4">
//               <Controller
//                 name="branch_address"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     variant="outlined"
//                     id="branch_address"
//                     label="Branch Address"
//                     error={!!errors.branch_address}
//                     helperText={errors.branch_address?.message}
//                     {...field}
//                     sx={{ width: "100%" }}
//                   />
//                 )}
//               />
//             </div>

//             {/* Controller for branch_contact */}
//             <div className="mb-4">
//               <Controller
//                 name="branch_contact"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     variant="outlined"
//                     id="branch_contact"
//                     label="Branch Contact No."
//                     error={!!errors.branch_contact}
//                     helperText={errors.branch_contact?.message}
//                     {...field}
//                     sx={{ width: "100%" }}
//                   />
//                 )}
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="mt-6 text-center">
//               <Button
//                 variant="contained"
//                 color="primary"
//                 size="medium"
//                 type="submit"
//                 sx={{
//                   textTransform: "none",
//                   width: "150px",
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Add
//               </Button>
//             </div>
//           </ThemeProvider>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddBranches;



import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate

 } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa";
import { 
  TextField, 
  Button, 
  ThemeProvider, 
  createTheme, 
  FormControlLabel, 
  Checkbox 
} from "@mui/material";
import { Link } from "react-router-dom";
import { errorGlobal, successGlobal } from "../../../../store/reducers/notifications";

const AddBranches = () => {
  const { user } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  // Check if we should show the main branch checkbox
  const showMainBranchOption = user?.hasMainBranch === false;

  console.log("showMainBranchOption:", showMainBranchOption);

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
    is_main_branch: yup.boolean(),
  });

  const form = useForm({
    defaultValues: {
      branch_name: "",
      branch_code: "",
      branch_email: "",
      branch_address: "",
      branch_city: "",
      branch_contact: "",
      is_main_branch: false,
    },
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, reset } = form;
  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found!");
        return;
      }

      const body = {
        branchCode: data.branch_code,
        name: data.branch_name,
        city: data.branch_city,
        address: data.branch_address,
        contactNo: data.branch_contact,
        emailAddress: data.branch_email,
        business: user.business,
        user: user,
        isMainBranch: showMainBranchOption ? data.is_main_branch : false,
      };

      console.log('Body: ', body);

      const response = await axios.post(
        "http://localhost:3000/createBranch",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(successGlobal('Branch added successfully'));
      reset();
      navigate('../branchesList');
      window.location.reload();
      
    } catch (error) {
      dispatch(errorGlobal(error?.response?.data?.message || 'Failed to add branch'));
      console.error("Error adding branch:", error);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col p-5">
      <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
        <Link to="../branchesList">
          <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
        </Link>
        <h1 className="font-bold text-2xl text-[#603F26]">Add Branch</h1>
      </div>

      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg"
        >
          <ThemeProvider theme={theme}>
            {/* Controller for branch_name */}
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

            {/* Controller for branch_code */}
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

            {/* Controller for branch_email */}
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

            {/* Controller for branch_city */}
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

            {/* Controller for branch_address */}
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

            {/* Controller for branch_contact */}
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

            {/* Main Branch Checkbox - Only shown if user.mainBranch is null */}
            {showMainBranchOption && (
              <div className="mb-4">
                <Controller
                  name="is_main_branch"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          color="primary"
                        />
                      }
                      label="Set as Main Branch"
                    />
                  )}
                />
              </div>
            )}

            {/* Submit Button */}
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

export default AddBranches;