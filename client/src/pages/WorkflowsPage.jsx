import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import {
  fetchWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  executeWorkflow,
} from '../services/api';

function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'document-processing',
    triggerType: 'manual',
    actions: '',
  });

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWorkflows();
      setWorkflows(data);
    } catch (err) {
      setError(err.message || 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (workflow = null) => {
    if (workflow) {
      setEditingWorkflow(workflow);
      setFormData({
        name: workflow.name,
        description: workflow.description || '',
        type: workflow.type,
        triggerType: workflow.triggerType,
        actions: workflow.actions?.join(', ') || '',
      });
    } else {
      setEditingWorkflow(null);
      setFormData({
        name: '',
        description: '',
        type: 'document-processing',
        triggerType: 'manual',
        actions: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingWorkflow(null);
  };

  const handleSubmit = async () => {
    try {
      const workflowData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        triggerType: formData.triggerType,
        actions: formData.actions.split(',').map(a => a.trim()).filter(a => a),
      };

      if (editingWorkflow) {
        await updateWorkflow(editingWorkflow.id, workflowData);
      } else {
        await createWorkflow(workflowData);
      }

      handleCloseDialog();
      loadWorkflows();
    } catch (err) {
      setError(err.message || 'Failed to save workflow');
    }
  };

  const handleDelete = async (workflowId) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    
    try {
      await deleteWorkflow(workflowId);
      loadWorkflows();
    } catch (err) {
      setError(err.message || 'Failed to delete workflow');
    }
  };

  const handleExecute = async (workflowId) => {
    try {
      await executeWorkflow(workflowId);
      loadWorkflows();
    } catch (err) {
      setError(err.message || 'Failed to execute workflow');
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Workflows
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Workflow
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : workflows.length === 0 ? (
        <Box textAlign="center" py={4}>
          <WorkIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No workflows found. Create your first workflow above.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
          </Typography>
          <Grid container spacing={3}>
            {workflows.map((workflow) => (
              <Grid item xs={12} sm={6} md={4} key={workflow.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Typography variant="h6" gutterBottom>
                        {workflow.name}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(workflow)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(workflow.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {workflow.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {workflow.description}
                      </Typography>
                    )}
                    
                    <Typography variant="body2" color="text.secondary">
                      Type: {workflow.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trigger: {workflow.triggerType}
                    </Typography>
                    
                    {workflow.lastRun && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Last run: {new Date(workflow.lastRun).toLocaleString()}
                      </Typography>
                    )}
                    
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={workflow.status}
                        color={getStatusColor(workflow.status)}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleExecute(workflow.id)}
                    >
                      Execute
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Workflow Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="document-processing">Document Processing</MenuItem>
            <MenuItem value="data-extraction">Data Extraction</MenuItem>
            <MenuItem value="approval">Approval</MenuItem>
            <MenuItem value="notification">Notification</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Trigger Type"
            fullWidth
            select
            value={formData.triggerType}
            onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
          >
            <MenuItem value="manual">Manual</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="event">Event-based</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Actions (comma-separated)"
            fullWidth
            placeholder="ocr, extract, notify"
            value={formData.actions}
            onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || !formData.type}
          >
            {editingWorkflow ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default WorkflowsPage;
