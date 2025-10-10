import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import InfoIcon from '@material-ui/icons/Info';
import StraightenIcon from '@material-ui/icons/Straighten';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: 'white',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
  },
  measurementCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  },
  svgContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    backgroundColor: '#f8f9fa',
    borderRadius: theme.spacing(1),
    margin: theme.spacing(2, 0),
  },
  instructionText: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    marginBottom: theme.spacing(2),
  },
  tipBox: {
    backgroundColor: theme.palette.info.light,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  measurementPoint: {
    fill: theme.palette.primary.main,
    stroke: theme.palette.primary.dark,
    strokeWidth: 2,
  },
  measurementLine: {
    stroke: theme.palette.secondary.main,
    strokeWidth: 3,
    strokeDasharray: '5,5',
  },
  labelText: {
    fontSize: '14px',
    fontWeight: 'bold',
    fill: theme.palette.text.primary,
  },
}));

const VisualMeasurementGuide = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const measurements = [
    {
      name: 'Neck',
      description: 'Measure around the base of your neck where a shirt collar would sit',
      tips: 'Keep the tape measure snug but not tight. You should be able to fit one finger underneath.',
      svgComponent: NeckMeasurementSVG,
    },
    {
      name: 'Chest/Bust',
      description: 'Measure around the fullest part of your chest, keeping the tape level',
      tips: 'Stand straight with arms at your sides. The tape should be parallel to the floor.',
      svgComponent: ChestMeasurementSVG,
    },
    {
      name: 'Waist',
      description: 'Measure around your natural waistline, the narrowest part of your torso',
      tips: 'Breathe normally and don\'t suck in your stomach. Find the natural bend when you lean to one side.',
      svgComponent: WaistMeasurementSVG,
    },
    {
      name: 'Hips',
      description: 'Measure around the fullest part of your hips and buttocks',
      tips: 'Stand with feet together. Measure at the widest point, usually 7-9 inches below your waist.',
      svgComponent: HipsMeasurementSVG,
    },
    {
      name: 'Shoulder Width',
      description: 'Measure from the edge of one shoulder to the edge of the other',
      tips: 'Measure across your back from shoulder point to shoulder point, not across the front.',
      svgComponent: ShoulderMeasurementSVG,
    },
    {
      name: 'Arm Length',
      description: 'Measure from shoulder point to wrist with arm slightly bent',
      tips: 'Bend your arm slightly at the elbow. Measure from the shoulder seam point to your wrist bone.',
      svgComponent: ArmLengthMeasurementSVG,
    },
    {
      name: 'Inseam',
      description: 'Measure from the crotch seam to the ankle along the inside of your leg',
      tips: 'Use pants that fit well as a guide. Measure along the inside seam from crotch to desired length.',
      svgComponent: InseamMeasurementSVG,
    },
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, measurements.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const currentMeasurement = measurements[activeStep];
  const SVGComponent = currentMeasurement.svgComponent;

  return (
    <Box className={classes.root}>
      <Paper className={classes.header} elevation={3}>
        <StraightenIcon style={{ fontSize: 48, marginBottom: 16 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Visual Measurement Guide
        </Typography>
        <Typography variant="h6">
          Step-by-step instructions with visual diagrams for accurate body measurements
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className={classes.measurementCard} elevation={4}>
            <CardContent>
              <Box display="flex" alignItems="center" marginBottom={2}>
                <Chip 
                  label={`Step ${activeStep + 1} of ${measurements.length}`} 
                  color="primary" 
                  style={{ marginRight: 16 }}
                />
                <Typography variant="h4" component="h2">
                  {currentMeasurement.name}
                </Typography>
              </Box>
              
              <Typography className={classes.instructionText}>
                {currentMeasurement.description}
              </Typography>

              <Box className={classes.tipBox}>
                <Box display="flex" alignItems="center" marginBottom={1}>
                  <InfoIcon color="primary" style={{ marginRight: 8 }} />
                  <Typography variant="h6" color="primary">
                    Pro Tip
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {currentMeasurement.tips}
                </Typography>
              </Box>

              <Box className={classes.navigationButtons}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<NavigateBeforeIcon />}
                  variant="outlined"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={activeStep === measurements.length - 1}
                  endIcon={<NavigateNextIcon />}
                  variant="contained"
                  color="primary"
                >
                  Next
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={classes.measurementCard} elevation={4}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Visual Guide
              </Typography>
              <Box className={classes.svgContainer}>
                <SVGComponent />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box marginTop={4}>
        <Stepper activeStep={activeStep} orientation="horizontal">
          {measurements.map((measurement, index) => (
            <Step key={measurement.name}>
              <StepLabel 
                onClick={() => setActiveStep(index)}
                style={{ cursor: 'pointer' }}
              >
                {measurement.name}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
};

// SVG Components for each measurement
const NeckMeasurementSVG = () => (
  <svg width="300" height="400" viewBox="0 0 300 400">
    {/* Human figure outline */}
    <path
      d="M150 50 C140 45, 130 50, 130 65 L130 80 C125 85, 120 95, 120 110 L120 200 C120 220, 125 240, 130 260 L130 380 M170 380 L170 260 C175 240, 180 220, 180 200 L180 110 C180 95, 175 85, 170 80 L170 65 C170 50, 160 45, 150 50"
      fill="none"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Head */}
    <circle cx="150" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Neck measurement line */}
    <ellipse cx="150" cy="65" rx="25" ry="12" fill="none" stroke="#ff6b6b" strokeWidth="3" strokeDasharray="5,5" />
    
    {/* Measurement points */}
    <circle cx="125" cy="65" r="4" fill="#ff6b6b" />
    <circle cx="175" cy="65" r="4" fill="#ff6b6b" />
    
    {/* Labels */}
    <text x="200" y="70" className="labelText" fill="#333">Neck</text>
    <line x1="175" y1="65" x2="195" y2="68" stroke="#333" strokeWidth="1" />
    
    {/* Instruction arrow */}
    <path d="M125 65 Q110 55, 95 65" fill="none" stroke="#ff6b6b" strokeWidth="2" markerEnd="url(#arrowhead)" />
    <text x="70" y="60" fontSize="12" fill="#ff6b6b">Measure here</text>
    
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#ff6b6b" />
      </marker>
    </defs>
  </svg>
);

const ChestMeasurementSVG = () => (
  <svg width="300" height="400" viewBox="0 0 300 400">
    {/* Human figure outline */}
    <path
      d="M150 50 C140 45, 130 50, 130 65 L130 80 C125 85, 120 95, 120 110 L120 200 C120 220, 125 240, 130 260 L130 380 M170 380 L170 260 C175 240, 180 220, 180 200 L180 110 C180 95, 175 85, 170 80 L170 65 C170 50, 160 45, 150 50"
      fill="none"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Head */}
    <circle cx="150" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Arms */}
    <path d="M120 110 L90 130 L85 160" fill="none" stroke="#333" strokeWidth="2" />
    <path d="M180 110 L210 130 L215 160" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Chest measurement line */}
    <ellipse cx="150" cy="130" rx="45" ry="20" fill="none" stroke="#4ecdc4" strokeWidth="3" strokeDasharray="5,5" />
    
    {/* Measurement points */}
    <circle cx="105" cy="130" r="4" fill="#4ecdc4" />
    <circle cx="195" cy="130" r="4" fill="#4ecdc4" />
    
    {/* Labels */}
    <text x="220" y="135" className="labelText" fill="#333">Chest/Bust</text>
    <line x1="195" y1="130" x2="215" y2="132" stroke="#333" strokeWidth="1" />
    
    {/* Instruction arrow */}
    <path d="M105 130 Q85 115, 65 125" fill="none" stroke="#4ecdc4" strokeWidth="2" markerEnd="url(#arrowhead2)" />
    <text x="30" y="120" fontSize="12" fill="#4ecdc4">Fullest part</text>
    
    <defs>
      <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#4ecdc4" />
      </marker>
    </defs>
  </svg>
);

