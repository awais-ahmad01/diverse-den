import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaArrowLeft } from "react-icons/fa";
import {
  TextField,
  Button,
  ThemeProvider,
  createTheme,
  TextareaAutosize,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { Link } from "react-router-dom";

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  const schema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    category: yup.string().required("Category is required"),
    price: yup.number().required("Price is required"),
    sku: yup.string().required("SKU is required"),

  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "",
      sku: "",
      media: [],
      options: []
    },
    resolver: yupResolver(schema),
  });

  const {
    register,
    control,
    formState,
    handleSubmit,
    setValue,
    getValues,
    watch,
  } = form;

  const { errors } = formState;

  const {
    fields: optionFields,
    append: appendOptions,
    remove: removeOptions,
  } = useFieldArray({
    name: "options",
    control,
  });

  const onSubmit = async (data) => {
    console.log(data);
  };

  const categories = ["Men", "Women", "Kids"];

  const [images, setImages] = useState([]);

  const [checked, setChecked] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const clickMediaFile = () => {
    document.getElementById("input-file").click();
  };

  const handleImages = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);

    setValue("media", [...getValues("media"), ...files]);

    setChecked((prevChecked) => [
      ...prevChecked,
      ...new Array(files.length).fill(false),
    ]);
  };

  const handleCheck = (index) =>
    setChecked((prevChecked) => {
      const newChecked = [...prevChecked];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });

  const deleteImages = () => {
    const newImages = images.filter((image, index) => !checked[index]);
    const newChecked = checked.filter((state) => !state);

    setImages(newImages);
    setChecked(newChecked);
    setValue(
      "media",
      newImages.map((image) => image.file)
    );
  };

  const handleSelectedImage = (image) => {
    setSelectedImage(image);
  };

  const closePreview = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-gray-50 flex flex-col p-5">
      <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
        <Link to="../productsList">
          <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
        </Link>
        <h1 className="font-bold text-2xl text-[#603F26]">Add Product</h1>
      </div>

      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg"
        >
          <ThemeProvider theme={theme}>
            <div className="mb-4">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="title"
                    label="Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    {...field}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div>
                    <TextareaAutosize
                      {...field}
                      aria-label="Description"
                      minRows={3}
                      placeholder="Description"
                      className={`w-full p-2 border ${
                        errors.description
                          ? "border-red-600"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#603F26]`}
                    />
                    {errors.description && (
                      <FormHelperText error={true} sx={{ paddingLeft: "15px" }}>
                        {errors.description?.message}
                      </FormHelperText>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mb-4">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel>Category</InputLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Category"
                      error={!!errors.category}
                    >
                      {categories.map((category, index) => (
                        <MenuItem key={index} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.category && (
                  <FormHelperText error={true}>
                    {errors.category.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="mb-4">
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="price"
                    label="Price"
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    {...field}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="sku"
                    label="SKU"
                    error={!!errors.sku}
                    helperText={errors.sku?.message}
                    {...field}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>

            <div className="form-control">
              {checked.some((state) => state === true) ? (
                <div className="flex justify-between mb-[5px]">
                  <div>
                    <button>
                      {checked.filter((state) => state).length} file Selected
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={deleteImages}
                      className="text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label>Media</label>
                </div>
              )}
              <div
                className={`media-wrapper w-full flex flex-col gap-2 justify-center items-center ${
                  images.length ? "p-2" : "p-10"
                } `}
              >
                {!images.length ? (
                  <div>
                    <div className="flex gap-4">
                      <button className="btn1" onClick={clickMediaFile}>
                        Upload media
                      </button>
                    </div>

                    <div className="">
                      <p>Accept images only</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-7 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="images">
                        <img
                          src={image.url}
                          alt={`uploaded ${index}`}
                          className="w-24 h-24"
                          onClick={() => handleSelectedImage(image.url)}
                        />

                        <input
                          type="checkbox"
                          className={`image-check ${
                            checked.some((state) => state === true) &&
                            "show-check"
                          }`}
                          checked={checked[index]}
                          onChange={() => handleCheck(index)}
                        />
                      </div>
                    ))}

                    <div className="plus-btn flex justify-center">
                      <button onClick={clickMediaFile} className="text-4xl">
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <input
                    type="file"
                    id="input-file"
                    className="hidden"
                    accept="image/*"
                    {...register("media")}
                    onChange={(event) => handleImages(event)}
                    multiple
                  />
                </div>
              </div>
            </div>



            {/* ///////////////   VARIANT START   //////////////// */}

          <div className="variants form-control">
            <label>Variants</label>
            <div className="options-container">
              {optionFields.map((option, optionIndex) => (
                <div key={option.id}>
                  <div>
                    <label>Option name</label>
                    <input
                      type="text"
                      className="w-full mb-3"
                      {...register(`options.${optionIndex}.name`)}
                    />
                  </div>
                  <div>
                    <label>Option values</label>
                    <div>
                      <FieldArrayNested
                        control={control}
                        optionIndex={optionIndex}
                        register={register}
                        watch={watch}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOptions(optionIndex)}
                    className="delete-option-btn"
                  >
                    Delete Option
                  </button>
                  <hr className="hz-line my-4" />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendOptions({
                    name: "",
                    values: [{ value: "", price: "", quantity: "" }],
                  })
                }
                className="add-option-btn"
              >
                {!optionFields.length
                  ? "Add options like size or color"
                  : "Add another option"}
              </button>
            </div>

            <div className="group-variant">
              <div className="variant-group-top flex items-center mt-8 gap-4 bg">
                <input type="checkbox" className="w-4 h-4" />
                <div className="flex justify-between flex-grow">
                  <span className="font-semibold">Variant</span>
                  <span className="font-semibold">Price</span>
                  <span className="font-semibold">Available</span>
                </div>
              </div>

              {/* Assuming you have options defined in the form state */}
              {getValues("options").map(
                (option, optionIndex) =>
                  optionIndex === 0 &&
                  option.values.map((value, valueIndex) => (
                    <div key={`${optionIndex}-${valueIndex}`}>
                      {value.value && (
                        <div>
                          <div className="variant-row flex gap-4 mt-3 pl-[10px] items-center">
                            <div>
                              <input type="checkbox" className="w-4 h-4" />
                            </div>
                            <div className="flex justify-between flex-grow">
                              <div className="flex gap-2">
                                <div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    id="image-file"
                                  />
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    {value.value}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-24">
                                <div>
                                  <input
                                    type="text"
                                    className="w-32"
                                    {...register(
                                      `options.${optionIndex}.values.${valueIndex}.price`
                                    )}
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    className="w-24"
                                    {...register(
                                      `options.${optionIndex}.values.${valueIndex}.quantity`
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr className="mt-4" />

                          {getValues("options").map(
                            (option, optionIndex) =>
                              optionIndex === 1 &&
                              option.values.map(
                                (value, valueIndex) =>
                                  value.value && (
                                    <div key={valueIndex}>
                                      <div className="variant-row flex gap-4 mt-3 ml-4 pl-[10px] items-center">
                                        <div>
                                          <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                          />
                                        </div>
                                        <div className="flex justify-between flex-grow">
                                          <div className="flex gap-2">
                                            <div>
                                              <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                id="image-file"
                                              />
                                            </div>
                                            <div>
                                              <span className="font-semibold">
                                                {value.value}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex gap-24">
                                            <div>
                                              <input
                                                type="text"
                                                className="w-32"
                                                {...register(
                                                  `options.${optionIndex}.values.${valueIndex}.price`
                                                )}
                                              />
                                            </div>
                                            <div>
                                              <input
                                                type="text"
                                                className="w-24"
                                                {...register(
                                                  `options.${optionIndex}.values.${valueIndex}.quantity`
                                                )}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <hr className="mt-4" />
                                    </div>
                                  )
                              )
                          )}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* ///////////////   VARIANT END   //////////////// */}


          {selectedImage && (
          <div className="modal">
            <div className="bg-slate-50 w-full px-5 py-2">
              <span
                onClick={closePreview}
                className="font-semibold cursor-pointer hover:text-blue-600 "
              >
                Exit
              </span>
            </div>
            <div className="flex justify-center items-center">
              <div className="modal-content">
                <img
                  src={selectedImage}
                  className="full-image"
                  alt="Selected"
                />
              </div>
            </div>
          </div>
        )}



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


const FieldArrayNested = ({ optionIndex, register, control, watch }) => {
    const { fields, append, remove } = useFieldArray({
      name: `options.${optionIndex}.values`,
      control,
    });
  
    const optionValues = watch(`options.${optionIndex}.values`);
  
    return (
      <>
        {fields.map((value, valueIndex) => (
          <div key={value.id} className="relative">
            <input
              type="text"
              className="w-full mb-3"
              {...register(`options.${optionIndex}.values.${valueIndex}.value`)}
            />
            {valueIndex > 0 && (
              <button
                type="button"
                className="absolute right-2"
                onClick={() => remove(valueIndex)}
              >
                <DeleteIcon />
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-center items-center">
          <button
            type="button"
            className="bg-black rounded text-white text-[13px] py-[2px] px-[6px] font-semibold"
            onClick={() => append({ value: "", price: "", quantity: "" })}
          >
            Add Value
          </button>
        </div>
      </>
    );
  };




export default AddProduct;
