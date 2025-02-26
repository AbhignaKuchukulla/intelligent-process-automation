import React from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

interface Workflow {
  id: string;
  name: string;
  type: string;
  lastRun: string;
  nextRun: string;
}

interface ActiveWorkflowsProps {
  workflows: Workflow[];
}

const ActiveWorkflows: React.FC<ActiveWorkflowsProps> = ({ workflows }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Active Workflows</Typography>
          <Link href="/workflows" passHref>
            <Typography color="primary" sx={{ cursor: "pointer" }}>
              View All →
            </Typography>
          </Link>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Last Run</TableCell>
                <TableCell>Next Run</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workflows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No active workflows
                  </TableCell>
                </TableRow>
              ) : (
                workflows.map((workflow) => (
                  <TableRow key={workflow.id} hover>
                    <TableCell>{workflow.name}</TableCell>
                    <TableCell>{workflow.type}</TableCell>
                    <TableCell>{workflow.lastRun}</TableCell>
                    <TableCell>{workflow.nextRun}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ActiveWorkflows;
