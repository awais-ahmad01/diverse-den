import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Box, Typography, Paper, Divider } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import ReplayIcon from '@mui/icons-material/Replay';

const RejectionPage = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth);
  const { user } = userData || {};

  
  console.log('user',user);
  
  // This would come from your API response or Redux store
  const rejectionReason = useSelector(
    (state) => state.rider?.rejectionReason || 
    "Some of your provided documents did not meet our requirements."
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
      error: {
        main: "#d32f2f",
      },
    },
  });

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
            <CancelIcon
              color="error"
              sx={{ fontSize: 80, opacity: 0.8 }}
            />
          </Box>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Application Not Approved
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ color: "#555" }}>
            Hello{user?.firstname ? ` ${user?.firstname} ${user?.lastname}` : ""}!
          </Typography>

          <Typography variant="body1" paragraph sx={{ marginBottom: 3 }}>
            Unfortunately, your rider application has not been approved at this time. 
            Don't worry though - you can address the issues and resubmit your application.
          </Typography>

          <Divider sx={{ margin: "16px 0" }} />

          <Box
            sx={{
              background: "#fef8f8",
              padding: 3,
              borderRadius: 2,
              marginBottom: 3,
              border: "1px solid #f5d6d6",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 2,
                color: "#d32f2f",
              }}
            >
              <InfoIcon sx={{ marginRight: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Reason for Rejection
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              {rejectionReason}
            </Typography>

            <Box
              sx={{
                background: "#fff",
                padding: 2,
                borderRadius: 1,
                border: "1px solid #eee",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Common reasons for rejection include:
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left" }}>
                <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
                  <li>Unclear or unreadable document images</li>
                  <li>Expired identification or registration documents</li>
                  <li>Inconsistent information across documents</li>
                  <li>Missing required documentation</li>
                  <li>Motorcycle documents not matching submission details</li>
                </ul>
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" paragraph>
            Please update your information and try again. If you need assistance, 
            our support team is always ready to help.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ReplayIcon />}
              onClick={() => navigate("/riderPanel/riderDetails")}
              sx={{
                textTransform: "none",
                marginTop: 2,
                width: "180px",
              }}
            >
              Update & Resubmit
            </Button>
            
            {/* <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                marginTop: 2,
                width: "180px",
              }}
            >
              Back to Dashboard
            </Button> */}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default RejectionPage;