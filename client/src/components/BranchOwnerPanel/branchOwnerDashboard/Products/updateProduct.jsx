import React from "react";
import { useState, useEffect } from "react";
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
  IconButton,
  FormControl,
  FormHelperText,
  Dialog,
  CardMedia,
  Box
} from "@mui/material";
import { FaTrash } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { getProductByID } from "../../../../store/actions/products";
import { getAllBranches } from "../../../../store/actions/branches";
import { updateProduct } from "../../../../store/actions/products";

const UpdateProduct = () => {
  const { productId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { allBranches } = useSelector((state) => state.branches);
  const { productById } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  console.log("DO NA:", productById);

  const [Allcategories, setAllCategories] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [images, setImages] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  // const [img, setImg] = useState([]);

  // console.log("Img: ",img);

  // console.log("Selected Img:", selectedImage)

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
    subCategory: yup.string().when(["category"], {
      is: (category) => category === "Clothing" || category === "Shoes",
      then: (schema) =>
        schema.required("SubCategory is required for Clothing and Shoes"),
      otherwise: (schema) => schema.notRequired(),
    }),
    productType: yup.string().required("Product type is required"),
  
    price: yup.number().required("Price is required"),
    sku: yup.string().required("SKU is required"),
    media: yup.mixed().required("At least one image is required"),
    variants: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            size: yup.string(),
            material: yup.string(),
            quantity: yup.number().when(["size", "material", "colors"], {
              is: (size, material, colors) =>
                (size || material) && (!colors || colors.length === 0),
              then: (schema) =>
                schema
                  .required("Quantity is required when no colors are added")
                  .min(1, "Quantity must be at least 1"),
              otherwise: (schema) => schema.nullable(),
            }),
            colors: yup.array().of(
              yup.object().shape({
                color: yup.string().required("Color is required"),
                quantity: yup
                  .number()
                  .required("Quantity is required")
                  .min(1, "Quantity must be at least 1"),
              })
            ),
            variantTotal: yup.number(),
          })
          .test(
            "at-least-one-field",
            "At least one of size, material, or color is required",
            function (value) {
              return (
                value.size ||
                value.material ||
                (value.colors && value.colors.length > 0)
              );
            }
          )
      )
      .min(1, "At least one variant is required"),
    totalQuantity: yup.number().min(1, "Total quantity must be at least 1"),
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subCategory: "",
      productType: "",
      branch: "",
      price: "",
      sku: "",
      media: [],
      variants: [
        { size: "", material: "", colors: [], quantity: 0, variantTotal: 0 },
      ],
      totalQuantity: 0,
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
    reset,
  } = form;

  const { errors } = formState;

  const {
    fields: variants,
    append: appendVariant,
    remove: removeVariant,
    replace: replaceVariants,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const watchVariants = watch("variants");

  
  const recalculateQuantities = React.useCallback(() => {
    const currentVariants = getValues("variants");

    currentVariants.forEach((variant, index) => {
      const variantTotal =
        variant.colors && variant.colors.length > 0
          ? variant.colors.reduce(
              (sum, color) => sum + (Number(color.quantity) || 0),
              0
            )
          : Number(variant.quantity) || 0;

      setValue(`variants.${index}.variantTotal`, variantTotal);

      if (variant.colors && variant.colors.length > 0) {
        setValue(`variants.${index}.quantity`, variantTotal);
      }
    });

    const total = currentVariants.reduce(
      (sum, variant) => sum + (variant.variantTotal || 0),
      0
    );
    setValue("totalQuantity", total);
  }, [setValue, getValues]);

  useEffect(() => {
    recalculateQuantities();
  }, [watchVariants, recalculateQuantities]);

  const handleAddVariant = () => {
    appendVariant({
      size: "",
      material: "",
      colors: [],
      quantity: 0,
      variantTotal: 0,
    });
  };

  const handleAddColor = (variantIndex) => {
    const currentVariant = watchVariants[variantIndex];
    const currentColors = currentVariant.colors || [];
    setValue(`variants.${variantIndex}.colors`, [
      ...currentColors,
      { color: "", quantity: 0 },
    ]);
    setValue(`variants.${variantIndex}.quantity`, null);
  };

  const handleRemoveColor = (variantIndex, colorIndex) => {
    const currentVariant = watchVariants[variantIndex];
    const updatedColors = currentVariant.colors.filter(
      (_, index) => index !== colorIndex
    );
    setValue(`variants.${variantIndex}.colors`, updatedColors);

    if (updatedColors.length === 0) {
      setValue(`variants.${variantIndex}.quantity`, null);
      setValue(`variants.${variantIndex}.variantTotal`, 0);
    }

    recalculateQuantities();
  };

  

  
  useEffect(() => {
    if (productId) {
      dispatch(getProductByID(productId));
    }
  }, [dispatch, productId]);


  useEffect(() => {
    if (productById) {
      reset({
        title: productById.title,
        description: productById.description,
        category: productById.category,
        subCategory: productById.subCategory,
        productType: productById.productType,
        price: productById.price,
        sku: productById.sku,
        variants: productById.variants,
        totalQuantity: productById.totalQuantity,
      });

      setSelectedCategory(productById.category);
      setSelectedSubCategory(productById.subCategory);

     
      if (productById.imagePath && productById.imagePath.length > 0) {
        const existingImagePaths = productById.imagePath;
        const existingImageUrls = existingImagePaths.map((path) =>
          path.replace(/\\/g, "/")
        );
        setExistingImages(existingImageUrls);
        const formattedImages = existingImageUrls.map((url) => ({
          url,
          isNew: false,
        }));
        setImages(formattedImages);
        setChecked(new Array(existingImageUrls.length).fill(false));
        setValue("media", formattedImages);
      }
    }
  }, [productById, reset]);



  const clickMediaFile = () => {
    document.getElementById("input-file").click();
  };

  const handleImages = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);

   
    const currentMedia = getValues("media") || [];
    setValue("media", [...currentMedia, ...files]);

  
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

   
    const remainingExistingImages = newImages
      .filter((img) => !img.isNew)
      .map((img) => img.url);
    setExistingImages(remainingExistingImages);


    const remainingNewImages = newImages
      .filter((img) => img.isNew)
      .map((img) => img.file);
    setValue("media", remainingNewImages);
  };


  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };


  const handleSelectedImage = (image) => {
    setSelectedImage(image.url);
    setOpen(true);
  };



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/categories.json");
        const data = await response.json();
        setAllCategories(data);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const business = user?.business;
    dispatch(getAllBranches(business));
  }, [dispatch, user?.business]);



  const onSubmit = async (data) => {
    const business = user?.business;
    const updatedData = {
      ...data,
      existingImages,
      // productId,
    };


    console.log("DATaAAA:", updatedData)

    const body = {
      data: updatedData,
      business,
      productId
    };
    


    console.log("Data: ", body);

    dispatch(updateProduct(body))
      
  };

  return (
    <div className="bg-gray-50 flex flex-col p-5">
      <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
        <Link to="../productsList">
          <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
        </Link>
        <h1 className="font-bold text-2xl text-[#603F26]">Update Product</h1>
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
                  render={({ field: { onChange, ...field } }) => (
                    <Select
                      {...field}
                      label="Category"
                      value={selectedCategory || ""}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        onChange(selectedValue);
                        setSelectedCategory(selectedValue);
                        setValue("subCategory", "");
                        setValue("productType", "");
                        setSelectedSubCategory("");
                      }}
                      error={!!errors.category}
                      MenuProps={{
                        disableScrollLock: true,
                      }}
                    >
                      {Object.keys(Allcategories).map((category, index) => (
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

            {/* Show SubCategory for Clothing and Shoes */}
            {(selectedCategory === "Clothing" ||
              selectedCategory === "Shoes") && (
              <div className="mb-4">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>SubCategory</InputLabel>
                  <Controller
                    name="subCategory"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <Select
                        {...field}
                        label="SubCategory"
                        value={selectedSubCategory || ""}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          onChange(selectedValue);
                          setSelectedSubCategory(selectedValue);
                          setValue("productType", "");
                        }}
                        error={!!errors.subCategory}
                        MenuProps={{
                          disableScrollLock: true,
                        }}
                      >
                        {Object.keys(Allcategories[selectedCategory] || {}).map(
                          (subcategory, index) => (
                            <MenuItem key={index} value={subcategory}>
                              {subcategory}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    )}
                  />
                  {errors.subCategory && (
                    <FormHelperText error={true}>
                      {errors.subCategory.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            )}

            {/* Show Product Type for Clothing/Shoes after subcategory selection */}
            {(selectedCategory === "Clothing" ||
              selectedCategory === "Shoes") &&
              selectedSubCategory && (
                <div className="mb-4">
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel>Product Type</InputLabel>
                    <Controller
                      name="productType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Product Type"
                          error={!!errors.productType}
                          MenuProps={{
                            disableScrollLock: true,
                          }}
                        >
                          {(
                            Allcategories[selectedCategory]?.[
                              selectedSubCategory
                            ] || []
                          ).map((type, index) => (
                            <MenuItem key={index} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.productType && (
                      <FormHelperText error={true}>
                        {errors.productType.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
              )}

            {/* Show Product Type directly for Decoration Pieces and Furniture */}
            {(selectedCategory === "DecorationPieces" ||
              selectedCategory === "Furniture") && (
              <div className="mb-4">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>Product Type</InputLabel>
                  <Controller
                    name="productType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Product Type"
                        error={!!errors.productType}
                        MenuProps={{
                          disableScrollLock: true,
                        }}
                      >
                        {(Allcategories[selectedCategory] || []).map(
                          (type, index) => (
                            <MenuItem key={index} value={type}>
                              {type}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    )}
                  />
                  {errors.productType && (
                    <FormHelperText error={true}>
                      {errors.productType.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
            
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
            <button type="button">
              {checked.filter((state) => state).length} file Selected
            </button>
          </div>
          <div>
            <button
              type="button"
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
        className={`media-wrapper w-full flex flex-col gap-2 justify-center items-center border-2 border-dashed border-gray-300 rounded-lg ${
          images.length ? "p-2" : "p-10"
        }`}
      >
        {!images.length ? (
          <div className="text-center">
            <div className="flex gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-[#603F26] text-white rounded-lg hover:bg-[#4a3019]"
                onClick={clickMediaFile}
              >
                Upload media
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>Accept images only</p>
            </div>
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`uploaded ${index}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer"
                  onClick={() => handleSelectedImage(image)}
                />
                <input
                  type="checkbox"
                  className={`absolute top-2 left-2 h-4 w-4 cursor-pointer ${
                    checked.some((state) => state === true)
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                  checked={checked[index]}
                  onChange={() => handleCheck(index)}
                />
              </div>
            ))}
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={clickMediaFile}
                className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400"
              >
                <span className="text-4xl text-gray-400">+</span>
              </button>
            </div>
          </div>
        )}
        <input
          type="file"
          id="input-file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleImages}
        />
        {errors.media && (
          <p className="text-red-500 text-sm mt-1">{errors.media?.message}</p>
        )}
      </div>
    </div>
            {/* ///////////////   VARIANT START   //////////////// */}
            <h3 className="text-md font-bold mb-3">Variants</h3>
            {errors.variants && !Array.isArray(errors.variants) && (
              <p className="text-red-500 text-sm mb-2">
                {errors.variants.message}
              </p>
            )}
            {variants.map((field, index) => (
              <div
                key={field.id}
                className="mb-6 border p-4 rounded-lg bg-gray-50 relative"
              >
                {variants.length > 1 && (
                  <IconButton
                    onClick={() => removeVariant(index)}
                    className="absolute top-2 right-2"
                  >
                    <FaTrash />
                  </IconButton>
                )}

                {/* Size Field */}
                <div className="mb-4 mt-2">
                  <Controller
                    name={`variants.${index}.size`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Size"
                        variant="outlined"
                        error={!!errors.variants?.[index]?.size}
                        helperText={errors.variants?.[index]?.size?.message}
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                </div>

                {/* Material Field */}
                <div className="mb-4">
                  <Controller
                    name={`variants.${index}.material`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Material"
                        variant="outlined"
                        error={!!errors.variants?.[index]?.material}
                        helperText={errors.variants?.[index]?.material?.message}
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                </div>

                {/* Color Fields */}
                {watchVariants[index].colors?.map((color, colorIndex) => (
                  <div
                    key={`${field.id}-color-${colorIndex}`}
                    className="flex items-center gap-4 mb-2"
                  >
                    <Controller
                      name={`variants.${index}.colors.${colorIndex}.color`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Color"
                          variant="outlined"
                          error={
                            !!errors.variants?.[index]?.colors?.[colorIndex]
                              ?.color
                          }
                          helperText={
                            errors.variants?.[index]?.colors?.[colorIndex]
                              ?.color?.message
                          }
                          sx={{ flex: 1 }}
                        />
                      )}
                    />
                    <Controller
                      name={`variants.${index}.colors.${colorIndex}.quantity`}
                      control={control}
                      render={({ field: { onChange, ...field } }) => (
                        <TextField
                          {...field}
                          label="Quantity"
                          type="number"
                          variant="outlined"
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            onChange(value);
                            recalculateQuantities();
                          }}
                          error={
                            !!errors.variants?.[index]?.colors?.[colorIndex]
                              ?.quantity
                          }
                          helperText={
                            errors.variants?.[index]?.colors?.[colorIndex]
                              ?.quantity?.message
                          }
                          sx={{ flex: 1 }}
                        />
                      )}
                    />
                    <IconButton
                      onClick={() => handleRemoveColor(index, colorIndex)}
                    >
                      <FaTrash />
                    </IconButton>
                  </div>
                ))}

                {/* Add Color Button */}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleAddColor(index)}
                  sx={{ marginTop: "10px" }}
                >
                  Add Color
                </Button>

                {/* Quantity Field for Non-Color Variants */}
                {!watchVariants[index].colors?.length && (
                  <div className="mt-4">
                    <Controller
                      name={`variants.${index}.quantity`}
                      control={control}
                      render={({ field: { onChange, ...field } }) => (
                        <TextField
                          {...field}
                          label="Quantity"
                          type="number"
                          variant="outlined"
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            onChange(value);
                            recalculateQuantities();
                          }}
                          error={!!errors.variants?.[index]?.quantity}
                          helperText={
                            errors.variants?.[index]?.quantity?.message
                          }
                          sx={{ width: "100%" }}
                          disabled={watchVariants[index].colors?.length > 0}
                        />
                      )}
                    />
                  </div>
                )}

                {/* Variant Total Field */}
                {watchVariants[index].colors?.length > 0 && (
                  <div className="mt-4">
                    <Controller
                      name={`variants.${index}.variantTotal`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Variant Total Quantity"
                          variant="outlined"
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{ width: "100%" }}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
            {/* Add Variant Button */}
            <Button
              variant="outlined"
              size="medium"
              onClick={handleAddVariant}
              sx={{ marginBottom: "20px" }}
            >
              Add Variant
            </Button>
            {/* Total Quantity Field */}
            <div className="mb-4">
              <Controller
                name="totalQuantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total Quantity"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    error={!!errors.totalQuantity}
                    helperText={errors.totalQuantity?.message}
                    sx={{ width: "100%" }}
                  />
                )}
              />
            </div>
            {/* ///////////////   VARIANT END   //////////////// */}
            {/* {selectedImage && (
              <div className="modal z-50">
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
            )} */}



          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xl" 
            fullWidth
           
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black", 
                height: "100%",
              }}
              
            >
              <CardMedia
                component="img"
                image={selectedImage} 
                alt="Full-size product view"
                sx={{
                  maxHeight: "80vh", 
                  objectFit: "contain", 
                }}
              />
            </Box>
          </Dialog>





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
                Update
              </Button>
            </div>
          </ThemeProvider>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
