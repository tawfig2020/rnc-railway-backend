import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import { 
  Category as CategoryIcon,
  LocalOffer as DiscountIcon,
  Star as StarIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import CategoryManagement from './CategoryManagement';
import DiscountManagement from './DiscountManagement';
import FeaturedProductsManagement from './FeaturedProductsManagement';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`marketplace-tabpanel-${index}`}
      aria-labelledby={`marketplace-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `marketplace-tab-${index}`,
    'aria-controls': `marketplace-tabpanel-${index}`,
  };
}

const MarketplaceManagement = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Marketplace Management
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="marketplace management tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<CategoryIcon />} label="Categories" {...a11yProps(0)} />
            <Tab icon={<DiscountIcon />} label="Discounts" {...a11yProps(1)} />
            <Tab icon={<StarIcon />} label="Featured Products" {...a11yProps(2)} />
            <Tab icon={<StoreIcon />} label="Analytics" {...a11yProps(3)} disabled />
          </Tabs>
        </Box>
        
        <TabPanel value={activeTab} index={0}>
          <CategoryManagement />
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <DiscountManagement />
        </TabPanel>
        
        <TabPanel value={activeTab} index={2}>
          <FeaturedProductsManagement />
        </TabPanel>
        
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Marketplace Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Coming soon - Analytics dashboard for marketplace metrics
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default MarketplaceManagement;
