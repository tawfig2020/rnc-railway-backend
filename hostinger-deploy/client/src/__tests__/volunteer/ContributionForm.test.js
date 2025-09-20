import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContributionForm from '../../components/volunteer/ContributionForm';

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

describe('ContributionForm Component', () => {
  const mockFormData = {
    areasOfInterest: [],
    availabilityFrequency: '',
    startDate: '',
    availabilityTimes: [],
    motivation: '',
    heardAbout: '',
    additionalInfo: ''
  };
  
  const mockHandleChange = jest.fn();
  
  beforeEach(() => {
    mockHandleChange.mockClear();
  });
  
  test('renders all form fields correctly', () => {
    render(
      <ContributionForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Check if title is rendered
    expect(screen.getByText(/Areas of Contribution/i)).toBeInTheDocument();
    
    // Check if areas of interest section is rendered
    expect(screen.getByText(/Areas of Interest/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Areas of Interest/i)).toBeInTheDocument();
    
    // Check if availability section is rendered
    expect(screen.getByText(/Availability/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/How often can you volunteer\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Time Slots/i)).toBeInTheDocument();
    
    // Check if motivation section is rendered
    expect(screen.getByText(/Motivation & Additional Information/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Why do you want to volunteer with the Refugee Network Centre\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/How did you hear about us\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Additional Information/i)).toBeInTheDocument();
  });
  
  test('updates form data when fields change', async () => {
    render(
      <ContributionForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // Type in motivation field
    await user.type(
      screen.getByLabelText(/Why do you want to volunteer with the Refugee Network Centre\?/i), 
      'I want to make a difference in the lives of refugees'
    );
    expect(mockHandleChange).toHaveBeenCalledWith(
      'motivation', 
      'I want to make a difference in the lives of refugees'
    );
    
    // Type in additional info field
    await user.type(
      screen.getByLabelText(/Additional Information/i), 
      'I have previous experience working with refugees'
    );
    expect(mockHandleChange).toHaveBeenCalledWith(
      'additionalInfo', 
      'I have previous experience working with refugees'
    );
    
    // Set preferred start date
    const startDateInput = screen.getByLabelText(/Preferred Start Date/i);
    await user.type(startDateInput, '2023-07-15');
    expect(mockHandleChange).toHaveBeenCalledWith('startDate', '2023-07-15');
  });
  
  test('select fields work correctly', async () => {
    render(
      <ContributionForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // Open availability frequency dropdown
    await user.click(screen.getByLabelText(/How often can you volunteer\?/i));
    
    // Select an option (assuming 'Weekly' is an option)
    const weeklyOption = screen.getByText('Weekly');
    await user.click(weeklyOption);
    
    // Check if handleChange was called with correct values
    expect(mockHandleChange).toHaveBeenCalledWith('availabilityFrequency', 'Weekly');
    
    // Open heard about dropdown
    await user.click(screen.getByLabelText(/How did you hear about us\?/i));
    
    // Select an option (assuming 'Social Media' is an option)
    const socialMediaOption = screen.getByText('Social Media');
    await user.click(socialMediaOption);
    
    // Check if handleChange was called with correct values
    expect(mockHandleChange).toHaveBeenCalledWith('heardAbout', 'Social Media');
  });
  
  test('displays pre-selected values correctly', () => {
    const mockFormDataWithValues = {
      ...mockFormData,
      areasOfInterest: ['Education & Tutoring', 'Language Support & Translation'],
      availabilityFrequency: 'Weekly',
      startDate: '2023-07-15',
      availabilityTimes: ['Weekday mornings', 'Weekend afternoons'],
      motivation: 'I want to make a difference',
      heardAbout: 'Social Media',
      additionalInfo: 'I have previous experience'
    };
    
    render(
      <ContributionForm 
        formData={mockFormDataWithValues} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Check if areas of interest are displayed
    expect(screen.getByText('Education & Tutoring')).toBeInTheDocument();
    expect(screen.getByText('Language Support & Translation')).toBeInTheDocument();
    
    // Check if availability times are displayed
    expect(screen.getByText('Weekday mornings')).toBeInTheDocument();
    expect(screen.getByText('Weekend afternoons')).toBeInTheDocument();
    
    // Check if motivation text is displayed
    expect(screen.getByDisplayValue('I want to make a difference')).toBeInTheDocument();
    
    // Check if additional info text is displayed
    expect(screen.getByDisplayValue('I have previous experience')).toBeInTheDocument();
  });
});
