import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductByID } from "../../../../store/actions/products";
import { Loader } from "../../../../tools";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  Divider,
  Paper,
  Container,
  CircularProgress,
  Dialog,
} from "@mui/material";
import {
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Image as ImageIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ViewBranchProduct = () => {
 
  const dispatch = useDispatch();
  const { productById, isLoading } = useSelector((state) => state.products);

  const { productId, productTitle, branchCode } = useParams();

  const [tabValue, setTabValue] = useState(0);
  const [uniqueColorsData, setUniqueColorsData] = useState([]);

  const [materialMsg, setMaterialMsg] = useState("");
  const [sizeMsg, setSizeMsg] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (productId) {
      dispatch(getProductByID(productId));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (productById?.variants) {
      const allColors = productById.variants.reduce((colors, variant) => {
        if (variant.colors) {
          variant.colors.forEach((colorObj) => {
            if (colorObj.color) {
              colors.add(colorObj.color);
            }
          });
        }
        return colors;
      }, new Set());

      setUniqueColorsData(Array.from(allColors));
    }
  }, [productById]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 5 }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#603F26",
              }}
              
            >
              {productById?.title || "Untitled Product"}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#603F26",
              }}
            >
              SKU: {productById?.sku || "N/A"}
            </Typography>
          </Box>
          <Chip
            label={`Total Quantity: ${productById?.totalQuantity}`}
            // color="primary"
            variant="outlined"
            size="large"
            sx={{
              marginTop: "12px",
              color: "#603F26",
              borderColor: "#603F26",
              "& .MuiChip-outlined": {
                borderColor: "#603F26",
              },
              "&:hover": {
                borderColor: "#8e6c4f",
                color: "#8e6c4f",
              },
            }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <ImageIcon sx={{ mr: 1 }} /> Product Images
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  {productById?.imagePath &&
                  productById.imagePath.length > 0 ? (
                    productById.imagePath.map((img, index) => (
                      <CardMedia
                        key={index}
                        component="img"
                        image={img}
                        alt={`Product view ${index + 1}`}
                        onClick={() => handleImageClick(img)}
                        sx={{
                          borderRadius: 1,
                          height: 200,
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/api/placeholder/300/300";
                          e.target.alt = "Image failed to load";
                        }}
                      />
                    ))
                  ) : (
                    <CardMedia
                      component="img"
                      image="/api/placeholder/300/300"
                      alt="No image available"
                      onClick={() =>
                        handleImageClick("/api/placeholder/300/300")
                      }
                      sx={{
                        borderRadius: 1,
                        height: 150,
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>

            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
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
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <InfoIcon sx={{ mr: 1 }} /> Basic Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1">Category:</Typography>
                    <Typography>{productById?.category || "N/A"}</Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1">Subcategory:</Typography>
                    <Typography>{productById?.subCategory || "N/A"}</Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1">Product Type:</Typography>
                    <Typography>{productById?.productType || "N/A"}</Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1">Base Price:</Typography>
                    <Typography>
                      ${productById?.price?.toFixed(2) || "0.00"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Description:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {productById?.description || "No description available"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <InventoryIcon sx={{ mr: 1 }} /> Variants & Inventory
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      variant="fullWidth"
                    >
                      <Tab label="Available Variants" />
                      <Tab label="Stock Details" />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabValue} index={0}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Sizes:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {productById?.variants?.map((variant, index) => (
                            <Chip
                              key={index}
                              label={variant.size || "N/A"}
                              variant="outlined"
                            />
                          )) || (
                            <Typography color="text.secondary">
                              No sizes available
                            </Typography>
                          )}

                          {(!productById?.variants ||
                            productById?.variants.every(
                              (variant) => !variant?.size?.length
                            )) && (
                            <Typography color="text.secondary">
                              No size available
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Colors:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {uniqueColorsData.length > 0 ? (
                            uniqueColorsData.map((color, index) => (
                              <Chip
                                key={index}
                                label={color}
                                variant="outlined"
                              />
                            ))
                          ) : (
                            <Typography color="text.secondary">
                              No colors available
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Material:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {productById?.variants?.map(
                            (variant, index) =>
                              variant?.material?.length > 0 && (
                                <Chip
                                  key={index}
                                  label={variant.material}
                                  variant="outlined"
                                />
                              )
                          ) || (
                            <Typography color="text.secondary">
                              No material available
                            </Typography>
                          )}

                          {(!productById?.variants ||
                            productById?.variants.every(
                              (variant) => !variant?.material?.length
                            )) && (
                            <Typography color="text.secondary">
                              No material available
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TabPanel>

                  <TabPanel value={tabValue} index={1}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {productById?.variants?.length > 0 ? (
                        productById.variants.map((variant, variantIndex) => {
                          if (variant.colors?.length > 0) {
                            return variant.colors.map((color, colorIndex) => (
                              <Paper
                                key={`${variantIndex}-${colorIndex}`}
                                variant="outlined"
                                sx={{
                                  p: 1,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography>
                                  {variant.size ? `${variant.size} - ` : ""}
                                  {variant.material
                                    ? `${variant.material} - `
                                    : ""}
                                  {color.color}
                                </Typography>
                                <Chip
                                  label={`${color.quantity || 0} units`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Paper>
                            ));
                          }

                          if (variant.size || variant.material) {
                            return (
                              <Paper
                                key={variantIndex}
                                variant="outlined"
                                sx={{
                                  p: 1,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography>
                                  {variant.size ? `${variant.size} - ` : ""}
                                  {variant.material ? variant.material : ""}
                                </Typography>
                                <Chip
                                  label={`${variant.variantTotal || 0} units`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Paper>
                            );
                          }

                          return null;
                        })
                      ) : (
                        <Typography color="text.secondary">
                          No inventory details available
                        </Typography>
                      )}
                    </Box>
                  </TabPanel>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ViewBranchProduct;
