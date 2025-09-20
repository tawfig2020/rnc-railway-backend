/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Register from '../Register';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const axios = require('axios');

// Wrapper component for tests
const RegisterWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form', () => {
    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    // Check for form elements
    expect(screen.getByLabelText(/first name/i) || screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i) || screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i) || screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register|sign up|create account/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty form submission', async () => {
    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /register|sign up|create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Look for validation error messages
      const errorMessages = document.querySelectorAll('.error, .invalid-feedback, .field-error, .text-danger');
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /register|sign up|create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Look for email validation error
      const emailError = document.querySelector('[data-field="email"] .error, .email-error') ||
                        screen.queryByText(/valid email|email format/i);
      expect(emailError).toBeInTheDocument();
    });
  });

  test('validates password requirements', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    const passwordInput = screen.getByLabelText(/^password/i) || screen.getByPlaceholderText(/^password/i);
    await user.type(passwordInput, '123'); // Weak password

    const submitButton = screen.getByRole('button', { name: /register|sign up|create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Look for password validation error
      const passwordError = document.querySelector('[data-field="password"] .error, .password-error') ||
                           screen.queryByText(/password.*strong|password.*requirements/i);
      expect(passwordError).toBeInTheDocument();
    });
  });

  test('validates password confirmation match', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    const passwordInput = screen.getByLabelText(/^password/i) || screen.getByPlaceholderText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password|repeat password/i) || 
                                screen.getByPlaceholderText(/confirm password|repeat password/i);

    if (confirmPasswordInput) {
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'DifferentPassword123!');

      const submitButton = screen.getByRole('button', { name: /register|sign up|create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Look for password match error
        const matchError = document.querySelector('[data-field="confirmPassword"] .error, .password-match-error') ||
                          screen.queryByText(/passwords.*match|passwords.*same/i);
        expect(matchError).toBeInTheDocument();
      });
    }
  });

  test('successful registration', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    axios.post.mockResolvedValueOnce({
      data: { message: 'Registration successful', user: { id: 1, email: 'test@example.com' } }
    });

    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    // Fill out the form
    const firstNameInput = screen.getByLabelText(/first name/i) || screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i) || screen.getByPlaceholderText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i) || screen.getByPlaceholderText(/^password/i);

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(passwordInput, 'SecurePassword123!');

    const confirmPasswordInput = screen.queryByLabelText(/confirm password|repeat password/i);
    if (confirmPasswordInput) {
      await user.type(confirmPasswordInput, 'SecurePassword123!');
    }

    const submitButton = screen.getByRole('button', { name: /register|sign up|create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/auth/register',
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'SecurePassword123!'
        })
      );
    });

    // Check for success message or navigation
    await waitFor(() => {
      const successMessage = screen.queryByText(/success|registered|account created/i);
      if (successMessage) {
        expect(successMessage).toBeInTheDocument();
      } else {
        // Should navigate to login or verification page
        expect(mockNavigate).toHaveBeenCalled();
      }
    });
  });

  test('handles registration API error', async () => {
    const user = userEvent.setup();
    
    // Mock API error response
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } }
    });

    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    // Fill out the form
    const firstNameInput = screen.getByLabelText(/first name/i) || screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i) || screen.getByPlaceholderText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i) || screen.getByPlaceholderText(/^password/i);

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'SecurePassword123!');

    const submitButton = screen.getByRole('button', { name: /register|sign up|create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Look for error message
      const errorMessage = screen.queryByText(/email already exists|error|failed/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('shows loading state during registration', async () => {
    const user = userEvent.setup();
    
    // Mock delayed API response
    axios.post.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: { message: 'Success' } }), 1000))
    );

    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    // Fill out the form
    const firstNameInput = screen.getByLabelText(/first name/i) || screen.getByPlaceholderText(/first name/i);
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i) || screen.getByPlaceholderText(/^password/i);

    await user.type(firstNameInput, 'John');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'SecurePassword123!');

    const submitButton = screen.getByRole('button', { name: /register|sign up|create account/i });
    fireEvent.click(submitButton);

    // Check for loading state
    await waitFor(() => {
      const loadingIndicator = screen.queryByText(/loading|registering|creating/i) ||
                              document.querySelector('.spinner, .loading');
      expect(loadingIndicator || submitButton.disabled).toBeTruthy();
    });
  });

  test('has link to login page', () => {
    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    const loginLink = screen.getByText(/already have an account|sign in|login/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  test('form is accessible', () => {
    render(
      <RegisterWrapper>
        <Register />
      </RegisterWrapper>
    );

    // Check for proper form structure
    const form = screen.getByRole('form') || document.querySelector('form');
    expect(form).toBeInTheDocument();

    // Check for proper labeling
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      // Each input should have a label or aria-label
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`);
      expect(hasLabel).toBeTruthy();
    });

    // Check submit button
    const submitButton = screen.getByRole('button', { name: /register|sign up|create account/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
