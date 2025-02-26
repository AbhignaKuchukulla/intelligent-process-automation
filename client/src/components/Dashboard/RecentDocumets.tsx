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
  Chip,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  date: string;
}

interface RecentDocumentsProps {
  documents: Document[];
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents }) => {
  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "default" => {
    switch (status) {
      case "Processed":
        return "success";
      case "Processing":
        return "warning";
      case "Failed":
        return "error";
      default:
        return "info"; // Handles any unknown statuses
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Recent Documents</Typography>
          <Link href="/documents" passHref>
            <Typography color="primary" sx={{ cursor: "pointer" }}>
              View All →
            </Typography>
          </Link>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
                      <InsertDriveFileIcon color="disabled" fontSize="large" />
                      <Typography variant="body1" color="textSecondary">
                        No documents found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
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
