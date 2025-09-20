import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Popper,
  Grow,
  ClickAwayListener,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

// Styled components
const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

// Create a custom component that combines Box styling with Link functionality
const ProductItem = React.forwardRef(({ to, onClick, children, sx, ...rest }, ref) => {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      ref={ref}
      style={{ 
        textDecoration: 'none', 
        color: 'inherit',
        display: 'block',
        width: '100%'
      }}
      {...rest}
    >
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 1,
          borderRadius: theme => theme.shape.borderRadius * 1.5,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(42, 125, 111, 0.08)',
            transform: 'translateY(-2px)',
          },
          marginBottom: 1,
          ...sx
        }}
      >
        {children}
      </Box>
    </Link>
  );
});

ProductItem.displayName = 'ProductItem';

const ProductImage = styled('img')(({ theme }) => ({
  width: 48,
  height: 48,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const ProductInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

// Create a custom component that combines MuiLink styling with Link functionality
const ViewAllButton = React.forwardRef(({ to, onClick, children, ...rest }, ref) => {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      ref={ref}
      style={{ 
        textDecoration: 'none',
        display: 'block',
        width: '100%'
      }}
      {...rest}
    >
      <Box 
        sx={{
          display: 'block',
          marginTop: 2,
          textAlign: 'right',
          color: theme => theme.palette.primary.main,
          fontWeight: 'medium',
          '&:hover': { 
            textDecoration: 'underline',
            color: theme => theme.palette.primary.dark,
          }
        }}
      >
        {children}
      </Box>
    </Link>
  );
});

ViewAllButton.displayName = 'ViewAllButton';

const MarketplaceMegaMenu = ({ open, anchorEl, handleClose }) => {
  // Handmade & Artisan Products
  const handmadeProducts = [
    {
      icon: '🧶',
      title: 'Handicrafts & Accessories',
      description: 'Jewelry, bags, woven goods by refugee women.',
      image: '/icons/handicraft.svg',
      link: '/marketplace/handicrafts'
    },
    {
      icon: '🎨',
      title: 'Art & Cultural Pieces',
      description: 'Traditional art, calligraphy, paintings.',
      image: '/icons/art.svg',
      link: '/marketplace/art'
    },
    {
      icon: '👕',
      title: 'Custom Clothing & Fabric',
      description: 'Handmade garments, embroidery, fabric crafts.',
      image: '/icons/clothing.svg',
      link: '/marketplace/clothing'
    },
  ];

  // Digital Products & Services
  const digitalProducts = [
    {
      icon: '🖥️',
      title: 'Freelancer Services',
      description: 'Design, translation, editing, digital consulting.',
      image: '/icons/freelancer.svg',
      link: '/marketplace/freelance'
    },
    {
      icon: '📄',
      title: 'Downloadable Goods',
      description: 'eBooks, templates, posters, educational PDFs.',
      image: '/icons/download.svg',
      link: '/marketplace/downloads'
    },
    {
      icon: '📦',
      title: 'Community-built Apps/Tools',
      description: 'Chrome extensions, mobile apps, AI tools from RNC-AI Hub.',
      image: '/icons/apps.svg',
      link: '/marketplace/apps'
    },
  ];

  // Bakery and Dry Snacks
  const bakeryProducts = [
    {
      category: '🎂 Cakes',
      items: [
        { name: 'Chocolate Fudge Cake', image: '/images/choco-cake.jpg', link: '/marketplace/bakery/chocolate-cake' },
        { name: 'Vanilla Butter Cake', image: '/images/vanilla-cake.jpg', link: '/marketplace/bakery/vanilla-cake' },
        { name: 'Red Velvet Cake', image: '/images/marketplace/red-velvet.jpg', link: '/marketplace/bakery/red-velvet' },
        { name: 'Fruit Cake', image: '/images/marketplace/fruit-cake.jpg', link: '/marketplace/bakery/fruit-cake' },
        { name: 'Coffee Walnut Cake', image: '/images/marketplace/coffee-cake.jpg', link: '/marketplace/bakery/coffee-cake' },
      ]
    },
    {
      category: '🍪 Desserts & Cookies',
      items: [
        { name: 'Baklava (Middle East)', image: '/images/marketplace/baklava.jpg', link: '/marketplace/bakery/baklava' },
        { name: 'Maamoul (Date Cookies)', image: '/images/marketplace/maamoul.jpg', link: '/marketplace/bakery/maamoul' },
        { name: 'Chocolate Chip Cookies', image: '/images/marketplace/choc-cookies.jpg', link: '/marketplace/bakery/choc-cookies' },
        { name: 'Shortbread Biscuits', image: '/images/marketplace/shortbread.jpg', link: '/marketplace/bakery/shortbread' },
        { name: 'Brownies', image: '/images/marketplace/brownies.jpg', link: '/marketplace/bakery/brownies' },
      ]
    },
    {
      category: '🍘 Dry Items & Artisan Snacks',
      items: [
        { name: 'Peanut Butter Bites', image: '/images/marketplace/peanut-bites.jpg', link: '/marketplace/bakery/peanut-bites' },
        { name: 'Almond Cookies', image: '/images/marketplace/almond-cookies.jpg', link: '/marketplace/bakery/almond-cookies' },
        { name: 'Granola Bars', image: '/images/marketplace/granola.jpg', link: '/marketplace/bakery/granola' },
        { name: 'Sesame Crackers', image: '/images/marketplace/sesame-crackers.jpg', link: '/marketplace/bakery/sesame-crackers' },
        { name: 'Energy Balls', image: '/images/marketplace/energy-balls.jpg', link: '/marketplace/bakery/energy-balls' },
      ]
    }
  ];

  return (
    <Popper 
      open={open} 
      anchorEl={anchorEl} 
      role={undefined} 
      placement="bottom-start" 
      transition 
      disablePortal
      style={{ zIndex: 1300 }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: 'left top' }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              width: '900px', 
              mt: 1.5, 
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <ClickAwayListener onClickAway={handleClose}>
              <Box>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'secondary.main', 
                  color: 'white',
                  borderBottom: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Typography variant="h6" fontWeight="bold">
                    Marketplace
                  </Typography>
                  <Typography variant="body2">
                    Handmade products, digital services, and delicious treats from our community
                  </Typography>
                </Box>
                
                {/* Handmade & Artisan Products */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={4}>
                      <CategoryTitle variant="subtitle1">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          Handmade & Artisan Products
                        </Box>
                      </CategoryTitle>
                      {handmadeProducts.map((product, index) => (
                        <ProductItem 
                          key={index} 
                          to={product.link}
                          onClick={handleClose}
                        >
                          <ProductImage src={product.image} alt={product.title} />
                          <ProductInfo>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {product.icon} {product.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.description}
                            </Typography>
                          </ProductInfo>
                        </ProductItem>
                      ))}
                      <ViewAllButton 
                        to="/marketplace/handmade" 
                        onClick={handleClose}
                      >
                        View all handmade products →
                      </ViewAllButton>
                    </Grid>
                    
                    {/* Digital Products & Services */}
                    <Grid item xs={4}>
                      <CategoryTitle variant="subtitle1">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          Digital Products & Services
                        </Box>
                      </CategoryTitle>
                      {digitalProducts.map((product, index) => (
                        <ProductItem 
                          key={index} 
                          to={product.link}
                          onClick={handleClose}
                        >
                          <ProductImage src={product.image} alt={product.title} />
                          <ProductInfo>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {product.icon} {product.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.description}
                            </Typography>
                          </ProductInfo>
                        </ProductItem>
                      ))}
                      <ViewAllButton 
                        to="/marketplace/digital" 
                        onClick={handleClose}
                      >
                        View all digital products →
                      </ViewAllButton>
                    </Grid>
                    
                    {/* Bakery and Dry Snacks */}
                    <Grid item xs={4}>
                      <CategoryTitle variant="subtitle1">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          Bakery & Snacks
                        </Box>
                      </CategoryTitle>
                      {bakeryProducts.map((category, catIndex) => (
                        <Box key={catIndex} sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                            {category.category}
                          </Typography>
                          {category.items.slice(0, 2).map((item, itemIndex) => (
                            <ProductItem 
                              key={itemIndex} 
                              to={item.link}
                              onClick={handleClose}
                              sx={{ mb: 0.5 }}
                            >
                              <ProductImage src={item.image} alt={item.name} sx={{ width: 40, height: 40 }} />
                              <Typography variant="body2">
                                {item.name}
                              </Typography>
                            </ProductItem>
                          ))}
                        </Box>
                      ))}
                      <ViewAllButton 
                        to="/marketplace/bakery" 
                        onClick={handleClose}
                      >
                        View all bakery items →
                      </ViewAllButton>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 3, 
                    pt: 3, 
                    borderTop: '1px solid rgba(0,0,0,0.1)'
                  }}>
                    <Link
                      to="/marketplace"
                      onClick={handleClose}
                      style={{
                        color: '#D36135', // Terracotta color (secondary.main)
                        fontWeight: 'bold',
                        textDecoration: 'none',
                      }}
                      onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                    >
                      Browse All Products & Services
                    </Link>
                  </Box>
                </Box>
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default MarketplaceMegaMenu;
