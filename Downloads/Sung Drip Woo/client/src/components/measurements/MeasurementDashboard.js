import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Rule as RuleIcon,
  Straighten as StraightenIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import EnhancedMeasurementForm from './EnhancedMeasurementForm';
import MeasurementDisplay from './MeasurementDisplay';
import MeasurementValidator from './MeasurementValidator';

const MeasurementDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [measurementToDelete, setMeasurementToDelete] = useState(null);
  const [validationResults, setValidationResults] = useState({});

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/measurements');
      setMeasurements(res.data);
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError('Failed to load measurements');
      // For demo purposes, use mock data if API fails
      setMeasurements([
        {
          id: 1,
          name: 'My Default Measurements',
          neck: 15.5,
          bust: 38,
          waist: 32,
          hip: 40,
          shoulder: 17,
          sleeve: 24,
          inseam: 32,
          outseam: 42,
          thigh: 22,
          calf: 15,
          height: 68,
          weight: 150,
          isDefault: true,
          measurementType: 'self',
          measurementDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          notes: 'Measured at home with measuring tape'
        },
        {
          id: 2,
          name: 'Professional Fitting',
          neck: 15.75,
          bust: 38.5,
          waist: 31.5,
          hip: 40.5,
          shoulder: 17.25,
          sleeve: 24.5,
          inseam: 32,
          outseam: 42.5,
          thigh: 22.5,
          calf: 15.25,
          height: 68,
          weight: 148,
          isDefault: false,
          measurementType: 'professional',
          measurementDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Measured by tailor for formal suit'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (measurementId) => {
    navigate(`/dashboard/measurements/edit/${measurementId}`);
  };

  const handleDelete = async (measurementId) => {
    try {
      await axios.delete(`/api/measurements/${measurementId}`);
      setMeasurements(measurements.filter(m => m.id !== measurementId));
      setDeleteDialogOpen(false);
      setMeasurementToDelete(null);
    } catch (err) {
      console.error('Error deleting measurement:', err);
      // For demo purposes, just remove from local state
      setMeasurements(measurements.filter(m => m.id !== measurementId));
      setDeleteDialogOpen(false);
      setMeasurementToDelete(null);
    }
  };

  const confirmDelete = (measurementId) => {
    setMeasurementToDelete(measurementId);
    setDeleteDialogOpen(true);
  };

  const handleValidationComplete = (results) => {
    setValidationResults(results);
  };

  const getOverallValidationStatus = () => {
    const results = Object.values(validationResults);
    if (results.length === 0) return null;
    
    const hasErrors = results.some(r => r.overall === 'invalid');
    const hasWarnings = results.some(r => r.overall === 'warning');
    
    if (hasErrors) return 'error';
    if (hasWarnings) return 'warning';
    return 'success';
  };

  const getValidationSummary = () => {
    const results = Object.values(validationResults);
    if (results.length === 0) return null;
    
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    
    return { totalIssues, totalWarnings, avgScore: Math.round(avgScore) };
  };

  const DashboardOverview = () => {
    const validationSummary = getValidationSummary();
    const defaultMeasurement = measurements.find(m => m.isDefault);
    
    return (
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {measurements.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Measurement Sets
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <StraightenIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" color="success.main">
                    {defaultMeasurement ? '1' : '0'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Default Set
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {validationSummary && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AnalyticsIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="h4" color="info.main">
                        {validationSummary.avgScore}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Avg. Accuracy
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <RuleIcon sx={{ 
                        fontSize: 40, 
                        color: validationSummary.totalIssues > 0 ? 'error.main' : 'success.main', 
                        mb: 1 
                      }} />
                      <Typography variant="h4" color={validationSummary.totalIssues > 0 ? 'error.main' : 'success.main'}>
                        {validationSummary.totalIssues}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Issues Found
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddForm(true)}
                  fullWidth
                >
                  Add New Measurements
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RuleIcon />}
                  onClick={() => setActiveTab(2)}
                  fullWidth
                  disabled={measurements.length === 0}
                >
                  Validate Measurements
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TrendingUpIcon />}
                  onClick={() => setActiveTab(1)}
                  fullWidth
                  disabled={measurements.length === 0}
                >
                  View & Compare
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/measurements/interactive-guide')}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  📏 Interactive Guide
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/measurements/simple-instructions')}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  📖 Simple Instructions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Default Measurement Preview */}
        {defaultMeasurement && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Default Measurements: {defaultMeasurement.name}
                  </Typography>
                  <Chip label="Default" color="primary" />
                </Box>
                <Grid container spacing={2}>
                  {['bust', 'waist', 'hip', 'height'].map(field => (
                    <Grid item xs={6} sm={3} key={field}>
                      <Typography variant="body2" color="textSecondary">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Typography>
                      <Typography variant="h6">
                        {defaultMeasurement[field] ? 
                          `${defaultMeasurement[field]}"` : 
                          'Not set'
                        }
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Validation Status */}
        {validationSummary && (
          <Grid item xs={12}>
            <Alert 
              severity={getOverallValidationStatus()} 
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">
                  Measurement Validation Status
                </Typography>
                <Typography variant="body2">
                  Average accuracy: {validationSummary.avgScore}% | 
                  Issues: {validationSummary.totalIssues} | 
                  Warnings: {validationSummary.totalWarnings}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={validationSummary.avgScore}
                color={getOverallValidationStatus()}
                sx={{ width: 100, ml: 2 }}
              />
            </Alert>
          </Grid>
        )}
      </Grid>
    );
  };

  const tabContent = [
    <DashboardOverview key="overview" />,
    <MeasurementDisplay 
      key="display"
      measurements={measurements}
      onEdit={handleEdit}
      onDelete={confirmDelete}
    />,
    <MeasurementValidator 
      key="validator"
      measurements={measurements}
      onValidationComplete={handleValidationComplete}
    />
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <LinearProgress sx={{ width: 300 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <StraightenIcon sx={{ mr: 2, fontSize: 36 }} />
          Measurement Center
        </Typography>
      </Box>

      {error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {error} - Using demo data for preview
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab 
            icon={<AssessmentIcon />} 
            label="Overview" 
            iconPosition="start"
          />
          <Tab 
            icon={<TrendingUpIcon />} 
            label="View & Compare" 
            iconPosition="start"
          />
          <Tab 
            icon={<RuleIcon />} 
            label="Validation" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {tabContent[activeTab]}
      </Box>

      {/* Floating Action Button */}
      <Tooltip title="Add New Measurements">
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setShowAddForm(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Add Measurement Dialog */}
      <Dialog 
        open={showAddForm} 
        onClose={() => setShowAddForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Measurements</DialogTitle>
        <DialogContent>
          <EnhancedMeasurementForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddForm(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this measurement set? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleDelete(measurementToDelete)} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeasurementDashboard;