import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalInfoForm from '../../components/volunteer/PersonalInfoForm';

// Mock theme
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    palette: {
      primary: { main: '#2A7D6F' },
      secondary: { main: '#D56C42' },
      text: { primary: '#333', secondary: '#666' }
    }
  })
}));

describe('PersonalInfoForm Component', () => {
  const mockFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    gender: '',
    ethnicity: '',
    languages: []
  };
  
  const mockHandleChange = jest.fn();
  
  beforeEach(() => {
    mockHandleChange.mockClear();
  });
  
  test('renders all form fields correctly', () => {
    render(
      <PersonalInfoForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Check if title is rendered
    expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();
    
    // Check if all required fields are rendered
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State\/Province/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zip\/Postal Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
  });
  
  test('updates form data when fields change', async () => {
    render(
      <PersonalInfoForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // Type in first name field
    await user.type(screen.getByLabelText(/First Name/i), 'John');
    expect(mockHandleChange).toHaveBeenCalledWith('firstName', 'John');
    
    // Type in last name field
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    expect(mockHandleChange).toHaveBeenCalledWith('lastName', 'Doe');
    
    // Type in email field
    await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
    expect(mockHandleChange).toHaveBeenCalledWith('email', 'john.doe@example.com');
    
    // Type in phone field
    await user.type(screen.getByLabelText(/Phone/i), '1234567890');
    expect(mockHandleChange).toHaveBeenCalledWith('phone', '1234567890');
  });
  
  test('select fields work correctly', async () => {
    render(
      <PersonalInfoForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // Open gender dropdown
    await user.click(screen.getByLabelText(/Gender/i));
    
    // Select an option (assuming 'Male' is an option)
    const maleOption = screen.getByText('Male');
    await user.click(maleOption);
    
    // Check if handleChange was called with correct values
    expect(mockHandleChange).toHaveBeenCalledWith('gender', 'Male');
  });
});
