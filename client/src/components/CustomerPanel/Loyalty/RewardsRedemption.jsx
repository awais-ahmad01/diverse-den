// components/RewardsRedemption.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// Dummy data
const dummyRewards = [
  {
    id: 1,
    name: '10% Off Your Next Order',
    description: 'Get 10% discount on your next purchase',
    pointsCost: 500,
    type: 'discount',
    discountAmount: 10,
    discountType: 'percentage'
  },
  {
    id: 2,
    name: 'Free Shipping',
    description: 'Free standard shipping on your next order',
    pointsCost: 300,
    type: 'shipping',
    discountAmount: 100,
    discountType: 'fixed'
  },
  {
    id: 3,
    name: 'Free Product - Coffee Mug',
    description: 'Get our premium coffee mug for free',
    pointsCost: 800,
    type: 'product',
    productId: 'prod_mug_001',
    stock: 15
  },
  {
    id: 4,
    name: '20% Off Sitewide',
    description: '20% discount on your entire order',
    pointsCost: 1000,
    type: 'discount',
    discountAmount: 20,
    discountType: 'percentage'
  },
  {
    id: 5,
    name: 'Free Product - T-Shirt',
    description: 'Get our exclusive brand t-shirt',
    pointsCost: 1200,
    type: 'product',
    productId: 'prod_tshirt_001',
    stock: 8
  }
];

export const RewardsRedemption = () => {
  const [rewards] = useState(dummyRewards);
  const [selectedReward, setSelectedReward] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // User's available points from dummy data
  const userPoints = 1250;

  const handleRedeem = () => {
    // Simulate redemption
    console.log(`Redeemed ${quantity} ${selectedReward.name} for ${selectedReward.pointsCost * quantity} points`);
    setOpenDialog(false);
    
    // In a real app, you would call your API here
    // and then update the UI accordingly
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Redeem Your Points</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <Typography variant="h6" className="mb-2">
          Your Available Points: <span className="font-bold">{userPoints}</span>
        </Typography>
        <Typography variant="body2">
          Points expire on December 31, 2023
        </Typography>
      </div>
      
      <Grid container spacing={3}>
        {rewards.map((reward) => (
          <Grid item xs={12} sm={6} md={4} key={reward.id}>
            <Card className="h-full flex flex-col">
              <CardContent className="flex-grow">
                <Typography variant="h6" className="mb-2">
                  {reward.name}
                </Typography>
                <Typography variant="body2" className="mb-3">
                  {reward.description}
                </Typography>
                <div className="mt-auto">
                  <Typography variant="h6" className="text-primary mb-2">
                    {reward.pointsCost} points
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={userPoints < reward.pointsCost}
                    onClick={() => {
                      setSelectedReward(reward);
                      setQuantity(1);
                      setOpenDialog(true);
                    }}
                  >
                    Redeem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Redeem {selectedReward?.name}</DialogTitle>
        <DialogContent>
          <Typography className="mb-4">
            You are about to redeem <strong>{selectedReward?.name}</strong> for {selectedReward?.pointsCost} points.
          </Typography>
          
          {selectedReward?.type === 'discount' && (
            <Typography>
              This will give you a {selectedReward?.discountAmount}% discount on your next purchase.
            </Typography>
          )}
          
          {selectedReward?.type === 'shipping' && (
            <Typography>
              This will give you free standard shipping on your next order.
            </Typography>
          )}
          
          {selectedReward?.type === 'product' && (
            <div>
              <Typography className="mb-2">
                Quantity:
              </Typography>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: selectedReward?.stock }}
              />
              {selectedReward?.stock && (
                <Typography variant="caption" className="ml-2">
                  {selectedReward.stock} available
                </Typography>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleRedeem}
            disabled={userPoints < (selectedReward?.pointsCost * quantity)}
          >
            Confirm Redemption
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};