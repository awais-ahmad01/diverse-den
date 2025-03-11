// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Button, Grid, Box, Container, Avatar } from '@mui/material';
// import { 
//   ShoppingBag, 
//   Store, 
//   Search, 
//   PersonOutline, 
//   Storefront, 
//   DeliveryDining, 
//   AdminPanelSettings,
//   ViewInAr,
//   CardGiftcard,
//   RecommendOutlined,
//   GetApp
// } from '@mui/icons-material';

// const LandingPage = () => {
//   // Navigation functions
//   const navigateToLogin = () => {
//     console.log("Navigating to login page");
//   };

//   const navigateToSignup = () => {
//     console.log("Navigating to signup page");
//   };

//   const navigateToProducts = () => {
//     console.log("Navigating to products page");

//   };

//   const navigateToLearnMore = () => {
//     document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
//   };

//   const navigateToPlayStore = () => {
//     console.log("Navigating to Google Play Store");
//     window.open("https://play.google.com/store/apps/details?id=com.diverseden.app", "_blank");
//   };

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', flexDirection: 'column' }}>
//       {/* Navigation Header */}
//       <div style={{ backgroundColor: '#603F26', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//         <Container maxWidth="lg">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               <ShoppingBag style={{ color: 'white', fontSize: 32 }} />
//               <h6 style={{ marginLeft: '16px', fontWeight: 'bold', color: 'white', fontSize: '1.25rem' }}>
//                 Diverse Den
//               </h6>
//             </div>
//             <div style={{ display: 'flex', gap: '16px' }}>
//               <Button variant="outlined" 
//             //   onClick={navigateToLogin} 
//             component={Link}
//             to="/signin"
//               sx={{ color: 'white', borderColor: 'white' }}>
//                 Login
//               </Button>
//               <Button variant="contained" 
//             //   onClick={navigateToSignup} 
//             component={Link}
//             to="signup"
//             sx={{ bgcolor: 'white', color: '#603F26', '&:hover': { bgcolor: '#f5f5f5' } }}>
//                 Sign Up
//               </Button>
//             </div>
//           </div>
//         </Container>
//       </div>

//       {/* Hero Section */}
//       <div style={{ flexGrow: 1, padding: '64px 0', backgroundImage: 'linear-gradient(to bottom right, #f5f7fa, #e5e9f0)', borderBottom: '1px solid #e0e0e0' }}>
//         <Container maxWidth="lg">
//           <Grid container spacing={4} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <div>
//                 <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '24px', fontSize: '2.75rem' }}>
//                   Your Complete E-Commerce Solution
//                 </h2>
//                 <h6 style={{ color: '#666', marginBottom: '32px', fontSize: '1.25rem' }}>
//                   Shop, manage, and grow your business with our multi-role platform for POS, web, and mobile.
//                 </h6>
//                 <div style={{ display: 'flex', gap: '16px' }}>
//                   <Button
//                     variant="contained"
//                     // onClick={navigateToProducts}
//                     component={Link}
//                     to="/customer"
//                     startIcon={<Search />}
//                     sx={{ 
//                       bgcolor: '#603F26', 
//                       '&:hover': { bgcolor: '#4e3420' },
//                       px: 3,
//                       py: 1.5
//                     }}
//                   >
//                     Browse Products
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     onClick={navigateToLearnMore}
//                     sx={{ 
//                       color: '#603F26', 
//                       borderColor: '#603F26',
//                       px: 3,
//                       py: 1.5
//                     }}
//                   >
//                     Learn More
//                   </Button>
//                 </div>
//               </div>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <div style={{ display: 'flex', justifyContent: 'center' }}>
//                 <img 
//                   style={{
//                     maxWidth: '100%',
//                     height: 'auto',
//                     borderRadius: '8px',
//                     boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//                   }}
//                   alt="E-commerce platform"
//                   src="/api/placeholder/600/400"
//                 />
//               </div>
//             </Grid>
//           </Grid>
//         </Container>
//       </div>

//       {/* User Roles Section */}
//       <div style={{ backgroundColor: 'white', padding: '64px 0' }}>
//         <Container maxWidth="lg">
//           <h4 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: '#333', fontSize: '2rem' }}>
//             A Platform For Everyone
//           </h4>
//           <p style={{ textAlign: 'center', marginBottom: '48px', color: '#666', maxWidth: 700, margin: '0 auto 48px' }}>
//             Our multi-user platform supports various roles with tailored interfaces and capabilities.
//           </p>
          
