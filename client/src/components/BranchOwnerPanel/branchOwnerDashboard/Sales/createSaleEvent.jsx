// import React, { useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
// import SaveIcon from '@mui/icons-material/Save';
// import SendIcon from '@mui/icons-material/Send';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import EventIcon from '@mui/icons-material/Event';
// import { TextField, Select, MenuItem, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Checkbox, ThemeProvider, createTheme } from '@mui/material';

// // Define the theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#603F26",
//     },
//   },
// });

// const CreateSaleEvent = () => {
//   const [saleEvent, setSaleEvent] = useState({
//     name: '',
//     description: '',
//     startDate: '',
//     endDate: '',
//     discountType: 'percentage',
//     discountValue: '',
//     products: [],
//   });

//   const [showFilters, setShowFilters] = useState(true);

//   const [availableProducts] = useState([
//     { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics' },
//     { id: 2, name: 'Product 2', price: 149.99, category: 'Fashion' },
//     { id: 3, name: 'Product 3', price: 199.99, category: 'Home' },
//     // ... other products
//   ]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSaleEvent(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleProductToggle = (product) => {
//     setSaleEvent(prev => {
//       const isSelected = prev.products.some(p => p.id === product.id);
      
//       if (isSelected) {
//         return {
//           ...prev,
//           products: prev.products.filter(p => p.id !== product.id)
//         };
//       } else {
//         const calculatedPrice = prev.discountType === 'percentage' 
//           ? product.price * (1 - (Number(prev.discountValue) / 100))
//           : product.price - Number(prev.discountValue);

//         const productWithDiscount = {
//           ...product,
//           originalPrice: product.price,
//           discountedPrice: Math.max(0, calculatedPrice).toFixed(2)
//         };

//         return {
//           ...prev,
//           products: [...prev.products, productWithDiscount]
//         };
//       }
//     });
//   };

//   useEffect(() => {
//     if (saleEvent.products.length > 0 && (saleEvent.discountType || saleEvent.discountValue)) {
//       setSaleEvent(prev => ({
//         ...prev,
//         products: prev.products.map(product => {
//           const calculatedPrice = prev.discountType === 'percentage'
//             ? product.originalPrice * (1 - (Number(prev.discountValue) / 100))
//             : product.originalPrice - Number(prev.discountValue);

//           return {
//             ...product,
//             discountedPrice: Math.max(0, calculatedPrice).toFixed(2)
//           };
//         })
//       }));
//     }
//   }, [saleEvent.discountType, saleEvent.discountValue]);

//   const handlePublish = () => {
//     console.log('Publishing new sale event:', saleEvent);
//   };

//   const handleSave = () => {
//     console.log('Saving draft sale event:', saleEvent);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <div className="relative bg-gray-50 flex flex-col pt-5">
//         {/* Header */}
//         <div className="px-4 md:px-8 lg:px-12 mb-6">
//           <h1 className="text-[#603F26] text-2xl md:text-3xl font-bold">
//             Create Sale Event
//           </h1>
//         </div>

//         {/* Stats and Filter Toggle */}
//         <div className="px-4 md:px-8 lg:px-12 flex flex-wrap justify-between items-center gap-4 mb-6">
//           <div className="w-full sm:w-auto bg-[#603F26] text-white p-4 rounded-lg">
//             <h2 className="text-3xl font-bold">
//               {String(saleEvent.products.length).padStart(2, '0')}
//             </h2>
//             <p className="text-sm">Selected Products</p>
//           </div>

//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="w-full sm:w-auto px-4 py-2 border-2 border-[#603F26] text-[#603F26] rounded-lg flex items-center justify-center gap-2 hover:bg-[#603F26] hover:text-white transition-colors"
//           >
//             <FilterListIcon />
//             {showFilters ? 'Hide Details' : 'Show Details'}
//           </button>
//         </div>

