"use client";

import React from "react";
import NextLink from "next/link";
import MuiLink from "@mui/material/Link";
import { useRouter } from "next/navigation"; // App Router client navigation
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
  Chip,
  Button,
  type ChipProps,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'processed' | 'processing' | 'failed' | 'pending';
  date: string;
}

interface RecentDocumentsProps {
  documents: Document[];
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents }) => {
  const router = useRouter(); // App Router client router

  // Log documents for debugging
  console.log("Documents:", documents);

  // Check for duplicate IDs
  const checkForDuplicateIds = (documents: Document[]) => {
    const ids = documents.map((doc) => doc.id);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      console.error("Duplicate IDs found in documents array!");
      console.log(
        "Duplicate IDs:",
        ids.filter((id, index) => ids.indexOf(id) !== index)
      );
    }
  };

  checkForDuplicateIds(documents);

  // Handle missing or duplicate IDs by generating unique keys
  const documentsWithUniqueIds = documents.map((doc, index) => ({
    ...doc,
    id: doc.id || `doc-${index}`, // Use existing ID or generate a unique one
  }));

  // Status color mapping with type safety
  const STATUS_COLORS: Record<Document['status'], ChipProps['color']> = {
    processed: 'success',
    processing: 'warning',
    failed: 'error',
    pending: 'info'
  };

  const getStatusColor = (status: Document['status']): ChipProps['color'] => {
    switch (status) {
      case "processed":
        return "success";
      case "processing":
        return "warning";
      case "failed":
        return "error";
      case "pending":
      default:
        return "info";
    }
  };

  // Handle view document action
  const handleViewDocument = (documentId: string) => {
    if (!documentId) {
      console.error("Document ID is undefined!");
      return;
    }
    router.push(`/documents/view/${documentId}`);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Recent Documents</Typography>
          <MuiLink
            component={NextLink}
            href="/documents"
            color="primary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover': { textDecoration: 'none' }
            }}
          >
            <Typography>View All</Typography>
            <Typography component="span" sx={{ ml: 0.5 }}>→</Typography>
          </MuiLink>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ overflowX: "auto", mt: 2, borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentsWithUniqueIds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      p={3}
                    >
                      <InsertDriveFileIcon color="disabled" fontSize="large" />
                      <Typography variant="body1" color="textSecondary">
                        No documents found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                documentsWithUniqueIds.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={doc.status}
                        color={getStatusColor(doc.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDocument(doc.id)}
                      >
                        View
                      </Button>
                    </TableCell>
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

export default RecentDocuments;