const WaistMeasurementSVG = () => (
  <svg width="300" height="400" viewBox="0 0 300 400">
    {/* Human figure outline */}
    <path
      d="M150 50 C140 45, 130 50, 130 65 L130 80 C125 85, 120 95, 120 110 L115 180 C115 190, 118 200, 125 210 L130 260 L130 380 M170 380 L170 260 L175 210 C182 200, 185 190, 185 180 L180 110 C180 95, 175 85, 170 80 L170 65 C170 50, 160 45, 150 50"
      fill="none"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Head */}
    <circle cx="150" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Arms */}
    <path d="M120 110 L90 130 L85 160" fill="none" stroke="#333" strokeWidth="2" />
    <path d="M180 110 L210 130 L215 160" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Waist measurement line */}
    <ellipse cx="150" cy="180" rx="35" ry="15" fill="none" stroke="#45b7d1" strokeWidth="3" strokeDasharray="5,5" />
    
    {/* Measurement points */}
    <circle cx="115" cy="180" r="4" fill="#45b7d1" />
    <circle cx="185" cy="180" r="4" fill="#45b7d1" />
    
    {/* Labels */}
    <text x="200" y="185" className="labelText" fill="#333">Waist</text>
    <line x1="185" y1="180" x2="195" y2="182" stroke="#333" strokeWidth="1" />
    
    {/* Instruction arrow */}
    <path d="M115 180 Q95 165, 75 175" fill="none" stroke="#45b7d1" strokeWidth="2" markerEnd="url(#arrowhead3)" />
    <text x="40" y="170" fontSize="12" fill="#45b7d1">Narrowest part</text>
    
    <defs>
      <marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#45b7d1" />
      </marker>
    </defs>
  </svg>
);

