import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import DocumentViewPage from './pages/DocumentViewPage';
import WorkflowsPage from './pages/WorkflowsPage';

function App() {
  return (
    <Box>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/:id" element={<DocumentViewPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