//           <Grid container spacing={4}>
//             {[
//               { 
//                 icon: <PersonOutline />, 
//                 title: 'Customers', 
//                 description: 'Shop products, track orders, interact with AR models, and earn loyalty rewards through DD Perks.', 
//                 action: 'Browse as Guest →',
//                 link: '/customer',
//                 color: 'primary'
//               },
//               { 
//                 icon: <Storefront />, 
//                 title: 'Branch Owners', 
//                 description: 'Manage branches, products, salespersons, and view analytics through centralized inventory.', 
//                 action: 'Register Branch →',
//                 link: '/signup',
//                 color: 'secondary'
//               },
//               { 
//                 icon: <Store />, 
//                 title: 'Salespersons', 
//                 description: 'Process orders, manage inventory, communicate with customers, and handle POS transactions.', 
//                 action: 'Login →',
//                 link: '/signin',
//                 color: 'success'
//               },
//               { 
//                 icon: <AdminPanelSettings />, 
//                 title: 'Super Admins', 
//                 description: 'Full platform control with business, subscription, and user management capabilities.', 
//                 action: 'Admin Login →',
//                 link: '/signin',
//                 color: 'info'
//               },
//               { 
//                 icon: <DeliveryDining />, 
//                 title: 'Riders', 
//                 description: 'Handle product deliveries and update order status in real-time for efficient delivery.', 
//                 action: 'Rider Signup →',
//                 link: '/signup',
//                 color: 'warning'
//               },
//             ].map((role, index) => (
//               <Grid item xs={12} sm={6} md={index === 4 ? 12 : 3} key={index}>
//                 <div
//                   style={{
//                     padding: '24px',
//                     textAlign: 'center',
//                     borderTop: '4px solid',
//                     borderColor: index === 0 ? '#603F26' : `${role.color}.main`,
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//                     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                     backgroundColor: 'white',
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
//                     e.currentTarget.style.transform = 'translateY(-5px)';
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
//                     e.currentTarget.style.transform = 'translateY(0)';
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
//                     <Avatar
//                       sx={{
//                         width: 56,
//                         height: 56,
//                         bgcolor: index === 0 ? '#e9d5c9' : `${role.color}.light`,
//                         color: index === 0 ? '#603F26' : `${role.color}.main`,
//                       }}
//                     >
//                       {role.icon}
//                     </Avatar>
//                   </div>
//                   <h6 style={{ fontWeight: 'bold', color: '#333', fontSize: '1.25rem' }}>
//                     {role.title}
//                   </h6>
//                   <p style={{ margin: '8px 0 16px', color: '#666', flexGrow: 1, fontSize: '0.875rem' }}>
//                     {role.description}
//                   </p>
//                   <Button
//                     variant="text"
//                     component={Link}
//                     to={`${role.link}`}
//                     sx={{ 
//                       color: index === 0 ? '#603F26' : `${role.color}.main`, 
//                       '&:hover': { 
//                         color: index === 0 ? '#4e3420' : `${role.color}.dark`,
//                         bgcolor: index === 0 ? '#f8f1ed' : `${role.color}.lighter` 
//                       },
//                       alignSelf: 'center'
//                     }}
//                   >
//                     {role.action}
//                   </Button>
//                 </div>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </div>

//       {/* Multi-Mode Operation */}
//       <div style={{ backgroundColor: '#f5f7fa', padding: '64px 0', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
//         <Container maxWidth="lg">
//           <div style={{ textAlign: 'center', marginBottom: '48px' }}>
//             <h4 style={{ fontWeight: 'bold', color: '#333', fontSize: '2rem' }}>
//               Three Ways to Operate
//             </h4>
//             <p style={{ marginTop: '16px', color: '#666', maxWidth: 700, margin: '16px auto 0' }}>
//               Our platform supports multiple operation modes as outlined in our project scope.
//             </p>
//           </div>
          