const HipsMeasurementSVG = () => (
  <svg width="300" height="400" viewBox="0 0 300 400">
    {/* Human figure outline */}
    <path
      d="M150 50 C140 45, 130 50, 130 65 L130 80 C125 85, 120 95, 120 110 L115 180 C115 190, 118 200, 125 210 L130 240 C125 250, 120 260, 120 270 L120 300 C125 310, 130 320, 130 330 L130 380 M170 380 L170 330 C170 320, 175 310, 180 300 L180 270 C180 260, 175 250, 170 240 L175 210 C182 200, 185 190, 185 180 L180 110 C180 95, 175 85, 170 80 L170 65 C170 50, 160 45, 150 50"
      fill="none"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Head */}
    <circle cx="150" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Arms */}
    <path d="M120 110 L90 130 L85 160" fill="none" stroke="#333" strokeWidth="2" />
    <path d="M180 110 L210 130 L215 160" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Hips measurement line */}
    <ellipse cx="150" cy="240" rx="50" ry="18" fill="none" stroke="#f39c12" strokeWidth="3" strokeDasharray="5,5" />
    
    {/* Measurement points */}
    <circle cx="100" cy="240" r="4" fill="#f39c12" />
    <circle cx="200" cy="240" r="4" fill="#f39c12" />
    
    {/* Labels */}
    <text x="210" y="245" className="labelText" fill="#333">Hips</text>
    <line x1="200" y1="240" x2="205" y2="242" stroke="#333" strokeWidth="1" />
    
    {/* Instruction arrow */}
    <path d="M100 240 Q80 225, 60 235" fill="none" stroke="#f39c12" strokeWidth="2" markerEnd="url(#arrowhead4)" />
    <text x="25" y="230" fontSize="12" fill="#f39c12">Fullest part</text>
    
    <defs>
      <marker id="arrowhead4" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#f39c12" />
      </marker>
    </defs>
  </svg>
);

const ShoulderMeasurementSVG = () => (
  <svg width="300" height="400" viewBox="0 0 300 400">
    {/* Human figure outline - back view */}
    <path
      d="M150 50 C140 45, 130 50, 130 65 L130 80 C125 85, 120 95, 120 110 L120 200 C120 220, 125 240, 130 260 L130 380 M170 380 L170 260 C175 240, 180 220, 180 200 L180 110 C180 95, 175 85, 170 80 L170 65 C170 50, 160 45, 150 50"
      fill="none"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Head */}
    <circle cx="150" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Arms */}
    <path d="M120 110 L90 130 L85 160" fill="none" stroke="#333" strokeWidth="2" />
    <path d="M180 110 L210 130 L215 160" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Shoulder measurement line */}
    <line x1="120" y1="110" x2="180" y2="110" stroke="#e74c3c" strokeWidth="3" strokeDasharray="5,5" />
    
    {/* Measurement points */}
    <circle cx="120" cy="110" r="4" fill="#e74c3c" />
    <circle cx="180" cy="110" r="4" fill="#e74c3c" />
    
    {/* Labels */}
    <text x="130" y="100" className="labelText" fill="#333">Shoulder Width</text>
    
    {/* Instruction arrows */}
    <path d="M120 110 Q105 95, 85 105" fill="none" stroke="#e74c3c" strokeWidth="2" markerEnd="url(#arrowhead5)" />
    <path d="M180 110 Q195 95, 215 105" fill="none" stroke="#e74c3c" strokeWidth="2" markerEnd="url(#arrowhead5)" />
    <text x="60" y="100" fontSize="12" fill="#e74c3c">Shoulder point</text>
    <text x="190" y="100" fontSize="12" fill="#e74c3c">Shoulder point</text>
    
    <defs>
      <marker id="arrowhead5" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#e74c3c" />
      </marker>
    </defs>
  </svg>
);

