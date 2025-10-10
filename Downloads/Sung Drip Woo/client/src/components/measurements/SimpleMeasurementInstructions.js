import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import TranslateIcon from '@material-ui/icons/Translate';
import AccessibilityIcon from '@material-ui/icons/Accessibility';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    maxWidth: 800,
    margin: '0 auto',
  },
  instructionCard: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: '#f8f9fa',
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(2),
  },
  largeText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    lineHeight: 1.8,
    color: theme.palette.text.primary,
  },
  simpleText: {
    fontSize: '1.2rem',
    lineHeight: 1.6,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
  visualContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    backgroundColor: 'white',
    borderRadius: theme.spacing(1),
    border: '2px solid #e0e0e0',
    margin: theme.spacing(2, 0),
  },
  stepNumber: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  actionButton: {
    fontSize: '1.1rem',
    padding: theme.spacing(2, 4),
    margin: theme.spacing(1),
    borderRadius: theme.spacing(3),
  },
  accessibilityTools: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  colorCoded: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0.5, 0),
  },
  neckColor: { backgroundColor: '#ffebee', border: '2px solid #f44336' },
  chestColor: { backgroundColor: '#e8f5e8', border: '2px solid #4caf50' },
  waistColor: { backgroundColor: '#e3f2fd', border: '2px solid #2196f3' },
  hipsColor: { backgroundColor: '#fff3e0', border: '2px solid #ff9800' },
}));

