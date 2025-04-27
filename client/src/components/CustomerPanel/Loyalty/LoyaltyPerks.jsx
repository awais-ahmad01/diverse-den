// src/pages/LoyaltyPerks.jsx
import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Button,
  Divider,
  Chip,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Star,
  History,
  EmojiEvents,
  Redeem,
  CheckCircle,
  DonutLarge,
} from '@mui/icons-material';

// Mock data for demonstration
const DUMMY_USER = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  points: 750,
  joinDate: "2023-09-15"
};

const DUMMY_HISTORY = [
  { id: 1, date: "2024-04-01", description: "Purchase - Order #1092", points: 120, type: "earned" },
  { id: 2, date: "2024-03-25", description: "Daily Login Streak (7 days)", points: 50, type: "earned" },
  { id: 3, date: "2024-03-20", description: "Redeemed for 15% Discount", points: -200, type: "redeemed" },
  { id: 4, date: "2024-03-18", description: "First Purchase Bonus", points: 100, type: "earned" },
  { id: 5, date: "2024-03-18", description: "Purchase - Order #1085", points: 75, type: "earned" },
  { id: 6, date: "2024-03-15", description: "Account Creation Bonus", points: 50, type: "earned" },
];

const DUMMY_DAILY_MISSIONS = [
  { id: 1, title: "Daily Login", description: "Log in to your account today", points: 10, completed: true },
  { id: 2, title: "Browse 5 Products", description: "View details of at least 5 different products", points: 15, completed: true },
  { id: 3, title: "Add to Cart", description: "Add a product to your shopping cart", points: 20, completed: false },
  { id: 4, title: "Leave a Review", description: "Write a review for a product you purchased", points: 30, completed: false },
  { id: 5, title: "Share a Product", description: "Share a product on social media", points: 25, completed: false },
];

const DUMMY_ACHIEVEMENTS = [
  { 
    id: 1, 
    title: "First Purchase", 
    description: "Complete your first purchase", 
    points: 100, 
    completed: true,
    progress: 100,
    target: 1
  },
  { 
    id: 2, 
    title: "Loyal Customer", 
    description: "Make 5 purchases", 
    points: 200, 
    completed: false,
    progress: 2,
    target: 5
  },
  { 
    id: 3, 
    title: "Big Spender", 
    description: "Spend a total of $500", 
    points: 250, 
    completed: false,
    progress: 320,
    target: 500 
  },
  { 
    id: 4, 
    title: "Product Explorer", 
    description: "View 50 different products", 
    points: 150, 
    completed: false,
    progress: 37,
    target: 50
  },
];

const DUMMY_REWARDS = [
  { id: 1, title: "10% Discount Coupon", description: "Get 10% off your next purchase", points: 200, type: "discount" },
  { id: 2, title: "15% Discount Coupon", description: "Get 15% off your next purchase", points: 350, type: "discount" },
  { id: 3, title: "Free Shipping", description: "Free shipping on your next order", points: 300, type: "discount" },
  { id: 4, title: "Premium T-Shirt", description: "Get a premium t-shirt for free", points: 700, type: "product", image: "https://via.placeholder.com/100" },
  { id: 5, title: "Designer Socks", description: "Get a pair of designer socks", points: 400, type: "product", image: "https://via.placeholder.com/100" },
];

