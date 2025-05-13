import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Box, Typography, Paper, CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const PendingApproval = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth);
  const { user, isauthenticated } = userData || {};

  console.log('user',user);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

 useEffect(() => {
    if(isauthenticated){
        if(user.role === 'Rider'){
          if(user?.isApproved && user?.status === 'Approved'){
             return navigate('/riderPanel/riderDashboard')
          }
        
          if(user?.isDetailsAdded && user?.status === 'Rejected'){
            return navigate('/riderPanel/rejectionPage')
          }
        }
      }
 }, [isauthenticated, user, navigate])





  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          padding: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 600,
            padding: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 3,
            }}
          >
            <DeliveryDiningIcon
              color="primary"
              sx={{ fontSize: 80, opacity: 0.8 }}
            />
          </Box>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Application Under Review
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "24px 0",
            }}
          >
            <CircularProgress color="primary" size={60} thickness={4} />
          </Box>

          <Typography variant="h6" gutterBottom sx={{ color: "#555" }}>
          Hello{user?.firstname ? ` ${user?.firstname} ${user?.lastname}` : ""}!
          </Typography>

          <Typography variant="body1" paragraph sx={{ marginBottom: 3 }}>
            Your rider application has been submitted successfully and is currently under review by our team.
            This process typically takes 24-48 hours to complete.
          </Typography>

          <Box
            sx={{
              background: "#f8f4e9",
              padding: 3,
              borderRadius: 2,
              marginBottom: 3,
              border: "1px solid #eadec2",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 1,
                color: "#603F26",
              }}
            >
              <AccessTimeIcon sx={{ marginRight: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                What happens next?
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ textAlign: "left" }}>
              <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                <li>Our team will verify your submitted documents and information</li>
                <li>You will receive an email notification once a decision has been made</li>
                <li>If approved, you can start accepting delivery requests immediately</li>
                <li>If rejected, you'll receive feedback on why and how to reapply</li>
              </ul>
            </Typography>
          </Box>

          <Typography variant="body2" paragraph color="textSecondary">
            You can check back here anytime to see your application status.
            If you have any questions, please contact our support team.
          </Typography>

          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/signin")}
            sx={{
              textTransform: "none",
              marginTop: 2,
              width: "180px",
            }}
          >
            Back to Home
          </Button> */}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default PendingApproval;