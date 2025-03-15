import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Icon for the button

interface Workflow {
  id: string;
  name: string;
  type: string;
  status: string;
  lastRun: string;
  nextRun: string;
}

interface ActiveWorkflowsProps {
  workflows: Workflow[];
}

const ActiveWorkflows: React.FC<ActiveWorkflowsProps> = ({ workflows }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleCreateWorkflow = () => {
    // Add logic to navigate to a workflow creation page or open a modal
    console.log('Create Workflow clicked');
    // Example: router.push('/workflows/create');
  };

  return (
    <Box>
      {/* Create Workflow Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateWorkflow}
        >
          Create Workflow
        </Button>
      </Box>

      {/* Workflows Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Run</TableCell>
              <TableCell>Next Run</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workflows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No active workflows found.
                </TableCell>
              </TableRow>
            ) : (
              workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell>{workflow.name}</TableCell>
                  <TableCell>{workflow.type}</TableCell>
                  <TableCell>
                    <Chip label={workflow.status} color={getStatusColor(workflow.status)} size="small" />
                  </TableCell>
                  <TableCell>{workflow.lastRun}</TableCell>
                  <TableCell>{workflow.nextRun}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ActiveWorkflows;