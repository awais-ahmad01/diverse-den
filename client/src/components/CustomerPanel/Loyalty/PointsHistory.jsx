// components/PointHistory.jsx
import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export const PointHistory = ({ transactions }) => {
  return (
    <Card className="mb-6">
      <CardContent>
        <Typography variant="h5" component="h2" className="mb-4">
          Points History
        </Typography>
        
        {transactions.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right" className={transaction.points > 0 ? 'text-green-500' : 'text-red-500'}>
                    {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No point transactions yet.</Typography>
        )}
      </CardContent>
    </Card>
  );
};