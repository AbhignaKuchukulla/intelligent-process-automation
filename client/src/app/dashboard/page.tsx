'use client';

import { Suspense } from 'react';
import { Container, Box, Grid, Paper, CircularProgress } from '@mui/material';
import DocumentUploader from '@/components/DocumentUploader';
import RecentDocuments from '@/components/Dashboard/RecentDocuments';
import ActiveWorkflows from '@/components/Dashboard/ActiveWorkflows';
import StatsCard from '@/components/Dashboard/Statscard';

const DashboardPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Documents Processed"
            value="128"
            trend="+12% vs last week"
            positive
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Workflows"
            value="24"
            trend="6 pending approval"
            neutral
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Success Rate"
            value="96.5%"
            trend="+2.3% this month"
            positive
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Processing Time"
            value="1.2s"
            trend="-0.3s improvement"
            positive
          />
        </Grid>

        {/* Document Upload Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', overflow: 'auto', flexDirection: 'column' }}>
            <DocumentUploader />
          </Paper>
        </Grid>

        {/* Recent Documents */}
        <Grid item xs={12} md={8}>
          <Suspense fallback={
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          }>
            <RecentDocuments documents={[]} />
          </Suspense>
        </Grid>

        {/* Active Workflows */}
        <Grid item xs={12} md={4}>
          <Suspense fallback={
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          }>
            <ActiveWorkflows workflows={[]} />
          </Suspense>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;