const ArmLengthMeasurementSVG = () => (
  <svg width="300" height="400" viewBox="0 0 300 400">
    {/* Human figure outline */}
    <path
      d="M150 50 C140 45, 130 50, 130 65 L130 80 C125 85, 120 95, 120 110 L120 200 C120 220, 125 240, 130 260 L130 380 M170 380 L170 260 C175 240, 180 220, 180 200 L180 110 C180 95, 175 85, 170 80 L170 65 C170 50, 160 45, 150 50"
      fill="none"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Head */}
    <circle cx="150" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Extended arm */}
    <path d="M180 110 L220 140 L250 170 L270 200" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Arm measurement line */}
    <path d="M180 110 Q200 125, 220 140 Q235 155, 250 170 Q260 185, 270 200" 
          fill="none" stroke="#9b59b6" strokeWidth="3" strokeDasharray="5,5" />
    
    {/* Measurement points */}
    <circle cx="180" cy="110" r="4" fill="#9b59b6" />
    <circle cx="270" cy="200" r="4" fill="#9b59b6" />
    
    {/* Labels */}
    <text x="190" y="100" className="labelText" fill="#333">Shoulder</text>
    <text x="275" y="205" className="labelText" fill="#333">Wrist</text>
    
    {/* Instruction arrow */}
    <path d="M225 155 Q210 140, 190 150" fill="none" stroke="#9b59b6" strokeWidth="2" markerEnd="url(#arrowhead6)" />
    <text x="160" y="145" fontSize="12" fill="#9b59b6">Arm length</text>
    
    <defs>
      <marker id="arrowhead6" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#9b59b6" />
      </marker>
    </defs>
  </svg>
);

const InseamMeasurementSVG = () => (
  <svg width="300" height="400" viewBox="0 0 300 400">
    {/* Human figure outline */}
    <path
      d="M150 50 C140 45, 130 50, 130 65 L130 80 C125 85, 120 95, 120 110 L120 200 C120 220, 125 240, 130 260 L130 300 L125 350 L120 380 M180 380 L175 350 L170 300 L170 260 C175 240, 180 220, 180 200 L180 110 C180 95, 175 85, 170 80 L170 65 C170 50, 160 45, 150 50"
      fill="none"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Head */}
    <circle cx="150" cy="35" r="20" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Arms */}
    <path d="M120 110 L90 130 L85 160" fill="none" stroke="#333" strokeWidth="2" />
    <path d="M180 110 L210 130 L215 160" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Legs separated */}
    <path d="M130 300 L125 350 L120 380" fill="none" stroke="#333" strokeWidth="2" />
    <path d="M170 300 L175 350 L180 380" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Inseam measurement line */}
    <line x1="150" y1="260" x2="125" y2="380" stroke="#1abc9c" strokeWidth="3" strokeDasharray="5,5" />
    
    {/* Measurement points */}
    <circle cx="150" cy="260" r="4" fill="#1abc9c" />
    <circle cx="125" cy="380" r="4" fill="#1abc9c" />
    
    {/* Labels */}
    <text x="155" y="255" className="labelText" fill="#333">Crotch</text>
    <text x="90" y="385" className="labelText" fill="#333">Ankle</text>
    
    {/* Instruction arrow */}
    <path d="M137 320 Q120 310, 100 320" fill="none" stroke="#1abc9c" strokeWidth="2" markerEnd="url(#arrowhead7)" />
    <text x="65" y="315" fontSize="12" fill="#1abc9c">Inside leg</text>
    
    <defs>
      <marker id="arrowhead7" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#1abc9c" />
      </marker>
    </defs>
  </svg>
);

export default VisualMeasurementGuide;