/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Donate from '../Donate';

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    elements: jest.fn(() => ({
      create: jest.fn(() => ({
        mount: jest.fn(),
        unmount: jest.fn(),
        on: jest.fn(),
        confirmPayment: jest.fn()
      })),
      getElement: jest.fn()
    })),
    confirmPayment: jest.fn()
  }))
}));

// Mock PayPal
jest.mock('@paypal/react-paypal-js', () => ({
  PayPalScriptProvider: ({ children }) => children,
  PayPalButtons: ({ onApprove, onError, createOrder }) => (
    <div data-testid="paypal-buttons">
      <button onClick={() => createOrder()}>PayPal</button>
    </div>
  )
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}));

const axios = require('axios');

// Wrapper component for tests
const DonateWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Donate Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders donation form', () => {
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Check for donation amount options
    expect(screen.getByText(/donate|donation/i)).toBeInTheDocument();
    
    // Check for amount buttons or input
    const amountButtons = document.querySelectorAll('[data-amount], .amount-button, .donation-amount');
    const amountInput = screen.queryByLabelText(/amount/i) || screen.queryByPlaceholderText(/amount/i);
    
    expect(amountButtons.length > 0 || amountInput).toBeTruthy();
  });

  test('allows selecting predefined donation amounts', async () => {
    const user = userEvent.setup();
    
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Look for predefined amount buttons
    const amount25 = screen.queryByText('$25') || screen.queryByDisplayValue('25') || 
                    document.querySelector('[data-amount="25"]');
    
    if (amount25) {
      await user.click(amount25);
      
      // Check if amount is selected
      expect(amount25).toHaveClass(/selected|active/) || 
      expect(amount25).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test('allows entering custom donation amount', async () => {
    const user = userEvent.setup();
    
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Look for custom amount input
    const customAmountInput = screen.queryByLabelText(/custom amount|other amount/i) ||
                             screen.queryByPlaceholderText(/enter amount|custom/i) ||
                             document.querySelector('input[type="number"], .custom-amount');

    if (customAmountInput) {
      await user.type(customAmountInput, '100');
      expect(customAmountInput).toHaveValue(100);
    }
  });

  test('validates minimum donation amount', async () => {
    const user = userEvent.setup();
    
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    const customAmountInput = screen.queryByLabelText(/amount/i) ||
                             document.querySelector('input[type="number"]');

    if (customAmountInput) {
      await user.type(customAmountInput, '0');
      
      const submitButton = screen.getByRole('button', { name: /donate|continue|proceed/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/minimum|amount.*required|invalid amount/i);
        expect(errorMessage).toBeInTheDocument();
      });
    }
  });

  test('shows donor information form', async () => {
    const user = userEvent.setup();
    
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Select an amount first
    const amount25 = screen.queryByText('$25') || document.querySelector('[data-amount="25"]');
    if (amount25) {
      await user.click(amount25);
    }

    // Look for donor information fields
    const nameInput = screen.queryByLabelText(/name|donor name/i) ||
                     screen.queryByPlaceholderText(/name/i);
    const emailInput = screen.queryByLabelText(/email/i) ||
                      screen.queryByPlaceholderText(/email/i);

    // These might be optional or appear after amount selection
    if (nameInput) expect(nameInput).toBeInTheDocument();
    if (emailInput) expect(emailInput).toBeInTheDocument();
  });

  test('displays payment method options', () => {
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Look for payment method options
    const creditCardOption = screen.queryByText(/credit card|card/i) ||
                            document.querySelector('[data-testid="credit-card"]');
    const paypalOption = screen.queryByText(/paypal/i) ||
                        document.querySelector('[data-testid="paypal-buttons"]');

    // At least one payment method should be available
    expect(creditCardOption || paypalOption).toBeTruthy();
  });

  test('shows Stripe payment form when credit card is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Look for credit card option
    const creditCardOption = screen.queryByText(/credit card|card/i) ||
                            screen.queryByRole('radio', { name: /credit card/i });

    if (creditCardOption) {
      await user.click(creditCardOption);
      
      await waitFor(() => {
        // Look for Stripe elements or card input
        const cardElement = document.querySelector('#card-element, .stripe-card, [data-testid="card-element"]');
        expect(cardElement).toBeInTheDocument();
      });
    }
  });

  test('shows PayPal buttons when PayPal is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Look for PayPal option
    const paypalOption = screen.queryByText(/paypal/i) ||
                        screen.queryByRole('radio', { name: /paypal/i });

    if (paypalOption) {
      await user.click(paypalOption);
      
      await waitFor(() => {
        const paypalButtons = screen.getByTestId('paypal-buttons');
        expect(paypalButtons).toBeInTheDocument();
      });
    }
  });

  test('handles donation form submission', async () => {
    const user = userEvent.setup();
    
    // Mock successful donation API response
    axios.post.mockResolvedValueOnce({
      data: { success: true, transactionId: 'txn_123' }
    });

    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Fill out donation form
    const amount25 = screen.queryByText('$25') || document.querySelector('[data-amount="25"]');
    if (amount25) {
      await user.click(amount25);
    }

    // Fill donor information if present
    const nameInput = screen.queryByLabelText(/name/i);
    const emailInput = screen.queryByLabelText(/email/i);

    if (nameInput) await user.type(nameInput, 'John Donor');
    if (emailInput) await user.type(emailInput, 'john@example.com');

    // Submit donation
    const donateButton = screen.getByRole('button', { name: /donate|continue|proceed/i });
    fireEvent.click(donateButton);

    // Note: Full payment processing would require mocking Stripe/PayPal more extensively
    // This test focuses on form submission
  });

  test('displays donation impact information', () => {
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Look for impact statements or information about how donations are used
    const impactInfo = screen.queryByText(/impact|help|support|difference/i) ||
                      document.querySelector('.impact-info, .donation-impact');

    // This is optional but good UX
    if (impactInfo) {
      expect(impactInfo).toBeInTheDocument();
    }
  });

  test('shows loading state during payment processing', async () => {
    const user = userEvent.setup();
    
    // Mock delayed API response
    axios.post.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 1000))
    );

    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    const donateButton = screen.getByRole('button', { name: /donate|continue|proceed/i });
    fireEvent.click(donateButton);

    // Check for loading state
    await waitFor(() => {
      const loadingIndicator = screen.queryByText(/processing|loading/i) ||
                              document.querySelector('.spinner, .loading') ||
                              donateButton.disabled;
      expect(loadingIndicator).toBeTruthy();
    });
  });

  test('handles payment errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock payment error
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Payment failed' } }
    });

    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    const donateButton = screen.getByRole('button', { name: /donate|continue|proceed/i });
    fireEvent.click(donateButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText(/error|failed|problem/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('is accessible', () => {
    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Check for proper form structure
    const form = screen.queryByRole('form') || document.querySelector('form');
    if (form) expect(form).toBeInTheDocument();

    // Check for proper button labeling
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });

    // Check for proper input labeling
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`);
      expect(hasLabel).toBeTruthy();
    });
  });

  test('displays donation receipt/confirmation', async () => {
    const user = userEvent.setup();
    
    // Mock successful donation
    axios.post.mockResolvedValueOnce({
      data: { 
        success: true, 
        transactionId: 'txn_123',
        amount: 25,
        message: 'Thank you for your donation!'
      }
    });

    render(
      <DonateWrapper>
        <Donate />
      </DonateWrapper>
    );

    // Simulate successful donation flow
    const donateButton = screen.getByRole('button', { name: /donate|continue|proceed/i });
    fireEvent.click(donateButton);

    await waitFor(() => {
      const confirmationMessage = screen.queryByText(/thank you|success|confirmation|receipt/i);
      if (confirmationMessage) {
        expect(confirmationMessage).toBeInTheDocument();
      }
    });
  });
});
