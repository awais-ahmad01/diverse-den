// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import Carousel from 'react-material-ui-carousel';
// import { Paper, Button } from '@mui/material';
// import { useDispatch, useSelector } from "react-redux";
// import { getAllSaleEvents } from "../../../store/actions/saleEvents";

// const items = [
//     {
//       name: "Random Name #1",
//       description: "Probably the most random thing you have ever seen!",
//       image: "/images/c1.jpg"
//     },
//     {
//       name: "Random Name #2",
//       description: "Hello World!",
//       image: "/images/c2.jpg"
//     },
//     {
//         name: "Random Name #2",
//         description: "Hello World!",
//         image: "/images/c3.jpg"
//     },
//     {
//       name: "Random Name #2",
//       description: "Hello World!",
//       image: "/images/c3.jpg"
//   },
//   {
//     name: "Random Name #2",
//     description: "Hello World!",
//     image: "/images/c3.jpg"
// }
//   ]

// const HeroSection = () => {


//   const dispatch = useDispatch();

//   const {allSaleEvents, isloading} = useSelector(state => state.saleEvents);

//   useEffect(() => {
//     dispatch(getAllSaleEvents());
//   }, []);


//   return (
//     <div>
//        <Carousel>
//       {allSaleEvents?.map((event, i) => (
//         <Link to={`/customer/events/${event?._id}`}>
//           <Paper key={i}>
//           <img 
//             src={event?.imagePath} 
//             alt={event?.name} 
//             style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}
//           />
//           <h2 className="text-center font-bold">{event?.name}</h2>
//           <p className="text-center">{event?.description}</p>
//         </Paper>
//         </Link>
//       ))}
//     </Carousel>
//     </div>
//   );
// };

// export default HeroSection;




import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { getAllSaleEvents } from "../../../store/actions/saleEvents";

const HeroSection = () => {
  const dispatch = useDispatch();
  const { allSaleEvents, isloading } = useSelector(state => state.saleEvents);

  useEffect(() => {
    dispatch(getAllSaleEvents());
  }, [dispatch]);

  // Filter sale events with status === "Ongoing"
  const ongoingSaleEvents = allSaleEvents?.filter(event => event?.status === "Ongoing");

  return (
    <div className="w-full mx-auto">
      <Carousel
        animation="fade" // Optional: Adds a fade animation
        navButtonsAlwaysVisible // Optional: Always show navigation buttons
        fullHeightHover // Optional: Full height hover effect for buttons
      >
        {ongoingSaleEvents?.map((event, i) => (
          <Link to={`/customer/events/${event?._id}`} key={i}>
            <Paper className="relative flex justify-center items-center overflow-hidden">
              <img
                src={event?.imagePath}
                alt={event?.name}
                className="w-full h-auto max-h-[600px] object-cover"
              />
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-center">
                <h2 className="text-xl font-bold">{event?.name}</h2>
                <p className="text-sm">{event?.description}</p>
              </div>
            </Paper>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSection;