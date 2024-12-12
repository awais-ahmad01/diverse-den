import React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  margin: "auto",
  position: "relative",
  paddingBottom: "20px",
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  transition: "all 0.3s ease-in-out",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.16)",
  },
}));

const ProductImage = styled(CardMedia)({
  height: 280,
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  height: 120,
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  fontWeight: "bold",
  marginTop: theme.spacing(1),
  backgroundColor: "#603F26",
  color: "white",
}));

const TitleContainer = styled(Box)(({ theme }) => ({
  minHeight: 50, // Adjust this value as per your design
  display: "flex",
  alignItems: "center",
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(10),
}));

const products = [
  {
    id: 1,
    title: "Elegant Minimalist Watch",
    description: "Sleek design for modern professionals",
    price: 129.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Watch",
  },
  {
    id: 2,
    title: "Leather Messenger Bag",
    description: "Premium leather with smart compartments",
    price: 249.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Bag",
  },
  {
    id: 3,
    title: "Wireless Noise Cancelling Headphones",
    description: "Immersive sound, ultimate comfort",
    price: 199.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
  },
  {
    id: 4,
    title: "Wireless Noise Cancelling Headphones",
    description: "Immersive sound, ultimate comfort",
    price: 199.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
  },
  {
    id: 5,
    title: "Wireless Noise Cancelling Headphones",
    description: "Immersive sound, ultimate comfort",
    price: 199.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
  },
  {
    id: 6,
    title: "Wireless Noise Cancelling Headphones",
    description: "Immersive sound, ultimate comfort",
    price: 199.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
  },
];

const MainContent = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <div className="mt-16">
      <div className="grid grid-cols-4 gap-y-16">
        {products.map((product) => (
          <div key={product.id}>
            <StyledCard className="h-full">
              <ProductImage
                image={product.imageUrl}
                title={product.title}
              ></ProductImage>
              <StyledCardContent>
                <TitleContainer>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 500,
                      marginBottom: 3,
                      color: "text.primary",
                      //   textAlign: "center", // Optional: Center-align titles for consistency
                    }}
                  >
                    {product.title}
                  </Typography>
                </TitleContainer>
                <Box mt="auto">
                  <PriceChip
                    label={`$${product.price.toFixed(2)}`}
                    size="large"
                  />
                </Box>
              </StyledCardContent>
            </StyledCard>
          </div>
        ))}
      </div>

      <SliderContainer>
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id}>
              <StyledCard className="h-full">
                <ProductImage
                  image={product.imageUrl}
                  title={product.title}
                ></ProductImage>
                <StyledCardContent>
                  <TitleContainer>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 500,
                        marginBottom: 3,
                        color: "text.primary",
                        //   textAlign: "center", // Optional: Center-align titles for consistency
                      }}
                    >
                      {product.title}
                    </Typography>
                  </TitleContainer>
                  <Box mt="auto">
                    <PriceChip
                      label={`$${product.price.toFixed(2)}`}
                      size="large"
                    />
                  </Box>
                </StyledCardContent>
              </StyledCard>
            </div>
          ))}
        </Slider>
      </SliderContainer>
    </div>
  );
};

export default MainContent;