//           <Grid container spacing={4}>
//             {[
//               { 
//                 title: 'Point of Sale (POS)', 
//                 description: 'Streamline your in-store operations with our comprehensive POS system. Process transactions, manage inventory, print receipts, scan barcodes, and track sales in real-time. Includes offline mode, cash drawer integration, and multi-payment support.',
//                 image: '/api/placeholder/400/300'
//               },
//               { 
//                 title: 'E-commerce Web App', 
//                 description: 'Provide customers with a full-featured online shopping experience with product search, filtering, and secure payments.',
//                 image: '/api/placeholder/400/300'
//               },
//               { 
//                 title: 'Mobile Application', 
//                 description: 'Experience product modeling and AR visualization right from your phone. Browse products, place orders, and view items in your space with our advanced AR features. Download our app from the Google Play Store today!',
//                 image: '/api/placeholder/400/300',
//                 hasButton: true
//               },
//             ].map((mode, index) => (
//               <Grid item xs={12} md={4} key={index}>
//                 <div 
//                   style={{ 
//                     overflow: 'hidden',
//                     height: '100%',
//                     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//                     transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//                     backgroundColor: 'white',
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
//                     e.currentTarget.style.transform = 'translateY(-5px)';
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
//                     e.currentTarget.style.transform = 'translateY(0)';
//                   }}
//                 >
//                   <img
//                     src={mode.image}
//                     alt={mode.title}
//                     style={{ width: '100%', height: 200, objectFit: 'cover' }}
//                   />
//                   <div style={{ padding: '24px' }}>
//                     <h6 style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px', fontSize: '1.25rem' }}>
//                       {mode.title}
//                     </h6>
//                     <p style={{ color: '#666', fontSize: '0.875rem' }}>
//                       {mode.description}
//                     </p>
//                     {mode.hasButton && (
//                       <Button
//                         variant="contained"
//                         startIcon={<GetApp />}
//                         onClick={navigateToPlayStore}
//                         sx={{ 
//                           mt: 2, 
//                           bgcolor: '#603F26', 
//                           '&:hover': { bgcolor: '#4e3420' }
//                         }}
//                       >
//                         Download App
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </div>

//       {/* Features Section */}
//       <div style={{ backgroundColor: '#f9f9f9', padding: '64px 0' }} id="features">
//         <Container maxWidth="lg">
//           <div style={{ textAlign: 'center', marginBottom: '48px' }}>
//             <h4 style={{ fontWeight: 'bold', color: '#333', fontSize: '2rem' }}>
//               Key Features
//             </h4>
//             <p style={{ marginTop: '16px', color: '#666', maxWidth: 700, margin: '16px auto 0' }}>
//               Everything you need to manage your business and enhance the shopping experience.
//             </p>
//           </div>
          
//           <Grid container spacing={4}>
//             {[
//               { 
//                 icon: <ViewInAr fontSize="large" />, 
//                 title: 'AR Product Modeling', 
//                 description: 'View products in 3D and AR before purchasing. Upload, interact with, and share 3D models for all products. Available exclusively on our mobile app.',
//                 color: 'primary',
//                 hasButton: true
//               },
//               { 
//                 icon: <CardGiftcard fontSize="large" />, 
//                 title: 'DD Loyalty Perks', 
//                 description: 'Earn points with every purchase and redeem for discounts or gift cards. Complete challenges for bonus points.',
//                 color: 'secondary'
//               },
//               { 
//                 icon: <RecommendOutlined fontSize="large" />, 
//                 title: 'AI Recommendations', 
//                 description: 'Get personalized product suggestions based on your purchase history and preferences.',
//                 color: 'success'
//               },
//               { 
//                 icon: <Store fontSize="large" />, 
//                 title: 'Centralized Inventory', 
//                 description: 'Manage inventory across all branches from a single, unified system with real-time tracking.',
//                 color: 'info'
//               },
//               { 
//                 icon: <AdminPanelSettings fontSize="large" />, 
//                 title: 'Multi-Role System', 
//                 description: 'Tailored interfaces and permissions for Super Admins, Branch Owners, Salespersons, Customers, and Riders.',
//                 color: 'warning'
//               },
//               { 
//                 icon: <ShoppingBag fontSize="large" />, 
//                 title: 'Subscription Plans', 
//                 description: 'Choose from Silver, Gold, and Platinum subscription plans with renewal reminders and revenue tracking.',
//                 color: 'error'
//               },
//             ].map((feature, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <div 
//                   style={{ 
//                     padding: '24px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     height: '100%',
//                     transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//                     boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
//                     backgroundColor: 'white',
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
//                     e.currentTarget.style.transform = 'translateY(-5px)';
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
//                     e.currentTarget.style.transform = 'translateY(0)';
//                   }}
//                 >
//                   <div style={{ color: index === 0 ? '#603F26' : `${feature.color}.main`, marginBottom: '16px' }}>{feature.icon}</div>
//                   <h6 style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px', fontSize: '1.25rem' }}>
//                     {feature.title}
//                   </h6>
//                   <p style={{ color: '#666', flexGrow: 1, fontSize: '0.875rem' }}>
//                     {feature.description}
//                   </p>
//                   {feature.hasButton && (
//                     <Button
//                       variant="outlined"
//                       startIcon={<GetApp />}
//                       onClick={navigateToPlayStore}
//                       sx={{ 
//                         mt: 2, 
//                         color: '#603F26', 
//                         borderColor: '#603F26',
//                         '&:hover': { 
//                           borderColor: '#4e3420',
//                           bgcolor: 'rgba(96, 63, 38, 0.05)'
//                         }
//                       }}
//                     >
//                       Get Mobile App
//                     </Button>
//                   )}
//                 </div>
//               </Grid>
//             ))}
//           </Grid>
          
