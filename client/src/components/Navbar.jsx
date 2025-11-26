import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';

function Navbar() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Intelligent Process Automation
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/dashboard"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/documents"
            startIcon={<DescriptionIcon />}
          >
            Documents
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/workflows"
            startIcon={<WorkIcon />}
          >
            Workflows
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