const SimpleMeasurementInstructions = () => {
  const classes = useStyles();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const simpleInstructions = [
    {
      title: "Get Ready",
      icon: "🏃‍♀️",
      steps: [
        "Stand up straight",
        "Wear tight clothes or underwear",
        "Get a measuring tape",
        "Ask someone to help you"
      ],
      visual: PrepareVisual,
      color: "#e8f5e8"
    },
    {
      title: "Neck",
      icon: "👔",
      steps: [
        "Put tape around your neck",
        "Where a shirt collar sits",
        "Not too tight - fit 1 finger under",
        "Write down the number"
      ],
      visual: SimpleNeckVisual,
      color: "#ffebee"
    },
    {
      title: "Chest",
      icon: "🫁",
      steps: [
        "Put tape around your chest",
        "At the biggest part",
        "Keep tape level - not slanted",
        "Breathe normal - don't hold breath"
      ],
      visual: SimpleChestVisual,
      color: "#e8f5e8"
    },
    {
      title: "Waist",
      icon: "⭕",
      steps: [
        "Find the smallest part of your middle",
        "Bend to the side to find it",
        "Put tape around there",
        "Don't suck in your stomach"
      ],
      visual: SimpleWaistVisual,
      color: "#e3f2fd"
    },
    {
      title: "Hips",
      icon: "🍑",
      steps: [
        "Find the biggest part of your bottom",
        "Usually 7-9 inches below waist",
        "Put tape around there",
        "Keep feet together"
      ],
      visual: SimpleHipsVisual,
      color: "#fff3e0"
    }
  ];

  const currentInstruction = simpleInstructions[currentStep];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentStep < simpleInstructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const VisualComponent = currentInstruction.visual;

  return (
    <Box className={classes.root}>
      <Paper elevation={3} style={{ padding: 24, marginBottom: 24, backgroundColor: currentInstruction.color }}>
        <Box display="flex" alignItems="center" justifyContent="center" marginBottom={2}>
          <Box className={classes.stepNumber}>
            {currentStep + 1}
          </Box>
        </Box>
        
        <Typography variant="h3" align="center" gutterBottom>
          {currentInstruction.icon} {currentInstruction.title}
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<VolumeUpIcon />}
          onClick={() => speakText(`${currentInstruction.title}. ${currentInstruction.steps.join('. ')}`)}
          className={classes.actionButton}
          style={{ display: 'block', margin: '16px auto' }}
        >
          🔊 Listen to Instructions
        </Button>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className={classes.instructionCard}>
            <CardContent>
              <Typography variant="h4" gutterBottom color="primary">
                How to Measure:
              </Typography>
              
              {currentInstruction.steps.map((step, index) => (
                <Box key={index} className={classes.colorCoded} style={{ backgroundColor: currentInstruction.color }}>
                  <Typography className={classes.largeText}>
                    {index + 1}. {step}
                  </Typography>
                </Box>
              ))}
              
              <Box marginTop={3} display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={classes.actionButton}
                >
                  ⬅️ Back
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={currentStep === simpleInstructions.length - 1}
                  className={classes.actionButton}
                >
                  Next ➡️
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={classes.instructionCard}>
            <CardContent>
              <Typography variant="h4" gutterBottom color="primary" align="center">
                Picture Guide
              </Typography>
              
              <Box className={classes.visualContainer}>
                <VisualComponent />
              </Box>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<VolumeUpIcon />}
                onClick={() => speakText("Look at the picture. The red line shows where to measure.")}
                className={classes.actionButton}
              >
                🔊 Explain Picture
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress indicator */}
      <Box marginTop={4}>
        <Typography variant="h5" align="center" gutterBottom>
          Step {currentStep + 1} of {simpleInstructions.length}
        </Typography>
        <Box display="flex" justifyContent="center" gap={1}>
          {simpleInstructions.map((_, index) => (
            <Box
              key={index}
              width={20}
              height={20}
              borderRadius="50%"
              backgroundColor={index === currentStep ? '#1976d2' : '#e0e0e0'}
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </Box>
      </Box>

      {/* Accessibility tools */}
      <Box className={classes.accessibilityTools}>
        <Tooltip title="Read instructions aloud">
          <Fab
            color="primary"
            onClick={() => speakText(currentInstruction.steps.join('. '))}
          >
            <VolumeUpIcon />
          </Fab>
        </Tooltip>
        
        <Tooltip title="Accessibility help">
          <Fab
            color="secondary"
            onClick={() => speakText("This is a measurement guide. Use the buttons to hear instructions. Look at the pictures to see where to measure.")}
          >
            <AccessibilityIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
};

// Simple visual components with large, clear illustrations
const PrepareVisual = () => (
  <svg width="250" height="300" viewBox="0 0 250 300">
    {/* Person standing straight */}
    <rect x="110" y="50" width="30" height="80" fill="#4caf50" rx="15" />
    <circle cx="125" cy="35" r="20" fill="#ffdbcb" />
    <rect x="100" y="130" width="50" height="60" fill="#2196f3" rx="5" />
    <rect x="105" y="190" width="18" height="80" fill="#4caf50" rx="9" />
    <rect x="127" y="190" width="18" height="80" fill="#4caf50" rx="9" />
    
    {/* Measuring tape */}
    <rect x="50" y="100" width="60" height="8" fill="#ff9800" rx="4" />
    <text x="55" y="95" fontSize="12" fill="#333">Measuring Tape</text>
    
    {/* Helper person */}
    <circle cx="200" cy="80" r="15" fill="#ffdbcb" />
    <rect x="190" y="95" width="20" height="50" fill="#9c27b0" rx="10" />
    <text x="170" y="170" fontSize="12" fill="#333">Helper</text>
    
    {/* Instructions */}
    <text x="125" y="290" fontSize="14" fill="#333" textAnchor="middle">Stand Straight • Get Help • Use Tape</text>
  </svg>
);

const SimpleNeckVisual = () => (
  <svg width="250" height="300" viewBox="0 0 250 300">
    {/* Simple person outline */}
    <circle cx="125" cy="80" r="35" fill="#ffdbcb" stroke="#333" strokeWidth="2" />
    <rect x="100" y="115" width="50" height="100" fill="#e3f2fd" stroke="#333" strokeWidth="2" rx="10" />
    
    {/* Neck measurement - very prominent */}
    <ellipse cx="125" cy="115" rx="30" ry="15" fill="none" stroke="#f44336" strokeWidth="6" strokeDasharray="8,4" />
    
    {/* Large arrows pointing to measurement */}
    <path d="M80 115 L95 115" stroke="#f44336" strokeWidth="4" markerEnd="url(#arrow)" />
    <path d="M170 115 L155 115" stroke="#f44336" strokeWidth="4" markerEnd="url(#arrow)" />
    
    {/* Big text label */}
    <text x="125" y="50" fontSize="20" fill="#f44336" textAnchor="middle" fontWeight="bold">NECK</text>
    <text x="125" y="250" fontSize="16" fill="#333" textAnchor="middle">Put tape here ↑</text>
    
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#f44336" />
      </marker>
    </defs>
  </svg>
);

const SimpleChestVisual = () => (
  <svg width="250" height="300" viewBox="0 0 250 300">
    {/* Simple person outline */}
    <circle cx="125" cy="60" r="25" fill="#ffdbcb" stroke="#333" strokeWidth="2" />
    <rect x="90" y="85" width="70" height="120" fill="#e8f5e8" stroke="#333" strokeWidth="2" rx="15" />
    
    {/* Chest measurement - very prominent */}
    <ellipse cx="125" cy="130" rx="45" ry="25" fill="none" stroke="#4caf50" strokeWidth="6" strokeDasharray="8,4" />
    
    {/* Large arrows */}
    <path d="M60 130 L80 130" stroke="#4caf50" strokeWidth="4" markerEnd="url(#arrow2)" />
    <path d="M190 130 L170 130" stroke="#4caf50" strokeWidth="4" markerEnd="url(#arrow2)" />
    
    {/* Big text label */}
    <text x="125" y="40" fontSize="20" fill="#4caf50" textAnchor="middle" fontWeight="bold">CHEST</text>
    <text x="125" y="250" fontSize="16" fill="#333" textAnchor="middle">Biggest part ↑</text>
    
    <defs>
      <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#4caf50" />
      </marker>
    </defs>
  </svg>
);

const SimpleWaistVisual = () => (
  <svg width="250" height="300" viewBox="0 0 250 300">
    {/* Simple person outline */}
    <circle cx="125" cy="50" r="20" fill="#ffdbcb" stroke="#333" strokeWidth="2" />
    <path d="M100 70 L100 120 L90 160 L100 200 L150 200 L160 160 L150 120 L150 70 Z" 
          fill="#e3f2fd" stroke="#333" strokeWidth="2" />
    
    {/* Waist measurement - very prominent */}
    <ellipse cx="125" cy="160" rx="35" ry="18" fill="none" stroke="#2196f3" strokeWidth="6" strokeDasharray="8,4" />
    
    {/* Large arrows */}
    <path d="M70 160 L90 160" stroke="#2196f3" strokeWidth="4" markerEnd="url(#arrow3)" />
    <path d="M180 160 L160 160" stroke="#2196f3" strokeWidth="4" markerEnd="url(#arrow3)" />
    
    {/* Big text label */}
    <text x="125" y="30" fontSize="20" fill="#2196f3" textAnchor="middle" fontWeight="bold">WAIST</text>
    <text x="125" y="250" fontSize="16" fill="#333" textAnchor="middle">Smallest part ↑</text>
    
    <defs>
      <marker id="arrow3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#2196f3" />
      </marker>
    </defs>
  </svg>
);

const SimpleHipsVisual = () => (
  <svg width="250" height="300" viewBox="0 0 250 300">
    {/* Simple person outline */}
    <circle cx="125" cy="40" r="18" fill="#ffdbcb" stroke="#333" strokeWidth="2" />
    <path d="M105 58 L105 100 L95 140 L85 180 L90 220 L160 220 L165 180 L155 140 L145 100 L145 58 Z" 
          fill="#fff3e0" stroke="#333" strokeWidth="2" />
    
    {/* Hips measurement - very prominent */}
    <ellipse cx="125" cy="180" rx="50" ry="22" fill="none" stroke="#ff9800" strokeWidth="6" strokeDasharray="8,4" />
    
    {/* Large arrows */}
    <path d="M60 180 L75 180" stroke="#ff9800" strokeWidth="4" markerEnd="url(#arrow4)" />
    <path d="M190 180 L175 180" stroke="#ff9800" strokeWidth="4" markerEnd="url(#arrow4)" />
    
    {/* Big text label */}
    <text x="125" y="25" fontSize="20" fill="#ff9800" textAnchor="middle" fontWeight="bold">HIPS</text>
    <text x="125" y="250" fontSize="16" fill="#333" textAnchor="middle">Biggest part ↑</text>
    
    <defs>
      <marker id="arrow4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#ff9800" />
      </marker>
    </defs>
  </svg>
);

export default SimpleMeasurementInstructions;