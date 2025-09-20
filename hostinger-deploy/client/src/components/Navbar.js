import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
  Collapse,
} from '@mui/material';
import {
  School,
  Work,
  People,
  Login,
  AccountCircle,
  Translate,
  Menu as MenuIcon,
  Close,
  Storefront,
  Article,
  Forum as ForumIcon,
  Code,
  Groups,
  MenuBook,
  Info as AboutIcon,
  Favorite as DonateIcon,
  ExpandMore,
  ExpandLess,
  Layers as ServicesIcon,
  ArrowDropDown,
} from '@mui/icons-material';
import MegaMenu from './MegaMenu';
import RNCLogo from './RNCLogo';
import MarketplaceMegaMenu from './MarketplaceMegaMenu';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [language, setLanguage] = React.useState('en');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = React.useState(false);
  const [servicesAnchorEl, setServicesAnchorEl] = React.useState(null);
  const [mobileServicesOpen, setMobileServicesOpen] = React.useState(false);
  const [marketplaceMenuOpen, setMarketplaceMenuOpen] = React.useState(false);
  const [marketplaceAnchorEl, setMarketplaceAnchorEl] = React.useState(null);
  const [mobileMarketplaceOpen, setMobileMarketplaceOpen] = React.useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = React.useState(false);
  const [resourcesAnchorEl, setResourcesAnchorEl] = React.useState(null);
  const [mobileResourcesOpen, setMobileResourcesOpen] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add logout logic here
    setIsAuthenticated(false);
    handleClose();
  };
  
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    // Here you would implement actual language change logic
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleServicesMenuOpen = (event) => {
    setServicesAnchorEl(event.currentTarget);
    setServicesMenuOpen(true);
    setMarketplaceMenuOpen(false); // Close other menus
    setResourcesMenuOpen(false); // Close other menus
  };
  
  const handleServicesMenuClose = () => {
    setServicesMenuOpen(false);
  };
  
  const toggleMobileServices = () => {
    setMobileServicesOpen(!mobileServicesOpen);
    if (!mobileServicesOpen) {
      setMobileMarketplaceOpen(false); // Close other menus
      setMobileResourcesOpen(false); // Close other menus
    }
  };
  
  const handleResourcesMenuOpen = (event) => {
    setResourcesAnchorEl(event.currentTarget);
    setResourcesMenuOpen(true);
    setServicesMenuOpen(false); // Close other menus
    setMarketplaceMenuOpen(false); // Close other menus
  };
  
  const handleResourcesMenuClose = () => {
    setResourcesMenuOpen(false);
  };
  
  const toggleMobileResources = () => {
    setMobileResourcesOpen(!mobileResourcesOpen);
    if (!mobileResourcesOpen) {
      setMobileServicesOpen(false); // Close other menus
      setMobileMarketplaceOpen(false); // Close other menus
    }
  };
  
  const handleMarketplaceMenuOpen = (event) => {
    setMarketplaceAnchorEl(event.currentTarget);
    setMarketplaceMenuOpen(true);
    setServicesMenuOpen(false); // Close other menus
    setResourcesMenuOpen(false); // Close other menus
  };
  
  const handleMarketplaceMenuClose = () => {
    setMarketplaceMenuOpen(false);
  };
  
  const toggleMobileMarketplace = () => {
    setMobileMarketplaceOpen(!mobileMarketplaceOpen);
    if (!mobileMarketplaceOpen) {
      setMobileServicesOpen(false); // Close other menus
      setMobileResourcesOpen(false); // Close other menus
    }
  };

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          RNC Menu
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        <ListItemButton component={Link} to="/about" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <AboutIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="About Us" />
        </ListItemButton>
        <ListItemButton component={Link} to="/our-services" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <ServicesIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Our Programs" />
        </ListItemButton>
        <ListItemButton component={Link} to="/donate" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <DonateIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Donate" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListItemButton component={Link} to="/courses" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <MenuBook color="primary" />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItemButton>
        <ListItemButton onClick={toggleMobileMarketplace}>
          <ListItemIcon>
            <Storefront color="primary" />
          </ListItemIcon>
          <ListItemText primary="Marketplace" />
          {mobileMarketplaceOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={mobileMarketplaceOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={Link} to="/marketplace/handmade" onClick={handleDrawerToggle} sx={{ pl: 4 }}>
              <ListItemText primary="Handmade & Artisan Products" />
            </ListItemButton>
            <ListItemButton component={Link} to="/marketplace/digital" onClick={handleDrawerToggle} sx={{ pl: 4 }}>
              <ListItemText primary="Digital Products & Services" />
            </ListItemButton>
            <ListItemButton component={Link} to="/marketplace/bakery" onClick={handleDrawerToggle} sx={{ pl: 4 }}>
              <ListItemText primary="Bakery & Snacks" />
            </ListItemButton>
            <ListItemButton component={Link} to="/marketplace" onClick={handleDrawerToggle} sx={{ pl: 4 }}>
              <ListItemText primary="Browse All Products" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton onClick={toggleMobileResources}>
          <ListItemIcon>
            <Article color="primary" />
          </ListItemIcon>
          <ListItemText primary="Our Resources" />
          {mobileResourcesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={mobileResourcesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={Link} to="/blog" onClick={handleDrawerToggle} sx={{ pl: 4 }}>
              <ListItemText primary="Blog" />
            </ListItemButton>
            <ListItemButton component={Link} to="/ai-hub" onClick={handleDrawerToggle} sx={{ pl: 4 }}>
              <ListItemText primary="AI Hub" />
            </ListItemButton>
            <ListItemButton component={Link} to="/career/fair-registration" onClick={handleDrawerToggle} sx={{ pl: 4 }}>
              <ListItemText primary="Career Fair" />
            </ListItemButton>
            <ListItemButton component={Link} to="/activities-album" onClick={handleDrawerToggle} sx={{ pl: 4 }}>
              <ListItemText primary="Activities Album" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton component={Link} to="/forum" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <ForumIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Forum" />
        </ListItemButton>
        <ListItemButton component={Link} to="/community-projects" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <Groups color="primary" />
          </ListItemIcon>
          <ListItemText primary="Community Projects" />
        </ListItemButton>
      </List>
      <Divider sx={{ my: 2 }} />
      {!isAuthenticated ? (
        <Box>
          <Button 
            variant="contained" 
            color="secondary" 
            component={Link} 
            to="/login" 
            fullWidth 
            sx={{ mb: 1 }}
            onClick={handleDrawerToggle}
          >
            <Login sx={{ mr: 1 }} /> Login
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            component={Link} 
            to="/register" 
            fullWidth
            onClick={handleDrawerToggle}
          >
            Register
          </Button>
        </Box>
      ) : (
        <Button 
          variant="outlined" 
          color="secondary" 
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      )}
      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            labelId="language-select-label"
            value={language}
            label="Language"
            onChange={handleLanguageChange}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ar">العربية (Arabic)</MenuItem>
            <MenuItem value="fr">Français (French)</MenuItem>
            <MenuItem value="es">Español (Spanish)</MenuItem>
            <MenuItem value="fa">فارسی (Persian)</MenuItem>
            <MenuItem value="sw">Kiswahili (Swahili)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="menu"
            edge="start"
            className="mobile-menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 100,
              width: 100,
              mr: 2,
              borderRadius: '50%',
              backgroundColor: 'white',
              padding: '5px',
              overflow: 'visible',
              boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
              position: 'relative'
            }}
          >
            <RNCLogo size={90} />
          </Box>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Refugee Network Centre
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/about"
              sx={{ 
                borderRadius: 8, 
                px: 2,
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                } 
              }}
              startIcon={<AboutIcon />}
            >
              About Us
            </Button>
            <Button 
              color="inherit"
              aria-haspopup="true"
              onClick={handleMarketplaceMenuOpen}
              sx={{ 
                borderRadius: 8, 
                px: 2,
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                } 
              }}
              endIcon={<ArrowDropDown />}
              startIcon={<Storefront />}
            >
              Marketplace
            </Button>
            <MarketplaceMegaMenu 
              open={marketplaceMenuOpen} 
              anchorEl={marketplaceAnchorEl} 
              handleClose={handleMarketplaceMenuClose} 
            />
            <Button 
              color="inherit"
              aria-haspopup="true"
              onClick={handleResourcesMenuOpen}
              sx={{ 
                borderRadius: 8, 
                px: 2,
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                } 
              }}
              endIcon={<ArrowDropDown />}
              startIcon={<Article />}
            >
              Our Resources
            </Button>
            <Menu
              open={resourcesMenuOpen}
              anchorEl={resourcesAnchorEl}
              onClose={handleResourcesMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 0.5,
                  borderRadius: 2,
                  minWidth: 180,
                }
              }}
            >
              <MenuItem component={Link} to="/blog" onClick={handleResourcesMenuClose}>
                <Article sx={{ mr: 1.5 }} fontSize="small" /> Blog
              </MenuItem>
              <MenuItem component={Link} to="/ai-hub" onClick={handleResourcesMenuClose}>
                <Code sx={{ mr: 1.5 }} fontSize="small" /> AI Hub
              </MenuItem>
              <MenuItem component={Link} to="/career/fair-registration" onClick={handleResourcesMenuClose}>
                <Work sx={{ mr: 1.5 }} fontSize="small" /> Career Fair
              </MenuItem>
              <MenuItem component={Link} to="/activities-album" onClick={handleResourcesMenuClose}>
                <People sx={{ mr: 1.5 }} fontSize="small" /> Activities Album
              </MenuItem>
            </Menu>
            <Button 
              color="inherit"
              aria-haspopup="true"
              onClick={handleServicesMenuOpen}
              sx={{ 
                borderRadius: 8, 
                px: 2,
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                } 
              }}
              endIcon={<ArrowDropDown />}
              startIcon={<ServicesIcon />}
            >
              Our Programs
            </Button>
            <MegaMenu 
              open={servicesMenuOpen} 
              anchorEl={servicesAnchorEl} 
              handleClose={handleServicesMenuClose} 
            />
            <Button 
              variant="contained"
              color="secondary"
              component={Link} 
              to="/donate"
              sx={{ 
                borderRadius: 8, 
                px: 3,
                ml: 1,
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 14px 0 rgba(233, 30, 99, 0.4)',
                '&:hover': { 
                  backgroundColor: '#c2185b',
                  boxShadow: '0 6px 20px 0 rgba(233, 30, 99, 0.5)'
                } 
              }}
              startIcon={<DonateIcon />}
            >
              Donate Now
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          {!isMobile && (
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
              <Select
                value={language}
                onChange={handleLanguageChange}
                displayEmpty
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
                    <Translate sx={{ mr: 1, fontSize: 16 }} />
                    {value.toUpperCase()}
                  </Box>
                )}
                sx={{ 
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-icon': { color: '#fff' }
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية (Arabic)</MenuItem>
                <MenuItem value="fr">Français (French)</MenuItem>
                <MenuItem value="es">Español (Spanish)</MenuItem>
                <MenuItem value="fa">فارسی (Persian)</MenuItem>
                <MenuItem value="sw">Kiswahili (Swahili)</MenuItem>
              </Select>
            </FormControl>
          )}

          {!isAuthenticated ? (
            <Box>
              {!isMobile && (
                <>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    component={Link} 
                    to="/login"
                    sx={{ borderRadius: 8, mr: 1 }}
                  >
                    <Login sx={{ mr: 0.5 }} /> Login
                  </Button>
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/register"
                    sx={{ 
                      borderRadius: 8, 
                      borderColor: 'rgba(255,255,255,0.5)', 
                      color: '#fff',
                      '&:hover': {
                        borderColor: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
              {isMobile && (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  component={Link} 
                  to="/login"
                  sx={{ borderRadius: 8 }}
                >
                  <Login />
                </Button>
              )}
            </Box>
          ) : (
            <Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ 
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: 2,
                    mt: 1.5,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My Account</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