const LoyaltyPerks = () => {
  const [tabValue, setTabValue] = useState(0);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openRedeemDialog = (reward) => {
    setSelectedReward(reward);
    setRedeemDialogOpen(true);
  };

  const handleRedeemConfirm = () => {
    setRedeemDialogOpen(false);
    setSuccessMessage(`You've successfully redeemed: ${selectedReward.title}`);
    setConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setConfirmationOpen(false);
  };

  // Calculate completed missions
  const completedMissions = DUMMY_DAILY_MISSIONS.filter(mission => mission.completed).length;
  
  // Calculate completed achievements
  const completedAchievements = DUMMY_ACHIEVEMENTS.filter(achievement => achievement.completed).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">DD Loyalty Perks</h1>
      
      {/* Points Summary Card */}
      <Paper elevation={3} className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Your Points Balance</h2>
            <div className="text-4xl font-bold my-3">{DUMMY_USER.points} points</div>
            <p className="text-sm opacity-80">Member since {new Date(DUMMY_USER.joinDate).toLocaleDateString()}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              startIcon={<Redeem />}
              onClick={() => setTabValue(3)}
              className="font-bold"
            >
              Redeem Points
            </Button>
          </div>
        </div>
      </Paper>

      {/* Tabs Navigation */}
      <Paper elevation={2} className="mb-8">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="loyalty perks tabs"
        >
          <Tab icon={<Star />} label="Dashboard" />
          <Tab icon={<History />} label="Points History" />
          <Tab icon={<EmojiEvents />} label="Challenges" />
          <Tab icon={<Redeem />} label="Redeem Points" />
        </Tabs>

        {/* Dashboard Tab */}
        {tabValue === 0 && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Loyalty Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Daily Missions Summary */}
              <Card>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Daily Missions</h3>
                    <Chip 
                      label={`${completedMissions}/${DUMMY_DAILY_MISSIONS.length} Completed`} 
                      color="primary" 
                      variant="outlined" 
                    />
                  </div>
                  <LinearProgress 
                    variant="determinate" 
                    value={(completedMissions / DUMMY_DAILY_MISSIONS.length) * 100} 
                    className="h-2 rounded-full mb-4"
                  />
                  <p className="text-gray-600">Complete today's missions to earn extra points!</p>
                </CardContent>
                <CardActions>
                  <Button onClick={() => setTabValue(2)} color="primary">View All Missions</Button>
                </CardActions>
              </Card>

              {/* Achievements Summary */}
              <Card>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Achievements</h3>
                    <Chip 
                      label={`${completedAchievements}/${DUMMY_ACHIEVEMENTS.length} Completed`} 
                      color="primary" 
                      variant="outlined" 
                    />
                  </div>
                  <LinearProgress 
                    variant="determinate" 
                    value={(completedAchievements / DUMMY_ACHIEVEMENTS.length) * 100} 
                    className="h-2 rounded-full mb-4"
                  />
                  <p className="text-gray-600">Unlock achievements through your shopping journey.</p>
                </CardContent>
                <CardActions>
                  <Button onClick={() => setTabValue(2)} color="primary">View All Achievements</Button>
                </CardActions>
              </Card>
            </div>

            {/* Recent Point Activity */}
            <h3 className="text-xl font-semibold mb-4">Recent Point Activity</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {DUMMY_HISTORY.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{item.description}</div>
                    <div className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-bold ${item.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.type === 'earned' ? '+' : ''}{item.points} pts
                  </div>
                </div>
              ))}
              <div className="mt-4 text-center">
                <Button onClick={() => setTabValue(1)} color="primary">View Full History</Button>
              </div>
            </div>
          </div>
        )}

        {/* Points History Tab */}
        {tabValue === 1 && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Points History</h2>
            <Paper className="overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex justify-between font-medium">
                <div className="w-1/4">Date</div>
                <div className="w-2/4">Description</div>
                <div className="w-1/4 text-right">Points</div>
              </div>
              {DUMMY_HISTORY.map((item) => (
                <div key={item.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
                  <div className="w-1/4 text-gray-600">{new Date(item.date).toLocaleDateString()}</div>
                  <div className="w-2/4">{item.description}</div>
                  <div className={`w-1/4 text-right font-bold ${item.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.type === 'earned' ? '+' : ''}{item.points} pts
                  </div>
                </div>
              ))}
            </Paper>
          </div>
        )}

        {/* Challenges Tab */}
        {tabValue === 2 && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Challenges & Missions</h2>
            
            {/* Daily Missions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Daily Missions
                <span className="ml-2 text-sm font-normal text-gray-500">Resets at midnight</span>
              </h3>
              <div className="space-y-4">
                {DUMMY_DAILY_MISSIONS.map((mission) => (
                  <Paper key={mission.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-4 ${mission.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {mission.completed ? (
                            <CheckCircle className="text-green-600" />
                          ) : (
                            <DonutLarge className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{mission.title}</h4>
                          <p className="text-sm text-gray-600">{mission.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">+{mission.points} pts</div>
                        {mission.completed ? (
                          <span className="text-sm text-green-600">Completed</span>
                        ) : (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="primary"
                            disabled={mission.completed}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </Paper>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DUMMY_ACHIEVEMENTS.map((achievement) => (
                  <Paper key={achievement.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <div className="font-bold text-purple-600">+{achievement.points} pts</div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{achievement.progress} / {achievement.target}</span>
                      <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={(achievement.progress / achievement.target) * 100} 
                      className="h-1 rounded-full"
                    />
                    
                    {achievement.completed && (
                      <div className="mt-3 flex items-center text-green-600 text-sm">
                        <CheckCircle fontSize="small" className="mr-1" />
                        <span>Completed</span>
                      </div>
                    )}
                  </Paper>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Redeem Points Tab */}
        {tabValue === 3 && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Redeem Your Points</h2>
              <div className="text-xl font-bold">
                Available: <span className="text-purple-600">{DUMMY_USER.points} points</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Discounts & Offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DUMMY_REWARDS.filter(reward => reward.type === "discount").map((reward) => (
                  <Card key={reward.id} className="h-full flex flex-col">
                    <CardContent className="flex-grow">
                      <h4 className="text-lg font-semibold mb-2">{reward.title}</h4>
                      <p className="text-gray-600 mb-4">{reward.description}</p>
                      <div className="font-bold text-purple-600">{reward.points} points</div>
                    </CardContent>
                    <CardActions>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="primary"
                        disabled={DUMMY_USER.points < reward.points}
                        onClick={() => openRedeemDialog(reward)}
                      >
                        Redeem
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Free Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DUMMY_REWARDS.filter(reward => reward.type === "product").map((reward) => (
                  <Card key={reward.id} className="h-full flex flex-col">
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      <img src={reward.image} alt={reward.title} className="max-h-full" />
                    </div>
                    <CardContent className="flex-grow">
                      <h4 className="text-lg font-semibold mb-2">{reward.title}</h4>
                      <p className="text-gray-600 mb-4">{reward.description}</p>
                      <div className="font-bold text-purple-600">{reward.points} points</div>
                    </CardContent>
                    <CardActions>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="primary"
                        disabled={DUMMY_USER.points < reward.points}
                        onClick={() => openRedeemDialog(reward)}
                      >
                        Redeem
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </Paper>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={redeemDialogOpen} onClose={() => setRedeemDialogOpen(false)}>
        <DialogTitle>Confirm Redemption</DialogTitle>
        <DialogContent>
          {selectedReward && (
            <div>
              <p className="mb-4">Are you sure you want to redeem <strong>{selectedReward.title}</strong>?</p>
              <p className="mb-4">This will deduct <strong>{selectedReward.points} points</strong> from your balance.</p>
              <p className="font-semibold">Your current balance: {DUMMY_USER.points} points</p>
              <p className="font-semibold">Balance after redemption: {DUMMY_USER.points - (selectedReward?.points || 0)} points</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRedeemDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRedeemConfirm} color="primary" variant="contained">
            Confirm Redemption
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={confirmationOpen} onClose={closeConfirmation}>
        <DialogTitle>Redemption Successful</DialogTitle>
        <DialogContent>
          <div className="text-center py-4">
            <CheckCircle fontSize="large" className="text-green-500 mb-4" />
            <p>{successMessage}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmation} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoyaltyPerks;