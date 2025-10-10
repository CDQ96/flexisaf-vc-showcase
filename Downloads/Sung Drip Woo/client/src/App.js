import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import WeightConverter from './components/measurements/WeightConverter';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import TailorDashboard from './components/dashboard/TailorDashboard';

// Layout Components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

// Tailor Discovery Components
import TailorsList from './components/tailors/TailorsList';

// Measurement Components
import MeasurementForm from './components/measurements/MeasurementForm';
import EnhancedMeasurementForm from './components/measurements/EnhancedMeasurementForm';
import MeasurementDisplay from './components/measurements/MeasurementDisplay';
import MeasurementValidator from './components/measurements/MeasurementValidator';
import MeasurementDashboard from './components/measurements/MeasurementDashboard';
import VisualMeasurementGuide from './components/measurements/VisualMeasurementGuide';
import SimpleMeasurementInstructions from './components/measurements/SimpleMeasurementInstructions';
import InteractiveMeasurementGuide from './components/measurements/InteractiveMeasurementGuide';
import AppointmentScheduler from './components/measurements/AppointmentScheduler';

// Material Components
import MaterialSelection from './components/materials/MaterialSelection';

// Payment Components
import CheckoutForm from './components/payments/CheckoutForm';
import PaymentWrapper from './components/payments/PaymentWrapper';

// Delivery Components
import DeliveryTracker from './components/delivery/DeliveryTracker';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tailors" element={<TailorsList />} />
          
          {/* Measurement Routes */}
          <Route path="/measurements" element={<MeasurementDashboard />} />
          <Route path="/measurements/new" element={<MeasurementForm />} />
          <Route path="/measurements/enhanced" element={<EnhancedMeasurementForm />} />
          <Route path="/measurements/display" element={<MeasurementDisplay />} />
          <Route path="/measurements/validator" element={<MeasurementValidator />} />
          <Route path="/measurements/schedule" element={<AppointmentScheduler />} />
          <Route path="/measurements/visual-guide" element={<VisualMeasurementGuide />} />
          <Route path="/measurements/simple-instructions" element={<SimpleMeasurementInstructions />} />
          <Route path="/measurements/interactive-guide" element={<InteractiveMeasurementGuide />} />
          <Route path="/measurements/weight" element={<WeightConverter />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/tailor" element={<TailorDashboard />} />
          {/* Alias for measurements dashboard */}
          <Route path="/measurements/dashboard" element={<MeasurementDashboard />} />
          <Route path="/measurements/validator" element={<MeasurementValidator />} />
          <Route path="/measurements/schedule" element={<AppointmentScheduler />} />
          <Route path="/measurements/visual-guide" element={<VisualMeasurementGuide />} />
          <Route path="/measurements/simple-instructions" element={<SimpleMeasurementInstructions />} />
          <Route path="/measurements/interactive-guide" element={<InteractiveMeasurementGuide />} />
          <Route path="/measurements/weight" element={<WeightConverter />} />
          
          {/* Other Routes */}
          <Route path="/materials" element={<MaterialSelection />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/payment" element={<PaymentWrapper />} />
          <Route path="/delivery" element={<DeliveryTracker />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;