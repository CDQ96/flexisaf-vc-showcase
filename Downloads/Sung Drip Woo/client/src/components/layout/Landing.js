import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MeasureIcon from '@mui/icons-material/Straighten';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Landing = () => {
  const features = [
    {
      title: 'Find Local Tailors',
      description: 'Discover skilled tailors in your area with our geolocation-based search system.',
      icon: <SearchIcon style={{ fontSize: 60, color: '#3f51b5' }} />,
    },
    {
      title: 'Easy Measurements',
      description: 'Choose between professional measurements or our guided self-measurement system.',
      icon: <MeasureIcon style={{ fontSize: 60, color: '#3f51b5' }} />,
    },
    {
      title: 'Custom Orders',
      description: 'Place custom tailoring orders with detailed specifications and material preferences.',
      icon: <ShoppingBagIcon style={{ fontSize: 60, color: '#3f51b5' }} />,
    },
    {
      title: 'Fast Delivery',
      description: 'Track your orders and enjoy fast, reliable delivery of your custom garments.',
      icon: <LocalShippingIcon style={{ fontSize: 60, color: '#3f51b5' }} />,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', padding: '64px 0 48px' }}>
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Sung Drip Woo
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Connect with skilled local tailors for custom clothing that fits perfectly. 
            From measurements to delivery, we make custom tailoring simple and accessible.
          </Typography>
          <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/tailors"
              variant="contained"
              color="primary"
              size="large"
            >
              Find Tailors
            </Button>
            <Button
              component={Link}
              to="/measurements"
              variant="outlined"
              color="primary"
              size="large"
            >
              Start Measuring
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ paddingTop: 8, paddingBottom: 8 }} maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Simple steps to get your perfect custom clothing
        </Typography>
        
        <Grid container spacing={4} sx={{ marginTop: 4 }}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ backgroundColor: '#3f51b5', color: 'white', padding: '64px 0' }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Join thousands of satisfied customers who have found their perfect tailor
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <Button
              component={Link}
              to="/measurements"
              variant="contained"
              color="secondary"
              size="large"
            >
              Start Your Journey
            </Button>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default Landing;