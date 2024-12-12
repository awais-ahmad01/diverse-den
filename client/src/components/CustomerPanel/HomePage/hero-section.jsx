import React from "react";
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';

const items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      image: "/images/c1.jpg"
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      image: "/images/c2.jpg"
    },
    {
        name: "Random Name #2",
        description: "Hello World!",
        image: "/images/c3.jpg"
    }
  ]

const HeroSection = () => {
  return (
    <div>
       <Carousel>
      {items.map((item, i) => (
        <Paper key={i}>
          <img 
            src={item.image} 
            alt={item.name} 
            style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}
          />
          {/* <h2>{item.name}</h2>
          <p>{item.description}</p> */}
        </Paper>
      ))}
    </Carousel>
    </div>
  );
};

export default HeroSection;