//         {/* Event Details Form */}
//         {showFilters && (
//           <div className="px-4 md:px-8 lg:px-12 mb-6">
//             <div className="bg-white p-6 rounded-lg shadow">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <TextField
//                   label="Event Name"
//                   name="name"
//                   value={saleEvent.name}
//                   onChange={handleInputChange}
//                   fullWidth
//                   color="primary"
//                 />
//                 <TextField
//                   label="Description"
//                   name="description"
//                   value={saleEvent.description}
//                   onChange={handleInputChange}
//                   multiline
//                   rows={4}
//                   fullWidth
//                   color="primary"
//                 />
//                 <TextField
//                   label="Start Date"
//                   type="date"
//                   name="startDate"
//                   value={saleEvent.startDate}
//                   onChange={handleInputChange}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   fullWidth
//                   color="primary"
//                 />
//                 <TextField
//                   label="End Date"
//                   type="date"
//                   name="endDate"
//                   value={saleEvent.endDate}
//                   onChange={handleInputChange}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   fullWidth
//                   color="primary"
//                 />
//                 <Select
//                   label="Discount Type"
//                   name="discountType"
//                   value={saleEvent.discountType}
//                   onChange={handleInputChange}
//                   fullWidth
//                   color="primary"
//                 >
//                   <MenuItem value="percentage">Percentage Off</MenuItem>
//                   <MenuItem value="fixed">Fixed Amount Off</MenuItem>
//                 </Select>
//                 <TextField
//                   label={saleEvent.discountType === 'percentage' ? 'Percentage Off' : 'Amount Off'}
//                   type="number"
//                   name="discountValue"
//                   value={saleEvent.discountValue}
//                   onChange={handleInputChange}
//                   fullWidth
//                   color="primary"
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Products Table - Desktop View */}
//         <div className="px-4 md:px-8 lg:px-12 hidden xl:block">
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <TableContainer component={Paper}>
//               <Table sx={{ minWidth: 650 }} aria-label="products table">
//                 <TableHead sx={{ backgroundColor: "#603F26" }}>
//                   <TableRow>
//                     <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
//                       Product Name
//                     </TableCell>
//                     <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
//                       Category
//                     </TableCell>
//                     <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }} align="right">
//                       Price
//                     </TableCell>
//                     <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }} align="right">
//                       Discounted Price
//                     </TableCell>
//                     <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }} align="center">
//                       Include in Sale
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {availableProducts.map((product) => {
//                     const isSelected = saleEvent.products.some(p => p.id === product.id);
//                     const selectedProduct = saleEvent.products.find(p => p.id === product.id);
                    
//                     return (
//                       <TableRow
//                         key={product.id}
//                         className={`hover:bg-gray-50 cursor-pointer ${
//                           isSelected ? 'bg-[#603F26]/10' : ''
//                         }`}
//                         onClick={() => handleProductToggle(product)}
//                       >
//                         <TableCell>{product.name}</TableCell>
//                         <TableCell>{product.category}</TableCell>
//                         <TableCell align="right">${product.price.toFixed(2)}</TableCell>
//                         <TableCell align="right">
//                           {isSelected ? `$${selectedProduct.discountedPrice}` : '-'}
//                         </TableCell>
//                         <TableCell align="center">
//                           <Checkbox
//                             checked={isSelected}
//                             onChange={() => {}}
//                             color="primary"
//                           />
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </div>
//         </div>

//         {/* Products Cards - Mobile View */}
//         <div className="px-4 md:px-8 lg:px-12 xl:hidden space-y-4">
//           {availableProducts.map((product) => {
//             const isSelected = saleEvent.products.some(p => p.id === product.id);
//             const selectedProduct = saleEvent.products.find(p => p.id === product.id);

//             return (
//               <div
//                 key={product.id}
//                 className={`bg-white p-4 rounded-lg shadow cursor-pointer ${
//                   isSelected ? 'bg-[#603F26]/10' : ''
//                 }`}
//                 onClick={() => handleProductToggle(product)}
//               >
//                 <div className="flex flex-col gap-2">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-bold text-lg">{product.name}</h3>
//                       <span className="inline-block px-2 py-1 bg-gray-100 text-sm rounded mt-1">
//                         {product.category}
//                       </span>
//                     </div>
//                     <Checkbox
//                       checked={isSelected}
//                       onChange={() => {}}
//                       color="primary"
//                     />
//                   </div>
//                   <div className="flex justify-between mt-2">
//                     <span>Original Price: ${product.price.toFixed(2)}</span>
//                     <span>
//                       Discounted: {isSelected ? `$${selectedProduct.discountedPrice}` : '-'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Action Buttons */}
//         <div className="px-4 md:px-8 lg:px-12 mt-6 mb-8 flex flex-col sm:flex-row gap-4 justify-end">
//           <button
//             onClick={handleSave}
//             className="w-full sm:w-auto px-6 py-2 border-2 border-[#603F26] text-[#603F26] rounded-lg flex items-center justify-center gap-2 hover:bg-[#603F26] hover:text-white transition-colors"
//           >
//             <SaveIcon />
//             Save Draft
//           </button>
//           <button
//             onClick={handlePublish}
//             disabled={!saleEvent.name || !saleEvent.startDate || !saleEvent.endDate || saleEvent.products.length === 0}
//             className="w-full sm:w-auto px-6 py-2 bg-[#603F26] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#4a3019] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//           >
//             <SendIcon />
//             Publish Event
//           </button>
//         </div>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default CreateSaleEvent;




import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TextField, Select, MenuItem, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Checkbox, ThemeProvider, createTheme } from '@mui/material';
import { Loader, showToast } from "../../../../tools";
import { createSaleEvent, getSalesProducts } from '../../../../store/actions/saleEvents';

// Define the theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const CreateSaleEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { salesProducts, isLoading } = useSelector((state) => state.saleEvents);

  const [saleEvent, setSaleEvent] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    discountType: 'percentage',
    discountValue: '',
    products: [],
  });

  const [showFilters, setShowFilters] = useState(true);

  // Fetch available products when component mounts
  useEffect(() => {
    const business = user?.business;
    dispatch(getSalesProducts(business))
      // .unwrap()
      // .then(response => {
      //   console.log("Available products loaded successfully");
      // })
      // .catch(error => {
      //   showToast("ERROR", "Failed to load available products");
      //   console.error("Failed to load available products:", error);
      // });
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductToggle = (product) => {
    setSaleEvent(prev => {
      const isSelected = prev.products.some(p => p._id === product._id);
      
      if (isSelected) {
        return {
          ...prev,
          products: prev.products.filter(p => p._id !== product._id)
        };
      } else {
        const calculatedPrice = prev.discountType === 'percentage' 
          ? product.price * (1 - (Number(prev.discountValue) / 100))
          : product.price - Number(prev.discountValue);

        const productWithDiscount = {
          ...product,
          originalPrice: product.price,
          discountedPrice: Math.max(0, calculatedPrice)
        };

        return {
          ...prev,
          products: [...prev.products, productWithDiscount]
        };
      }
    });
  };

  useEffect(() => {
    if (saleEvent.products.length > 0 && (saleEvent.discountType || saleEvent.discountValue)) {
      setSaleEvent(prev => ({
        ...prev,
        products: prev.products.map(product => {
          const calculatedPrice = prev.discountType === 'percentage'
            ? product.originalPrice * (1 - (Number(prev.discountValue) / 100))
            : product.originalPrice - Number(prev.discountValue);

          return {
            ...product,
            discountedPrice: Math.max(0, calculatedPrice)
          };
        })
      }));
    }
  }, [saleEvent.discountType, saleEvent.discountValue]);

  const handlePublish = () => {
    if (!validateForm()) return;

    const business = user?.business;
    const eventData = {
      ...saleEvent,
      businessId: business,
      status: 'Active'
    };

    dispatch(createSaleEvent(eventData))
      .unwrap()
      .then(() => {
        showToast("SUCCESS", "Sale event published successfully");
        // navigate("../saleEvents");
      })
      .catch(error => {
        showToast("ERROR", "Failed to publish sale event");
        console.error("Failed to publish sale event:", error);
      });
  };

  const handleSave = () => {
    const business = user?.business;
    const eventData = {
      ...saleEvent,
      business,
      status: 'Draft'
    };

    dispatch(saveDraftSaleEvent(eventData))
      .unwrap()
      .then(() => {
        showToast("SUCCESS", "Sale event saved as draft");
        navigate("../saleEvents");
      })
      .catch(error => {
        showToast("ERROR", "Failed to save draft");
        console.error("Failed to save draft:", error);
      });
  };

  const validateForm = () => {
    if (!saleEvent.name) {
      showToast("ERROR", "Event name is required");
      return false;
    }
    if (!saleEvent.startDate) {
      showToast("ERROR", "Start date is required");
      return false;
    }
    if (!saleEvent.endDate) {
      showToast("ERROR", "End date is required");
      return false;
    }
    if (saleEvent.products.length === 0) {
      showToast("ERROR", "At least one product must be selected");
      return false;
    }
    if (!saleEvent.discountValue) {
      showToast("ERROR", "Discount value is required");
      return false;
    }
    return true;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <div className="px-4 md:px-8 lg:px-12 mb-6">
          <h1 className="text-[#603F26] text-2xl md:text-3xl font-bold">
            Create Sale Event
          </h1>
        </div>

        {/* Stats and Filter Toggle */}
        <div className="px-4 md:px-8 lg:px-12 flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="w-full sm:w-auto bg-[#603F26] text-white p-4 rounded-lg">
            <h2 className="text-3xl font-bold">
              {String(saleEvent.products.length).padStart(2, '0')}
            </h2>
            <p className="text-sm">Selected Products</p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto px-4 py-2 border-2 border-[#603F26] text-[#603F26] rounded-lg flex items-center justify-center gap-2 hover:bg-[#603F26] hover:text-white transition-colors"
          >
            <FilterListIcon />
            {showFilters ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Event Details Form */}
        {showFilters && (
          <div className="px-4 md:px-8 lg:px-12 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Event Name"
                  name="name"
                  value={saleEvent.name}
                  onChange={handleInputChange}
                  fullWidth
                  color="primary"
                  required
                />
                <TextField
                  label="Description"
                  name="description"
                  value={saleEvent.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  fullWidth
                  color="primary"
                />
                <TextField
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={saleEvent.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  color="primary"
                  required
                />
                <TextField
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={saleEvent.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  color="primary"
                  required
                />
                <Select
                  label="Discount Type"
                  name="discountType"
                  value={saleEvent.discountType}
                  onChange={handleInputChange}
                  fullWidth
                  color="primary"
                >
                  <MenuItem value="percentage">Percentage Off</MenuItem>
                  <MenuItem value="fixed">Fixed Amount Off</MenuItem>
                </Select>
                <TextField
                  label={saleEvent.discountType === 'percentage' ? 'Percentage Off' : 'Amount Off'}
                  type="number"
                  name="discountValue"
                  value={saleEvent.discountValue}
                  onChange={handleInputChange}
                  fullWidth
                  color="primary"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Products Table - Desktop View */}
        <div className="px-4 md:px-8 lg:px-12 hidden xl:block">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="products table">
                <TableHead sx={{ backgroundColor: "#603F26" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
                      Product Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }} align="right">
                      Price
                    </TableCell>
                    <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }} align="right">
                      Discounted Price
                    </TableCell>
                    <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }} align="center">
                      Include in Sale
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesProducts && salesProducts.map((product) => {
                    const isSelected = saleEvent.products.some(p => p._id === product?._id);
                    const selectedProduct = saleEvent.products.find(p => p._id === product?._id);
                    
                    return (

                      <TableRow
                        key={product?._id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          isSelected ? 'bg-[#603F26]/10' : ''
                        }`}
                        onClick={() => handleProductToggle(product)}
                      >
                        <TableCell>{product?.title}</TableCell>
                        <TableCell>{product?.category}</TableCell>
                        <TableCell align="right">${product?.price.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          {isSelected ? `$${selectedProduct.discountedPrice}` : '-'}
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => {}}
                            color="primary"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        {/* Products Cards - Mobile View */}
        <div className="px-4 md:px-8 lg:px-12 xl:hidden space-y-4">
          {salesProducts && salesProducts.map((product) => {
            const isSelected = saleEvent.products.some(p => p._id === product?._id);
            const selectedProduct = saleEvent.products.find(p => p._id === product?._id);

            return (
              <div
                key={product?._id}
                className={`bg-white p-4 rounded-lg shadow cursor-pointer ${
                  isSelected ? 'bg-[#603F26]/10' : ''
                }`}
                onClick={() => handleProductToggle(product)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{product?.title}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-sm rounded mt-1">
                        {product?.category}
                      </span>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {}}
                      color="primary"
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Original Price: ${product?.price?.toFixed(2)}</span>
                    <span>
                      Discounted: {isSelected ? `$${selectedProduct.discountedPrice}` : '-'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="px-4 md:px-8 lg:px-12 mt-6 mb-8 flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2 border-2 border-[#603F26] text-[#603F26] rounded-lg flex items-center justify-center gap-2 hover:bg-[#603F26] hover:text-white transition-colors"
          >
            <SaveIcon />
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={!saleEvent.name || !saleEvent.startDate || !saleEvent.endDate || saleEvent.products.length === 0}
            className="w-full sm:w-auto px-6 py-2 bg-[#603F26] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#4a3019] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <SendIcon />
            Publish Event
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default CreateSaleEvent;