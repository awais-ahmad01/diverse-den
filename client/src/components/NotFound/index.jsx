import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a theme with your primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#603F26',
    },
  },
});

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          p: 3,
          backgroundColor: '#f5f5f5', // Light gray background
        }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: '6rem', 
            fontWeight: 'bold', 
            mb: 2,
            color: '#603F26' // Using your color for the 404 text
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          color="primary" // This will now use #603F26 from the theme
          size="large"
          onClick={() => navigate('/')}
          sx={{
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            '&:hover': {
              backgroundColor: '#4a3120', // Darker shade for hover
            }
          }}
        >
          Go to Homepage
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default NotFound;