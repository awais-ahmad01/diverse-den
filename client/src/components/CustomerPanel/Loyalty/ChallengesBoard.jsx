// components/ChallengesBoard.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Chip, LinearProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

export const ChallengesBoard = ({ challenges }) => {
  const [activeTab, setActiveTab] = useState('daily');
  const [localChallenges, setLocalChallenges] = useState(challenges);

  const handleCompleteChallenge = (challengeId) => {
    // Simulate completing a challenge
    setLocalChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, isCompleted: true, progress: { ...challenge.progress, current: challenge.progress.target } }
          : challenge
      )
    );
    
    // In a real app, you would call your API here
    console.log(`Challenge ${challengeId} completed!`);
  };

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" component="h2">
            Earn More Points
          </Typography>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === 'daily' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => setActiveTab('daily')}
            >
              Daily Missions
            </Button>
            <Button 
              variant={activeTab === 'achievements' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </Button>
          </div>
        </div>
        
        <Grid container spacing={3}>
          {localChallenges
            .filter(challenge => 
              (activeTab === 'daily' && challenge.isDaily) || 
              (activeTab === 'achievements' && !challenge.isDaily)
            )
            .map((challenge) => (
              <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                <Card variant="outlined">
                  <CardContent>
                    <div className="flex justify-between items-start mb-2">
                      <Typography variant="h6">{challenge.name}</Typography>
                      <Chip 
                        label={`+${challenge.pointsReward}`} 
                        color="primary" 
                        size="small"
                      />
                    </div>
                    
                    <Typography variant="body2" className="mb-3">
                      {challenge.description}
                    </Typography>
                    
                    {challenge.progress && (
                      <div className="mb-3">
                        <LinearProgress 
                          variant="determinate" 
                          value={(challenge.progress.current / challenge.progress.target) * 100} 
                          className="mb-1"
                        />
                        <Typography variant="caption">
                          {challenge.progress.current} of {challenge.progress.target}
                        </Typography>
                      </div>
                    )}
                    
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={challenge.isCompleted ? <CheckCircle /> : null}
                      disabled={challenge.isCompleted}
                      onClick={() => handleCompleteChallenge(challenge.id)}
                    >
                      {challenge.isCompleted ? 'Completed' : 'Start'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </CardContent>
    </Card>
  );
};