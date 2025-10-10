import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import HelpIcon from '@material-ui/icons/Help';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    maxWidth: 1200,
    margin: '0 auto',
  },
  stepperContainer: {
    backgroundColor: 'white',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  visualContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    backgroundColor: '#f8f9fa',
    borderRadius: theme.spacing(2),
    border: '3px solid #e0e0e0',
    position: 'relative',
    overflow: 'hidden',
  },
  instructionCard: {
    padding: theme.spacing(3),
    backgroundColor: '#ffffff',
    border: '2px solid #e3f2fd',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  tipCard: {
    padding: theme.spacing(2),
    backgroundColor: '#fff3e0',
    border: '2px solid #ff9800',
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  warningCard: {
    padding: theme.spacing(2),
    backgroundColor: '#ffebee',
    border: '2px solid #f44336',
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  actionButton: {
    fontSize: '1.1rem',
    padding: theme.spacing(1.5, 3),
    margin: theme.spacing(1),
    borderRadius: theme.spacing(3),
    minWidth: 120,
  },
  progressContainer: {
    marginBottom: theme.spacing(3),
  },
  measurementPoint: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#f44336',
    border: '3px solid white',
    cursor: 'pointer',
    animation: '$pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)',
    },
    '70%': {
      transform: 'scale(1.1)',
      boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)',
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)',
    },
  },
  floatingHelp: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
  },
  completedStep: {
    backgroundColor: '#e8f5e8',
    border: '2px solid #4caf50',
  },
  currentStep: {
    backgroundColor: '#e3f2fd',
    border: '2px solid #2196f3',
  },
  largeText: {
    fontSize: '1.3rem',
    lineHeight: 1.6,
    fontWeight: 500,
  },
  extraLargeText: {
    fontSize: '1.5rem',
    lineHeight: 1.8,
    fontWeight: 'bold',
  },
}));