//           <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
//             <Button
//               variant="contained"
//               size="large"
//             //   onClick={navigateToSignup}
//             component={Link}
//             to="/signup"
//               sx={{ 
//                 bgcolor: '#603F26', 
//                 '&:hover': { bgcolor: '#4e3420' }, 
//                 px: 4,
//                 py: 1.5
//               }}
//             >
//               Get Started Today
//             </Button>
//           </div>
//         </Container>
//       </div>

     

//       {/* CTA Section */}
//       <div 
//         style={{ 
//           padding: '80px 24px',
//           textAlign: 'center',
//           backgroundImage: 'linear-gradient(to right, #603F26, #8B5A2B)',
//           color: 'white'
//         }}
//       >
//         <Container maxWidth="md">
//           <h3 style={{ fontWeight: 'bold', marginBottom: '16px', fontSize: '2.5rem' }}>
//             Ready to Transform Your Business?
//           </h3>
//           <h6 style={{ marginBottom: '32px', opacity: 0.9, fontSize: '1.25rem' }}>
//             Join businesses using Diverse Den to grow with our multi-role e-commerce platform.
//           </h6>
//           <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
//             <Button 
//               variant="contained" 
//               size="large"
//               sx={{ 
//                 bgcolor: 'white', 
//                 color: '#603F26',
//                 '&:hover': { 
//                   bgcolor: 'rgba(255,255,255,0.9)',
//                 },
//                 px: 4,
//                 py: 1.5
//               }}
//             //   onClick={navigateToSignup}
//             component={Link}
//             to="/signup"
//             >
//               Sign Up Now
//             </Button>
           
//           </div>
//         </Container>
//       </div>

//       {/* Footer */}
//       <div style={{ backgroundColor: 'white', padding: '32px 0', borderTop: '1px solid #e0e0e0' }}>
//         <Container maxWidth="lg">
//           <Grid container spacing={4}>
//             <Grid item xs={12} md={4}>
//               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
//                 <ShoppingBag sx={{ color: '#603F26', fontSize: 32 }} />
//                 <h6 style={{ marginLeft: '16px', fontWeight: 'bold', color: '#333', fontSize: '1.25rem' }}>
//                   Diverse Den
//                 </h6>
//               </div>
//               <p style={{ color: '#666', fontSize: '0.875rem' }}>
//                 Your complete e-commerce solution for POS, web, and mobile retail management.
//               </p>
//               <Button
//                 variant="contained"
//                 startIcon={<GetApp />}
//                 onClick={navigateToPlayStore}
//                 sx={{ 
//                   mt: 2, 
//                   bgcolor: '#603F26', 
//                   '&:hover': { bgcolor: '#4e3420' }
//                 }}
//               >
//                 Download Mobile App
//               </Button>
//             </Grid>
//           </Grid>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e0e0e0' }}>
//             <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>
//               &copy; 2025 Diverse Den. All rights reserved.
//             </p>
//             <div style={{ display: 'flex', gap: '16px' }}>
//               {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social, i) => (
//                 <p key={i} style={{ color: '#666', fontSize: '0.875rem', margin: 0, cursor: 'pointer' }}>
//                   {social}
//                 </p>
//               ))}
//             </div>
//           </div>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;




