import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';

const MaterialSelection = ({ tailorId, onMaterialSelect }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    color: '',
    priceRange: ''
  });
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [materialOption, setMaterialOption] = useState('tailor'); // 'tailor' or 'customer'
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        let url = '/api/materials';
        if (tailorId) {
          url = `/api/materials/tailor/${tailorId}`;
        }
        
        const res = await axios.get(url);
        setMaterials(res.data);
      } catch (err) {
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [tailorId]);

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const filteredMaterials = materials.filter(material => {
    let match = true;
    
    if (filter.type && material.type !== filter.type) {
      match = false;
    }
    
    if (filter.color && material.color !== filter.color) {
      match = false;
    }
    
    if (filter.priceRange) {
      const price = parseFloat(material.pricePerYard);
      switch (filter.priceRange) {
        case 'low':
          if (price > 20) match = false;
          break;
        case 'medium':
          if (price < 20 || price > 50) match = false;
          break;
        case 'high':
          if (price < 50) match = false;
          break;
        default:
          break;
      }
    }
    
    return match;
  });

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setDialogOpen(true);
  };

  const handleConfirmSelection = () => {
    onMaterialSelect({
      material: selectedMaterial,
      quantity: quantity,
      option: materialOption,
      totalPrice: materialOption === 'tailor' ? selectedMaterial.pricePerYard * quantity : 0
    });
    setDialogOpen(false);
  };

  // Get unique material types and colors for filters
  const materialTypes = [...new Set(materials.map(m => m.type))];
  const materialColors = [...new Set(materials.map(m => m.color))];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Select Materials
      </Typography>
      
      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Material Options
        </Typography>
        <RadioGroup
          row
          value={materialOption}
          onChange={(e) => setMaterialOption(e.target.value)}
        >
          <FormControlLabel 
            value="tailor" 
            control={<Radio />} 
            label="Purchase materials from tailor" 
          />
          <FormControlLabel 
            value="customer" 
            control={<Radio />} 
            label="I will provide my own materials" 
          />
        </RadioGroup>
      </Box>
      
      {materialOption === 'tailor' && (
        <>
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Material Type</InputLabel>
              <Select
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
                label="Material Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {materialTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Color</InputLabel>
              <Select
                name="color"
                value={filter.color}
                onChange={handleFilterChange}
                label="Color"
              >
                <MenuItem value="">All Colors</MenuItem>
                {materialColors.map(color => (
                  <MenuItem key={color} value={color}>{color}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Price Range</InputLabel>
              <Select
                name="priceRange"
                value={filter.priceRange}
                onChange={handleFilterChange}
                label="Price Range"
              >
                <MenuItem value="">All Prices</MenuItem>
                <MenuItem value="low">Budget (&lt; $20/yard)</MenuItem>
                <MenuItem value="medium">Mid-range ($20-$50/yard)</MenuItem>
                <MenuItem value="high">Premium (&gt;$50/yard)</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {filteredMaterials.length === 0 ? (
            <Typography variant="body1" sx={{ my: 4, textAlign: 'center' }}>
              No materials found matching your filters.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredMaterials.map(material => (
                <Grid item xs={12} sm={6} md={4} key={material.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => handleMaterialSelect(material)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={material.imageUrl || 'https://via.placeholder.com/300x140?text=Material+Image'}
                      alt={material.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {material.name}
                      </Typography>
                      <Box sx={{ mb: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Chip size="small" label={material.type} color="primary" />
                        {material.color && <Chip size="small" label={material.color} />}
                        {material.pattern && <Chip size="small" label={material.pattern} />}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {material.description}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${material.pricePerYard}/yard
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {material.quantityAvailable > 0 
                          ? `${material.quantityAvailable} yards available` 
                          : 'Out of stock'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
      
      {materialOption === 'customer' && (
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body1" paragraph>
            You've chosen to provide your own materials. Please coordinate with the tailor about:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                The type and amount of fabric needed for your order
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                When and how to deliver the materials to the tailor
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Any specific handling instructions for your materials
              </Typography>
            </li>
          </ul>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => onMaterialSelect({ option: 'customer' })}
            sx={{ mt: 2 }}
          >
            Confirm Own Materials
          </Button>
        </Box>
      )}
      
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Material Selection</DialogTitle>
        <DialogContent>
          {selectedMaterial && (
            <>
              <Typography variant="h6">{selectedMaterial.name}</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedMaterial.type} - {selectedMaterial.color}
              </Typography>
              <Typography variant="body1" paragraph>
                Price: ${selectedMaterial.pricePerYard}/yard
              </Typography>
              
              <TextField
                label="Quantity (yards)"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                InputProps={{ inputProps: { min: 1, max: selectedMaterial.quantityAvailable } }}
                fullWidth
                margin="normal"
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6">
                Total: ${(selectedMaterial.pricePerYard * quantity).toFixed(2)}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmSelection} 
            variant="contained" 
            color="primary"
          >
            Confirm Selection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialSelection;