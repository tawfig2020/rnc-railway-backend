import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AvailabilityForm from '../../components/career-fair/AvailabilityForm';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a mock theme for testing
const theme = createTheme({
  palette: {
    primary: { main: '#2A7D6F' },
    secondary: { main: '#D56C42' },
    success: { main: '#4CAF50' },
    text: { primary: '#333', secondary: '#666' }
  }
});

// Mock form data and handler
const mockFormData = {
  availableDates: [],
  preferredTimeSlots: [],
  interviewPreference: '',
  specialAssistance: '',
  dietaryRestrictions: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  }
};

const mockHandleChange = jest.fn();

describe('AvailabilityForm Component', () => {
  const renderWithTheme = (ui) => {
    return render(
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    mockHandleChange.mockClear();
  });

  test('renders all form sections', () => {
    renderWithTheme(
      <AvailabilityForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Check if main sections are rendered
    expect(screen.getByText('Availability & Preferences')).toBeInTheDocument();
    expect(screen.getByText('Date Availability')).toBeInTheDocument();
    expect(screen.getByText('Time Preferences')).toBeInTheDocument();
    expect(screen.getByText('Interview Preferences')).toBeInTheDocument();
    expect(screen.getByText('Special Accommodations')).toBeInTheDocument();
    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
  });

  test('handles date selection correctly', () => {
    renderWithTheme(
      <AvailabilityForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Find and click on a date chip
    const dateChip = screen.getByText(/Tuesday, July 15, 2025/i);
    fireEvent.click(dateChip);
    
    // Check if handleChange was called with correct arguments
    expect(mockHandleChange).toHaveBeenCalledWith(
      null, 
      'availableDates', 
      ['2025-07-15']
    );
  });

  test('handles time slot selection correctly', () => {
    renderWithTheme(
      <AvailabilityForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Find and click on a time slot chip
    const timeSlotChip = screen.getByText('09:00 - 11:00');
    fireEvent.click(timeSlotChip);
    
    // Check if handleChange was called with correct arguments
    expect(mockHandleChange).toHaveBeenCalledWith(
      null, 
      'preferredTimeSlots', 
      ['09:00 - 11:00']
    );
  });

  test('handles interview preference selection correctly', () => {
    renderWithTheme(
      <AvailabilityForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Find and click on an interview preference radio button
    const inPersonOption = screen.getByLabelText('In-person at the career fair');
    fireEvent.click(inPersonOption);
    
    // Check if handleChange was called with correct arguments
    expect(mockHandleChange).toHaveBeenCalled();
  });

  test('handles emergency contact information correctly', () => {
    renderWithTheme(
      <AvailabilityForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Find and fill in emergency contact name field
    const nameField = screen.getByLabelText(/Contact Name/i);
    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    
    // Check if handleChange was called with correct arguments
    expect(mockHandleChange).toHaveBeenCalledWith(
      'emergencyContact', 
      'name', 
      'John Doe'
    );
  });

  test('displays validation message when no dates are selected', () => {
    renderWithTheme(
      <AvailabilityForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Check if validation message is displayed
    expect(screen.getByText('Please select at least one date.')).toBeInTheDocument();
  });

  test('displays validation message when no time slots are selected', () => {
    renderWithTheme(
      <AvailabilityForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Check if validation message is displayed
    expect(screen.getByText('Please select at least one time slot.')).toBeInTheDocument();
  });
});
