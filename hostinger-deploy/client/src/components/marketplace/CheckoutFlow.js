import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Check as ConfirmIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddressBook from './AddressBook';

const steps = ['Review Cart', 'Shipping Address', 'Payment', 'Confirmation'];

const CheckoutFlow = ({ cart, setCart, calculateTotal }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Billing same as shipping flag
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  
  // Order notes
  const [orderNotes, setOrderNotes] = useState('');

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };
  
  const handleBillingAddressSelect = (address) => {
    setSelectedBillingAddress(address);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      // Last step, place order
      placeOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0: // Cart Review
        return cart && cart.length > 0;
      case 1: // Shipping Address
        return selectedAddress && (billingSameAsShipping || selectedBillingAddress);
      case 2: // Payment
        return paymentMethod;
      default:
        return true;
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Calculate pricing
      const totalPrice = calculateTotal();
      const taxPrice = totalPrice * 0.07; // 7% tax example
      const shippingPrice = 5.99; // Fixed shipping rate example
      const finalTotal = totalPrice + taxPrice + shippingPrice;
      
      // Create order payload
      const orderData = {
        items: cart.map(item => ({
          productId: item._id || item.product,  // Handle both formats
          quantity: item.quantity,
          // Other fields are handled by backend now
        })),
        paymentMethod,
        paymentInfo: {
          // In a real app, you'd include payment gateway response details here
          status: 'succeeded',
          id: 'mock_payment_id_' + Date.now()
        },
        taxPrice,
        shippingPrice,
        totalPrice: finalTotal,
        orderNotes,
        billingAddressSameAsShipping: billingSameAsShipping
      };
      
      // If we're using saved addresses (from AddressBook), pass their IDs
      if (selectedAddress && selectedAddress._id) {
        orderData.shippingAddressId = selectedAddress._id;
      } else if (selectedAddress) {
        // Otherwise pass the full address object
        orderData.shippingAddress = {
          fullName: selectedAddress.fullName,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2 || '',
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone,
          deliveryInstructions: selectedAddress.deliveryInstructions || ''
        };
      }
      
      // Handle billing address if different from shipping
      if (!billingSameAsShipping && selectedBillingAddress) {
        if (selectedBillingAddress._id) {
          orderData.billingAddressId = selectedBillingAddress._id;
        } else {
          orderData.billingAddress = {
            fullName: selectedBillingAddress.fullName,
            addressLine1: selectedBillingAddress.addressLine1,
            addressLine2: selectedBillingAddress.addressLine2 || '',
            city: selectedBillingAddress.city,
            state: selectedBillingAddress.state,
            postalCode: selectedBillingAddress.postalCode,
            country: selectedBillingAddress.country,
            phone: selectedBillingAddress.phone
          };
        }
      }
      
      // Place the order
      const res = await axios.post('/api/orders', orderData, {
        headers: { 'x-auth-token': token }
      });
      
      setOrderDetails(res.data);
      setOrderNumber(res.data._id);
      setOrderComplete(true);
      
      // Clear cart
      setCart([]);
      localStorage.removeItem('cart');
      
      // Move to confirmation step
      setActiveStep((prevStep) => prevStep + 1);
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Unable to place your order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Render cart items for review
  const renderCartReview = () => {
    if (!cart || cart.length === 0) {
      return (
        <Box py={3} textAlign="center">
          <Typography variant="h6" gutterBottom>Your cart is empty</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/marketplace')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      );
    }
    
    const subtotal = calculateTotal();
    
    return (
      <Box>
        <List>
          {cart.map((item) => (
            <ListItem key={item._id} sx={{ py: 1, px: 0 }}>
              <ListItemAvatar>
                <Avatar 
                  alt={item.name} 
                  src={item.images && item.images.length > 0 ? item.images[0] : undefined} 
                  variant="rounded"
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body1">
                ${((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>
        
        <Box mt={2} p={2} bgcolor="#f9f9f9">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">Subtotal:</Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body1">Shipping:</Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography variant="body1">$5.99</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body1">Tax (7%):</Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography variant="body1">${(subtotal * 0.07).toFixed(2)}</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="h6">Total:</Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography variant="h6">${(subtotal + 5.99 + (subtotal * 0.07)).toFixed(2)}</Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Box mt={2}>
          <TextField
            fullWidth
            label="Order Notes (Optional)"
            name="orderNotes"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            multiline
            rows={3}
            placeholder="Special instructions for your order"
          />
        </Box>
      </Box>
    );
  };

  // Render shipping address selection
  const renderShippingAddress = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Select Shipping Address</Typography>
        <AddressBook onAddressSelect={handleAddressSelect} selectedAddressId={selectedAddress?._id} />
        
        <Box mt={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={billingSameAsShipping}
                onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                name="billingSameAsShipping"
                color="primary"
              />
            }
            label="Billing address same as shipping"
          />
        </Box>
        
        {!billingSameAsShipping && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>Select Billing Address</Typography>
            <AddressBook onAddressSelect={handleBillingAddressSelect} selectedAddressId={selectedBillingAddress?._id} />
          </Box>
        )}
      </Box>
    );
  };

  // Render payment options
  const renderPayment = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Payment Method</Typography>
        
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="payment-method"
              name="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="credit_card" control={<Radio />} label="Credit Card" />
              <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
              <FormControlLabel value="bank_transfer" control={<Radio />} label="Bank Transfer" />
            </RadioGroup>
          </FormControl>
          
          {paymentMethod === 'credit_card' && (
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Note: This is a demo version. No actual payment will be processed.
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVC"
                    placeholder="123"
                    disabled
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {paymentMethod === 'paypal' && (
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                You will be redirected to PayPal to complete your payment.
                (Demo version - no redirect will happen)
              </Typography>
            </Box>
          )}
          
          {paymentMethod === 'bank_transfer' && (
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Please transfer the total amount to our bank account.
                Your order will be processed once payment is confirmed.
                (Demo version - no actual transfer required)
              </Typography>
            </Box>
          )}
        </Paper>
        
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>Order Summary</Typography>
          
          <Box p={2} bgcolor="#f9f9f9">
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">Items Total:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2">${calculateTotal().toFixed(2)}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">Shipping:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2">$5.99</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">Tax:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2">${(calculateTotal() * 0.07).toFixed(2)}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  ${(calculateTotal() + 5.99 + (calculateTotal() * 0.07)).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  };

  // Render order confirmation
  const renderConfirmation = () => {
    if (!orderComplete) return <CircularProgress />;
    
    return (
      <Box textAlign="center">
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar sx={{ bgcolor: 'success.main', width: 60, height: 60 }}>
            <ConfirmIcon sx={{ fontSize: 40 }} />
          </Avatar>
        </Box>
        
        <Typography variant="h5" gutterBottom>
          Thank you for your order!
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Your order number is <strong>#{orderNumber}</strong>
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          We&apos;ve sent you an email with your order confirmation and details.
          You can track your order status in your account dashboard.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/marketplace')}
          sx={{ mt: 3 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  };

  // Render the current step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderCartReview();
      case 1:
        return renderShippingAddress();
      case 2:
        return renderPayment();
      case 3:
        return renderConfirmation();
      default:
        return 'Unknown step';
    }
  };

  // Custom icon for each step
  const getStepIcon = (index) => {
    switch (index) {
      case 0:
        return <CartIcon />;
      case 1:
        return <ShippingIcon />;
      case 2:
        return <PaymentIcon />;
      case 3:
        return <ConfirmIcon />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mb: 8 }}>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, pt: 2 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={() => getStepIcon(index)}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box>{getStepContent(activeStep)}</Box>
        
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || activeStep === steps.length - 1}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!canProceed() || loading || activeStep === steps.length - 1}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 2 ? (
              'Place Order'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutFlow;
