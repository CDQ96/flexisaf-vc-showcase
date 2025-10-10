import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  CircularProgress,
  Chip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

const TailorsList = () => {
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockTailors = [
    {
      _id: '1',
      name: 'Master Chen',
      specialties: ['Suits', 'Formal Wear'],
      location: 'Downtown',
      rating: 4.8,
      experience: '15 years',
      priceRange: '$$$',
      description: 'Specializing in custom suits and formal wear with traditional techniques.'
    },
    {
      _id: '2',
      name: 'Sarah\'s Alterations',
      specialties: ['Dresses', 'Casual Wear'],
      location: 'Midtown',
      rating: 4.6,
      experience: '8 years',
      priceRange: '$$',
      description: 'Expert in dress alterations and custom casual clothing.'
    },
    {
      _id: '3',
      name: 'Elite Tailoring',
      specialties: ['Wedding Dresses', 'Evening Wear'],
      location: 'Uptown',
      rating: 4.9,
      experience: '20 years',
      priceRange: '$$$$',
      description: 'Luxury tailoring for special occasions and high-end fashion.'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTailors(mockTailors);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTailors = tailors.filter(tailor =>
    tailor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tailor.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Find Local Tailors
      </Typography>
      
      <Box sx={{ marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Search tailors or specialties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ marginRight: 1, color: 'text.secondary' }} />
          }}
          sx={{ width: '100%', maxWidth: 500 }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredTailors.map((tailor) => (
          <Grid item xs={12} sm={6} md={4} key={tailor._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {tailor.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                  <LocationOnIcon sx={{ marginRight: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {tailor.location}
                  </Typography>
                </Box>

                <Typography variant="body2" paragraph>
                  {tailor.description}
                </Typography>

                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Specialties:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {tailor.specialties.map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Experience: {tailor.experience}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price Range: {tailor.priceRange}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {tailor.rating}/5.0
                </Typography>
              </CardContent>
              
              <CardActions>
                <Button
                  component={Link}
                  to={`/tailors/${tailor._id}`}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTailors.length === 0 && (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No tailors found matching your search.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default TailorsList;