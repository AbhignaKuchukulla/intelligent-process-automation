import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
  trend?: string;
  positive?: boolean;
  neutral?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color = '#1976d2', trend, positive, neutral = false }) => {
  return (
    <Card sx={(theme) => ({ borderTop: `4px solid ${color || theme.palette.primary.main}`, boxShadow: 2 })}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="body2"
                color={
                  neutral ? 'text.secondary' : positive ? 'success.main' : 'error.main'
                }
                sx={{ mt: 0.5 }}
              >
                {trend}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: color + "20",
              padding: "10px",
              borderRadius: "50%",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