import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Box, Container, Avatar } from '@mui/material';
import { 
  ShoppingBag, 
  Store, 
  Search, 
  PersonOutline, 
  Storefront, 
  DeliveryDining, 
  AdminPanelSettings,
  ViewInAr,
  CardGiftcard,
  RecommendOutlined,
  GetApp
} from '@mui/icons-material';

const LandingPage = () => {
  // Navigation functions
  const navigateToLogin = () => {
    console.log("Navigating to login page");
  };

  const navigateToSignup = () => {
    console.log("Navigating to signup page");
  };

  const navigateToProducts = () => {
    console.log("Navigating to products page");

  };

  const navigateToLearnMore = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToPlayStore = () => {
    console.log("Navigating to Google Play Store");
    window.open("https://play.google.com/store/apps/details?id=com.diverseden.app", "_blank");
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <div style={{ backgroundColor: '#603F26', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Container maxWidth="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* <ShoppingBag style={{ color: 'white', fontSize: 32 }} /> */}
              <h6 style={{ marginLeft: '16px', fontWeight: 'bold', color: 'white', fontSize: '1.25rem' }}>
                Diverse Den
              </h6>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button variant="outlined" 
              component={Link}
              to="/signin"
              sx={{ color: 'white', borderColor: 'white' }}>
                Login
              </Button>
              <Button variant="contained" 
              component={Link}
              to="signup"
              sx={{ bgcolor: 'white', color: '#603F26', '&:hover': { bgcolor: '#f5f5f5' } }}>
                Sign Up
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <div style={{ flexGrow: 1, padding: '64px 0', backgroundImage: 'linear-gradient(to bottom right, #f5f7fa, #e5e9f0)', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <div>
                <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '24px', fontSize: '2.75rem' }}>
                  Your Complete E-Commerce Solution
                </h2>
                <h6 style={{ color: '#666', marginBottom: '32px', fontSize: '1.25rem' }}>
                  Shop, manage, and grow your business with our multi-role platform for POS, web, and mobile.
                </h6>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/customer"
                    startIcon={<Search />}
                    sx={{ 
                      bgcolor: '#603F26', 
                      '&:hover': { bgcolor: '#4e3420' },
                      px: 3,
                      py: 1.5
                    }}
                  >
                    Browse Products
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={navigateToLearnMore}
                    sx={{ 
                      color: '#603F26', 
                      borderColor: '#603F26',
                      px: 3,
                      py: 1.5
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img 
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                  alt="E-commerce platform showcasing multiple devices"
                  src="https://cdnjs.cloudflare.com/ajax/libs/placeholder-imgs/0.0.4/120x120.png"
                />
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* User Roles Section */}
      <div style={{ backgroundColor: 'white', padding: '64px 0' }}>
        <Container maxWidth="lg">
          <h4 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: '#333', fontSize: '2rem' }}>
            A Platform For Everyone
          </h4>
          <p style={{ textAlign: 'center', marginBottom: '48px', color: '#666', maxWidth: 700, margin: '0 auto 48px' }}>
            Our multi-user platform supports various roles with tailored interfaces and capabilities.
          </p>
          
          <Grid container spacing={4}>
            {[
              { 
                icon: <PersonOutline />, 
                title: 'Customers', 
                description: 'Shop products, track orders, interact with AR models, and earn loyalty rewards through DD Perks.', 
                action: 'Browse as Guest →',
                link: '/customer',
                color: 'primary'
              },
              { 
                icon: <Storefront />, 
                title: 'Branch Owners', 
                description: 'Manage branches, products, salespersons, and view analytics through centralized inventory.', 
                action: 'Register Branch →',
                link: '/signup',
                color: 'secondary'
              },
              { 
                icon: <Store />, 
                title: 'Salespersons', 
                description: 'Process orders, manage inventory, communicate with customers, and handle POS transactions.', 
                action: 'Login →',
                link: '/signin',
                color: 'success'
              },
              { 
                icon: <AdminPanelSettings />, 
                title: 'Super Admins', 
                description: 'Full platform control with business, subscription, and user management capabilities.', 
                action: 'Admin Login →',
                link: '/signin',
                color: 'info'
              },
              { 
                icon: <DeliveryDining />, 
                title: 'Riders', 
                description: 'Handle product deliveries and update order status in real-time for efficient delivery.', 
                action: 'Rider Signup →',
                link: '/signup',
                color: 'warning'
              },
            ].map((role, index) => (
              <Grid item xs={12} sm={6} md={index === 4 ? 12 : 3} key={index}>
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    borderTop: '4px solid',
                    borderColor: index === 0 ? '#603F26' : `${role.color}.main`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    backgroundColor: 'white',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: index === 0 ? '#e9d5c9' : `${role.color}.light`,
                        color: index === 0 ? '#603F26' : `${role.color}.main`,
                      }}
                    >
                      {role.icon}
                    </Avatar>
                  </div>
                  <h6 style={{ fontWeight: 'bold', color: '#333', fontSize: '1.25rem' }}>
                    {role.title}
                  </h6>
                  <p style={{ margin: '8px 0 16px', color: '#666', flexGrow: 1, fontSize: '0.875rem' }}>
                    {role.description}
                  </p>
                  <Button
                    variant="text"
                    component={Link}
                    to={`${role.link}`}
                    sx={{ 
                      color: index === 0 ? '#603F26' : `${role.color}.main`, 
                      '&:hover': { 
                        color: index === 0 ? '#4e3420' : `${role.color}.dark`,
                        bgcolor: index === 0 ? '#f8f1ed' : `${role.color}.lighter` 
                      },
                      alignSelf: 'center'
                    }}
                  >
                    {role.action}
                  </Button>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>

      {/* Multi-Mode Operation */}
      <div style={{ backgroundColor: '#f5f7fa', padding: '64px 0', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h4 style={{ fontWeight: 'bold', color: '#333', fontSize: '2rem' }}>
              Three Ways to Operate
            </h4>
            <p style={{ marginTop: '16px', color: '#666', maxWidth: 700, margin: '16px auto 0' }}>
              Our platform supports multiple operation modes as outlined in our project scope.
            </p>
          </div>
          
          <Grid container spacing={4}>
            {[
              { 
                title: 'Point of Sale (POS)', 
                description: 'Streamline your in-store operations with our comprehensive POS system. Process transactions, manage inventory, print receipts, scan barcodes, and track sales in real-time. Includes offline mode, cash drawer integration, and multi-payment support.',
                image: '/images/pos.jpeg'
              },
              { 
                title: 'E-commerce Web App', 
                description: 'Provide customers with a full-featured online shopping experience with product search, filtering, and secure payments.',
                image: '/images/web.jpeg'
              },
              { 
                title: 'Mobile Application', 
                description: 'Experience product modeling and AR visualization right from your phone. Browse products, place orders, and view items in your space with our advanced AR features. Download our app from the Google Play Store today!',
                image: '/images/mobile.jpeg',
                hasButton: true
              },
            ].map((mode, index) => (
              <Grid item xs={12} md={4} key={index}>
                <div 
                  style={{ 
                    overflow: 'hidden',
                    height: '100%',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    backgroundColor: 'white',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img
                    src={mode.image}
                    alt={mode.title}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                  <div style={{ padding: '24px' }}>
                    <h6 style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px', fontSize: '1.25rem' }}>
                      {mode.title}
                    </h6>
                    <p style={{ color: '#666', fontSize: '0.875rem' }}>
                      {mode.description}
                    </p>
                    {mode.hasButton && (
                      <Button
                        variant="contained"
                        startIcon={<GetApp />}
                        onClick={navigateToPlayStore}
                        sx={{ 
                          mt: 2, 
                          bgcolor: '#603F26', 
                          '&:hover': { bgcolor: '#4e3420' }
                        }}
                      >
                        Download App
                      </Button>
                    )}
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>

      {/* Features Section */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '64px 0' }} id="features">
        <Container maxWidth="lg">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h4 style={{ fontWeight: 'bold', color: '#333', fontSize: '2rem' }}>
              Key Features
            </h4>
            <p style={{ marginTop: '16px', color: '#666', maxWidth: 700, margin: '16px auto 0' }}>
              Everything you need to manage your business and enhance the shopping experience.
            </p>
          </div>
          
          <Grid container spacing={4}>
            {[
              { 
                icon: <ViewInAr fontSize="large" />, 
                title: 'AR Product Modeling', 
                description: 'View products in 3D and AR before purchasing. Upload, interact with, and share 3D models for all products. Available exclusively on our mobile app.',
                color: 'primary',
                hasButton: true
              },
              { 
                icon: <CardGiftcard fontSize="large" />, 
                title: 'DD Loyalty Perks', 
                description: 'Earn points with every purchase and redeem for discounts or gift cards. Complete challenges for bonus points.',
                color: 'secondary'
              },
              { 
                icon: <RecommendOutlined fontSize="large" />, 
                title: 'AI Recommendations', 
                description: 'Get personalized product suggestions based on your purchase history and preferences.',
                color: 'success'
              },
              { 
                icon: <Store fontSize="large" />, 
                title: 'Centralized Inventory', 
                description: 'Manage inventory across all branches from a single, unified system with real-time tracking.',
                color: 'info'
              },
              { 
                icon: <AdminPanelSettings fontSize="large" />, 
                title: 'Multi-Role System', 
                description: 'Tailored interfaces and permissions for Super Admins, Branch Owners, Salespersons, Customers, and Riders.',
                color: 'warning'
              },
              { 
                icon: <ShoppingBag fontSize="large" />, 
                title: 'Subscription Plans', 
                description: 'Choose from Silver, Gold, and Platinum subscription plans with renewal reminders and revenue tracking.',
                color: 'error'
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div 
                  style={{ 
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    backgroundColor: 'white',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ color: index === 0 ? '#603F26' : `${feature.color}.main`, marginBottom: '16px' }}>{feature.icon}</div>
                  <h6 style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px', fontSize: '1.25rem' }}>
                    {feature.title}
                  </h6>
                  <p style={{ color: '#666', flexGrow: 1, fontSize: '0.875rem' }}>
                    {feature.description}
                  </p>
                  {feature.hasButton && (
                    <Button
                      variant="outlined"
                      startIcon={<GetApp />}
                      onClick={navigateToPlayStore}
                      sx={{ 
                        mt: 2, 
                        color: '#603F26', 
                        borderColor: '#603F26',
                        '&:hover': { 
                          borderColor: '#4e3420',
                          bgcolor: 'rgba(96, 63, 38, 0.05)'
                        }
                      }}
                    >
                      Get Mobile App
                    </Button>
                  )}
                </div>
              </Grid>
            ))}
          </Grid>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/signup"
              sx={{ 
                bgcolor: '#603F26', 
                '&:hover': { bgcolor: '#4e3420' }, 
                px: 4,
                py: 1.5
              }}
            >
              Get Started Today
            </Button>
          </div>
        </Container>
      </div>

     

      {/* CTA Section */}
      <div 
        style={{ 
          padding: '80px 24px',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(to right, #603F26, #8B5A2B)',
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <h3 style={{ fontWeight: 'bold', marginBottom: '16px', fontSize: '2.5rem' }}>
            Ready to Transform Your Business?
          </h3>
          <h6 style={{ marginBottom: '32px', opacity: 0.9, fontSize: '1.25rem' }}>
            Join businesses using Diverse Den to grow with our multi-role e-commerce platform.
          </h6>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#603F26',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
                px: 4,
                py: 1.5
              }}
              component={Link}
              to="/signup"
            >
              Sign Up Now
            </Button>
           
          </div>
        </Container>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: 'white', padding: '32px 0', borderTop: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <ShoppingBag sx={{ color: '#603F26', fontSize: 32 }} />
                <h6 style={{ marginLeft: '16px', fontWeight: 'bold', color: '#333', fontSize: '1.25rem' }}>
                  Diverse Den
                </h6>
              </div>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>
                Your complete e-commerce solution for POS, web, and mobile retail management.
              </p>
              <Button
                variant="contained"
                startIcon={<GetApp />}
                onClick={navigateToPlayStore}
                sx={{ 
                  mt: 2, 
                  bgcolor: '#603F26', 
                  '&:hover': { bgcolor: '#4e3420' }
                }}
              >
                Download Mobile App
              </Button>
            </Grid>
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e0e0e0' }}>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>
              &copy; 2025 Diverse Den. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social, i) => (
                <p key={i} style={{ color: '#666', fontSize: '0.875rem', margin: 0, cursor: 'pointer' }}>
                  {social}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;