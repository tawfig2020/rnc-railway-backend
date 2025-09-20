import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkillsForm from '../../components/volunteer/SkillsForm';

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

describe('SkillsForm Component', () => {
  const mockFormData = {
    profession: '',
    currentEmployer: '',
    jobTitle: '',
    yearsOfExperience: '',
    skillsList: [],
    computerSkills: [],
    languageSkills: ''
  };
  
  const mockHandleChange = jest.fn();
  
  beforeEach(() => {
    mockHandleChange.mockClear();
  });
  
  test('renders all form fields correctly', () => {
    render(
      <SkillsForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Check if title is rendered
    expect(screen.getByText(/Skills & Profession/i)).toBeInTheDocument();
    
    // Check if all required fields are rendered
    expect(screen.getByLabelText(/Current Profession/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Employer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Years of Experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Skills/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Computer Skills/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Language Skills Details/i)).toBeInTheDocument();
  });
  
  test('updates form data when fields change', async () => {
    render(
      <SkillsForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // Type in profession field
    await user.type(screen.getByLabelText(/Current Profession/i), 'Teacher');
    expect(mockHandleChange).toHaveBeenCalledWith('profession', 'Teacher');
    
    // Type in current employer field
    await user.type(screen.getByLabelText(/Current Employer/i), 'ABC School');
    expect(mockHandleChange).toHaveBeenCalledWith('currentEmployer', 'ABC School');
    
    // Type in job title field
    await user.type(screen.getByLabelText(/Job Title/i), 'English Teacher');
    expect(mockHandleChange).toHaveBeenCalledWith('jobTitle', 'English Teacher');
    
    // Type in years of experience field
    await user.type(screen.getByLabelText(/Years of Experience/i), '5');
    expect(mockHandleChange).toHaveBeenCalledWith('yearsOfExperience', '5');
    
    // Type in language skills field
    await user.type(screen.getByLabelText(/Language Skills Details/i), 'English (Native), Spanish (Conversational)');
    expect(mockHandleChange).toHaveBeenCalledWith('languageSkills', 'English (Native), Spanish (Conversational)');
  });
  
  test('select fields work correctly', async () => {
    // Create a modified mockFormData with some initial values to test multi-select
    const mockFormDataWithValues = {
      ...mockFormData,
      skillsList: ['Teaching/Tutoring'],
      computerSkills: ['Microsoft Office Suite']
    };
    
    render(
      <SkillsForm 
        formData={mockFormDataWithValues} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Verify that the initial values are displayed
    expect(screen.getByText('Teaching/Tutoring')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Office Suite')).toBeInTheDocument();
  });
});
