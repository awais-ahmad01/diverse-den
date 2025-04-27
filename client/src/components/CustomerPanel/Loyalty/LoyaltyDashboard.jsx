// components/LoyaltyDashboard.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material';
import { PointHistory } from './PointsHistory';
import { ChallengesBoard } from './ChallengesBoard';

// Dummy data
const dummyPointsData = {
  available: 1250,
  lifetime: 3850,
  nextLevel: 2000,
  progress: 62.5
};

const dummyTransactions = [
  {
    id: 1,
    date: new Date('2023-05-15'),
    description: 'Purchase #ORD-45678',
    points: 250
  },
  {
    id: 2,
    date: new Date('2023-05-10'),
    description: 'Daily login bonus',
    points: 10
  },
  {
    id: 3,
    date: new Date('2023-05-08'),
    description: 'Completed "First Purchase" challenge',
    points: 500
  },
  {
    id: 4,
    date: new Date('2023-05-05'),
    description: 'Purchase #ORD-45670',
    points: 350
  },
  {
    id: 5,
    date: new Date('2023-05-01'),
    description: 'Account signup bonus',
    points: 100
  }
];

const dummyChallenges = [
  {
    id: 1,
    name: 'Daily Login',
    description: 'Log in to your account today',
    pointsReward: 10,
    isDaily: true,
    isCompleted: true,
    progress: { current: 1, target: 1 }
  },
  {
    id: 2,
    name: 'Weekend Shopper',
    description: 'Make a purchase on Saturday or Sunday',
    pointsReward: 50,
    isDaily: false,
    isCompleted: false,
    progress: { current: 0, target: 1 }
  },
  {
    id: 3,
    name: 'First Purchase',
    description: 'Complete your first purchase',
    pointsReward: 500,
    isDaily: false,
    isCompleted: true,
    progress: { current: 1, target: 1 }
  },
  {
    id: 4,
    name: 'Product Explorer',
    description: 'View 5 different product details',
    pointsReward: 30,
    isDaily: true,
    isCompleted: false,
    progress: { current: 2, target: 5 }
  },
  {
    id: 5,
    name: 'Social Butterfly',
    description: 'Share a product on social media',
    pointsReward: 25,
    isDaily: false,
    isCompleted: false,
    progress: { current: 0, target: 1 }
  },
  {
    id: 6,
    name: 'Loyal Customer',
    description: 'Make 5 purchases this month',
    pointsReward: 200,
    isDaily: false,
    isCompleted: false,
    progress: { current: 2, target: 5 }
  }
];

export const LoyaltyDashboard = () => {
  const [pointsData] = useState(dummyPointsData);
  const [transactions] = useState(dummyTransactions);
  const [challenges] = useState(dummyChallenges);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Loyalty Perks</h1>
      
      {/* Points Summary Card */}
      <Card className="mb-6">
        <CardContent>
          <Typography variant="h5" component="h2" className="mb-4">
            Your Points Summary
          </Typography>
          <div className="flex justify-between mb-2">
            <span>Available Points:</span>
            <span className="font-bold">{pointsData.available}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Lifetime Points:</span>
            <span className="font-bold">{pointsData.lifetime}</span>
          </div>
          
          <Typography variant="subtitle1" className="mb-2">
            Progress to next reward tier
          </Typography>
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" value={pointsData.progress} />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">{`${Math.round(
                pointsData.progress,
              )}%`}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Points History */}
      <PointHistory transactions={transactions} />
      
      {/* Challenges Board */}
      <ChallengesBoard challenges={challenges} />
    </div>
  );
};