const InteractiveMeasurementGuide = ({ onMeasurementComplete }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showHelp, setShowHelp] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [measurements, setMeasurements] = useState({});

  const measurementSteps = [
    {
      label: "Get Ready",
      title: "Prepare for Measuring",
      icon: "🏃‍♀️",
      color: "#e8f5e8",
      instructions: [
        "Stand up straight against a wall",
        "Wear fitted clothing or underwear",
        "Get a flexible measuring tape",
        "Ask someone to help you measure"
      ],
      tips: [
        "Remove bulky clothing for accurate measurements",
        "Stand with feet together",
        "Keep your arms relaxed at your sides"
      ],
      warnings: [
        "Don't measure over thick clothing",
        "Don't hold your breath while measuring"
      ],
      visual: PrepareVisual,
      audioText: "First, let's get ready to take measurements. Stand up straight, wear fitted clothes, and get a measuring tape."
    },
    {
      label: "Neck",
      title: "Measure Your Neck",
      icon: "👔",
      color: "#ffebee",
      instructions: [
        "Wrap the tape around your neck",
        "Place it where a shirt collar would sit",
        "Keep the tape snug but not tight",
        "You should be able to fit one finger under the tape"
      ],
      tips: [
        "Look straight ahead while measuring",
        "The tape should be level all around",
        "This measurement is for shirt collar size"
      ],
      warnings: [
        "Don't pull the tape too tight",
        "Don't measure over a thick necklace"
      ],
      visual: NeckMeasurementVisual,
      audioText: "Now let's measure your neck. Wrap the tape where a shirt collar sits. Keep it snug but comfortable."
    },
    {
      label: "Chest/Bust",
      title: "Measure Your Chest",
      icon: "🫁",
      color: "#e8f5e8",
      instructions: [
        "Wrap the tape around the fullest part of your chest",
        "Keep the tape level across your back",
        "Breathe normally - don't hold your breath",
        "The tape should be snug but not tight"
      ],
      tips: [
        "For women: measure over a well-fitting bra",
        "Keep your arms slightly away from your body",
        "Make sure the tape doesn't slip down"
      ],
      warnings: [
        "Don't compress your chest",
        "Don't lift your arms while measuring"
      ],
      visual: ChestMeasurementVisual,
      audioText: "Let's measure your chest at the fullest part. Keep the tape level and breathe normally."
    },
    {
      label: "Waist",
      title: "Measure Your Waist",
      icon: "⭕",
      color: "#e3f2fd",
      instructions: [
        "Find your natural waistline",
        "Bend to one side to locate the crease",
        "Wrap the tape around this narrowest point",
        "Keep the tape parallel to the floor"
      ],
      tips: [
        "Your natural waist is usually 1-2 inches above your belly button",
        "Don't suck in your stomach",
        "The tape should rest comfortably on your skin"
      ],
      warnings: [
        "Don't measure at your hip bones",
        "Don't pull the tape too tight"
      ],
      visual: WaistMeasurementVisual,
      audioText: "Now find your natural waist - the narrowest part of your torso. Wrap the tape around this point."
    },
    {
      label: "Hips",
      title: "Measure Your Hips",
      icon: "🍑",
      color: "#fff3e0",
      instructions: [
        "Find the fullest part of your hips",
        "This is usually 7-9 inches below your waist",
        "Wrap the tape around this widest point",
        "Keep your feet together"
      ],
      tips: [
        "Include your buttocks in the measurement",
        "Make sure the tape is level all around",
        "Stand with your weight evenly distributed"
      ],
      warnings: [
        "Don't measure at your waist",
        "Don't let the tape sag in the back"
      ],
      visual: HipMeasurementVisual,
      audioText: "Finally, let's measure your hips at the fullest part. Keep your feet together and the tape level."
    }
  ];

  const currentStep = measurementSteps[activeStep];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      
      utterance.onend = () => setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (activeStep < measurementSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleStepComplete = () => {
    setCompletedSteps(new Set([...completedSteps, activeStep]));
    if (activeStep < measurementSteps.length - 1) {
      handleNext();
    }
  };

  const progress = ((completedSteps.size) / measurementSteps.length) * 100;

  const VisualComponent = currentStep.visual;

  return (
    <Box className={classes.root}>
      {/* Progress indicator */}
      <Box className={classes.progressContainer}>
        <Typography variant="h6" gutterBottom>
          Progress: {completedSteps.size} of {measurementSteps.length} steps completed
        </Typography>
        <LinearProgress variant="determinate" value={progress} style={{ height: 8, borderRadius: 4 }} />
      </Box>

      {/* Main content */}
      <Grid container spacing={3}>
        {/* Instructions panel */}
        <Grid item xs={12} md={6}>
          <Card className={`${classes.instructionCard} ${completedSteps.has(activeStep) ? classes.completedStep : classes.currentStep}`}>
            <CardContent>
              <Box display="flex" alignItems="center" marginBottom={2}>
                <Typography variant="h3" style={{ marginRight: 16 }}>
                  {currentStep.icon}
                </Typography>
                <Box>
                  <Typography variant="h4" color="primary">
                    Step {activeStep + 1}: {currentStep.title}
                  </Typography>
                  {completedSteps.has(activeStep) && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Completed"
                      color="primary"
                      size="small"
                    />
                  )}
                </Box>
              </Box>

              <Typography variant="h5" gutterBottom color="textSecondary">
                Instructions:
              </Typography>
              
              {currentStep.instructions.map((instruction, index) => (
                <Box key={index} display="flex" alignItems="flex-start" marginBottom={1}>
                  <Typography variant="h6" style={{ marginRight: 8, color: '#1976d2' }}>
                    {index + 1}.
                  </Typography>
                  <Typography className={classes.largeText}>
                    {instruction}
                  </Typography>
                </Box>
              ))}

              {/* Tips */}
              <Box className={classes.tipCard}>
                <Box display="flex" alignItems="center" marginBottom={1}>
                  <InfoIcon style={{ color: '#ff9800', marginRight: 8 }} />
                  <Typography variant="h6" style={{ color: '#ff9800' }}>
                    Helpful Tips:
                  </Typography>
                </Box>
                {currentStep.tips.map((tip, index) => (
                  <Typography key={index} className={classes.largeText} style={{ marginBottom: 4 }}>
                    • {tip}
                  </Typography>
                ))}
              </Box>

              {/* Warnings */}
              <Box className={classes.warningCard}>
                <Box display="flex" alignItems="center" marginBottom={1}>
                  <WarningIcon style={{ color: '#f44336', marginRight: 8 }} />
                  <Typography variant="h6" style={{ color: '#f44336' }}>
                    Important:
                  </Typography>
                </Box>
                {currentStep.warnings.map((warning, index) => (
                  <Typography key={index} className={classes.largeText} style={{ marginBottom: 4 }}>
                    • {warning}
                  </Typography>
                ))}
              </Box>

              {/* Action buttons */}
              <Box marginTop={3} display="flex" justifyContent="space-between" flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<VolumeUpIcon />}
                  onClick={() => speakText(currentStep.audioText)}
                  className={classes.actionButton}
                  disabled={isPlaying}
                >
                  🔊 Listen
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStepComplete}
                  className={classes.actionButton}
                  startIcon={<CheckCircleIcon />}
                >
                  ✅ Done
                </Button>
              </Box>

              <Box marginTop={2} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className={classes.actionButton}
                >
                  ⬅️ Back
                </Button>
                
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  disabled={activeStep === measurementSteps.length - 1}
                  className={classes.actionButton}
                >
                  Next ➡️
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Visual panel */}
        <Grid item xs={12} md={6}>
          <Card className={classes.instructionCard}>
            <CardContent>
              <Typography variant="h4" gutterBottom color="primary" align="center">
                Visual Guide
              </Typography>
              
              <Box className={classes.visualContainer}>
                <VisualComponent />
              </Box>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<VolumeUpIcon />}
                onClick={() => speakText("Look at the picture. The red line shows exactly where to place the measuring tape.")}
                className={classes.actionButton}
                style={{ marginTop: 16 }}
              >
                🔊 Explain Picture
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating help button */}
      <Fab
        color="secondary"
        className={classes.floatingHelp}
        onClick={() => setShowHelp(true)}
      >
        <HelpIcon />
      </Fab>

      {/* Help dialog */}
      <Dialog open={showHelp} onClose={() => setShowHelp(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h4">How to Use This Guide</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.largeText} paragraph>
            This interactive guide will help you take accurate body measurements:
          </Typography>
          
          <Typography className={classes.largeText} component="div">
            <strong>🔊 Audio Help:</strong> Click the "Listen" buttons to hear instructions read aloud
            <br /><br />
            <strong>📱 Visual Guide:</strong> Look at the pictures to see exactly where to measure
            <br /><br />
            <strong>✅ Step by Step:</strong> Complete each step before moving to the next
            <br /><br />
            <strong>💡 Tips:</strong> Read the helpful tips for better accuracy
            <br /><br />
            <strong>⚠️ Warnings:</strong> Pay attention to important reminders
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelp(false)} color="primary" variant="contained">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Enhanced visual components with better accessibility
const PrepareVisual = () => (
  <svg width="300" height="350" viewBox="0 0 300 350">
    {/* Background */}
    <rect width="300" height="350" fill="#f8f9fa" />
    
    {/* Person standing straight */}
    <g transform="translate(150, 50)">
      <circle cx="0" cy="0" r="25" fill="#ffdbcb" stroke="#333" strokeWidth="2" />
      <rect x="-25" y="25" width="50" height="80" fill="#4caf50" rx="15" stroke="#333" strokeWidth="2" />
      <rect x="-30" y="105" width="60" height="70" fill="#2196f3" rx="8" stroke="#333" strokeWidth="2" />
      <rect x="-15" y="175" width="12" height="90" fill="#4caf50" rx="6" stroke="#333" strokeWidth="2" />
      <rect x="3" y="175" width="12" height="90" fill="#4caf50" rx="6" stroke="#333" strokeWidth="2" />
    </g>
    
    {/* Measuring tape */}
    <rect x="50" y="150" width="80" height="12" fill="#ff9800" rx="6" stroke="#333" strokeWidth="1" />
    <text x="90" y="140" fontSize="14" fill="#333" textAnchor="middle" fontWeight="bold">Measuring Tape</text>
    
    {/* Helper person */}
    <g transform="translate(230, 120)">
      <circle cx="0" cy="0" r="20" fill="#ffdbcb" stroke="#333" strokeWidth="2" />
      <rect x="-15" y="20" width="30" height="60" fill="#9c27b0" rx="10" stroke="#333" strokeWidth="2" />
      <text x="0" y="100" fontSize="12" fill="#333" textAnchor="middle" fontWeight="bold">Helper</text>
    </g>
    
    {/* Instructions */}
    <text x="150" y="320" fontSize="16" fill="#333" textAnchor="middle" fontWeight="bold">
      Stand Straight • Get Help • Use Measuring Tape
    </text>
  </svg>
);

const NeckMeasurementVisual = () => (
  <svg width="300" height="350" viewBox="0 0 300 350">
    <rect width="300" height="350" fill="#f8f9fa" />
    
    {/* Person outline */}
    <g transform="translate(150, 100)">
      <circle cx="0" cy="0" r="40" fill="#ffdbcb" stroke="#333" strokeWidth="3" />
      <rect x="-35" y="40" width="70" height="120" fill="#e3f2fd" stroke="#333" strokeWidth="3" rx="15" />
    </g>
    
    {/* Neck measurement line - very prominent */}
    <ellipse cx="150" cy="140" rx="45" ry="20" fill="none" stroke="#f44336" strokeWidth="8" strokeDasharray="12,6" />
    
    {/* Animated measurement points */}
    <circle cx="105" cy="140" r="8" fill="#f44336" className="measurementPoint" />
    <circle cx="195" cy="140" r="8" fill="#f44336" className="measurementPoint" />
    
    {/* Large arrows */}
    <path d="M70 140 L95 140" stroke="#f44336" strokeWidth="6" markerEnd="url(#arrow)" />
    <path d="M230 140 L205 140" stroke="#f44336" strokeWidth="6" markerEnd="url(#arrow)" />
    
    {/* Labels */}
    <text x="150" y="50" fontSize="24" fill="#f44336" textAnchor="middle" fontWeight="bold">NECK</text>
    <text x="150" y="300" fontSize="18" fill="#333" textAnchor="middle" fontWeight="bold">
      Measure where collar sits
    </text>
    
    <defs>
      <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
        <path d="M0,0 L0,8 L10,4 z" fill="#f44336" />
      </marker>
    </defs>
  </svg>
);

const ChestMeasurementVisual = () => (
  <svg width="300" height="350" viewBox="0 0 300 350">
    <rect width="300" height="350" fill="#f8f9fa" />
    
    {/* Person outline */}
    <g transform="translate(150, 80)">
      <circle cx="0" cy="0" r="30" fill="#ffdbcb" stroke="#333" strokeWidth="3" />
      <rect x="-45" y="30" width="90" height="140" fill="#e8f5e8" stroke="#333" strokeWidth="3" rx="20" />
    </g>
    
    {/* Chest measurement line */}
    <ellipse cx="150" cy="150" rx="60" ry="30" fill="none" stroke="#4caf50" strokeWidth="8" strokeDasharray="12,6" />
    
    {/* Measurement points */}
    <circle cx="90" cy="150" r="8" fill="#4caf50" className="measurementPoint" />
    <circle cx="210" cy="150" r="8" fill="#4caf50" className="measurementPoint" />
    
    {/* Arrows */}
    <path d="M50 150 L80 150" stroke="#4caf50" strokeWidth="6" markerEnd="url(#arrow2)" />
    <path d="M250 150 L220 150" stroke="#4caf50" strokeWidth="6" markerEnd="url(#arrow2)" />
    
    {/* Labels */}
    <text x="150" y="40" fontSize="24" fill="#4caf50" textAnchor="middle" fontWeight="bold">CHEST</text>
    <text x="150" y="300" fontSize="18" fill="#333" textAnchor="middle" fontWeight="bold">
      Fullest part of chest
    </text>
    
    <defs>
      <marker id="arrow2" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
        <path d="M0,0 L0,8 L10,4 z" fill="#4caf50" />
      </marker>
    </defs>
  </svg>
);

const WaistMeasurementVisual = () => (
  <svg width="300" height="350" viewBox="0 0 300 350">
    <rect width="300" height="350" fill="#f8f9fa" />
    
    {/* Person outline with waist curve */}
    <g transform="translate(150, 70)">
      <circle cx="0" cy="0" r="25" fill="#ffdbcb" stroke="#333" strokeWidth="3" />
      <path d="M-40 25 L-40 80 L-30 120 L-35 160 L-50 200 L50 200 L35 160 L30 120 L40 80 L40 25 Z" 
            fill="#e3f2fd" stroke="#333" strokeWidth="3" />
    </g>
    
    {/* Waist measurement line */}
    <ellipse cx="150" cy="190" rx="45" ry="22" fill="none" stroke="#2196f3" strokeWidth="8" strokeDasharray="12,6" />
    
    {/* Measurement points */}
    <circle cx="105" cy="190" r="8" fill="#2196f3" className="measurementPoint" />
    <circle cx="195" cy="190" r="8" fill="#2196f3" className="measurementPoint" />
    
    {/* Arrows */}
    <path d="M60 190 L95 190" stroke="#2196f3" strokeWidth="6" markerEnd="url(#arrow3)" />
    <path d="M240 190 L205 190" stroke="#2196f3" strokeWidth="6" markerEnd="url(#arrow3)" />
    
    {/* Labels */}
    <text x="150" y="40" fontSize="24" fill="#2196f3" textAnchor="middle" fontWeight="bold">WAIST</text>
    <text x="150" y="320" fontSize="18" fill="#333" textAnchor="middle" fontWeight="bold">
      Narrowest part of torso
    </text>
    
    <defs>
      <marker id="arrow3" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
        <path d="M0,0 L0,8 L10,4 z" fill="#2196f3" />
      </marker>
    </defs>
  </svg>
);

const HipMeasurementVisual = () => (
  <svg width="300" height="350" viewBox="0 0 300 350">
    <rect width="300" height="350" fill="#f8f9fa" />
    
    {/* Person outline with hip curve */}
    <g transform="translate(150, 60)">
      <circle cx="0" cy="0" r="22" fill="#ffdbcb" stroke="#333" strokeWidth="3" />
      <path d="M-35 22 L-35 70 L-30 110 L-25 150 L-30 190 L-60 230 L60 230 L30 190 L25 150 L30 110 L35 70 L35 22 Z" 
            fill="#fff3e0" stroke="#333" strokeWidth="3" />
    </g>
    
    {/* Hip measurement line */}
    <ellipse cx="150" cy="220" rx="70" ry="28" fill="none" stroke="#ff9800" strokeWidth="8" strokeDasharray="12,6" />
    
    {/* Measurement points */}
    <circle cx="80" cy="220" r="8" fill="#ff9800" className="measurementPoint" />
    <circle cx="220" cy="220" r="8" fill="#ff9800" className="measurementPoint" />
    
    {/* Arrows */}
    <path d="M40 220 L70 220" stroke="#ff9800" strokeWidth="6" markerEnd="url(#arrow4)" />
    <path d="M260 220 L230 220" stroke="#ff9800" strokeWidth="6" markerEnd="url(#arrow4)" />
    
    {/* Labels */}
    <text x="150" y="35" fontSize="24" fill="#ff9800" textAnchor="middle" fontWeight="bold">HIPS</text>
    <text x="150" y="320" fontSize="18" fill="#333" textAnchor="middle" fontWeight="bold">
      Fullest part of hips
    </text>
    
    <defs>
      <marker id="arrow4" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
        <path d="M0,0 L0,8 L10,4 z" fill="#ff9800" />
      </marker>
    </defs>
  </svg>
);

export default InteractiveMeasurementGuide;