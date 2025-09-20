import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExperienceForm from '../../components/volunteer/ExperienceForm';

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

describe('ExperienceForm Component', () => {
  const mockFormData = {
    volunteerExperience: [],
    relevantWorkExperience: [],
    communityInvolvement: ''
  };
  
  const mockHandleChange = jest.fn();
  
  beforeEach(() => {
    mockHandleChange.mockClear();
  });
  
  test('renders all form fields correctly', () => {
    render(
      <ExperienceForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Check if title is rendered
    expect(screen.getByText(/Past Experience/i)).toBeInTheDocument();
    
    // Check if volunteer experience section is rendered
    expect(screen.getByText(/Previous Volunteer Experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Organization Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role\/Position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description of Duties/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Experience/i)).toBeInTheDocument();
    
    // Check if work experience section is rendered
    expect(screen.getByText(/Relevant Work Experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company\/Organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Relevant Skills & Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Work Experience/i)).toBeInTheDocument();
    
    // Check if community involvement section is rendered
    expect(screen.getByText(/Community Involvement/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Community Activities & Involvement/i)).toBeInTheDocument();
  });
  
  test('updates form data when fields change', async () => {
    render(
      <ExperienceForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // Type in community involvement field
    await user.type(screen.getByLabelText(/Community Activities & Involvement/i), 'I volunteer at the local food bank');
    expect(mockHandleChange).toHaveBeenCalledWith('communityInvolvement', 'I volunteer at the local food bank');
  });
  
  test('adds volunteer experience when form is filled and button clicked', async () => {
    render(
      <ExperienceForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // Fill out volunteer experience form
    await user.type(screen.getByLabelText(/Organization Name/i), 'Red Cross');
    await user.type(screen.getByLabelText(/Role\/Position/i), 'Disaster Relief Volunteer');
    
    // Get the start date input and set a value
    const startDateInput = screen.getByLabelText(/Start Date/i);
    await user.type(startDateInput, '2022-01');
    
    // Get the end date input and set a value
    const endDateInput = screen.getByLabelText(/End Date/i);
    await user.type(endDateInput, '2023-01');
    
    await user.type(screen.getByLabelText(/Description of Duties/i), 'Helped with disaster relief efforts');
    
    // Click the Add Experience button
    const addButton = screen.getByText(/Add Experience/i);
    await user.click(addButton);
    
    // Check if handleChange was called with the correct values
    expect(mockHandleChange).toHaveBeenCalledWith('volunteerExperience', expect.arrayContaining([
      expect.objectContaining({
        organization: 'Red Cross',
        role: 'Disaster Relief Volunteer',
        startDate: '2022-01',
        endDate: '2023-01',
        description: 'Helped with disaster relief efforts'
      })
    ]));
  });
  
  test('adds work experience when form is filled and button clicked', async () => {
    render(
      <ExperienceForm 
        formData={mockFormData} 
        handleChange={mockHandleChange} 
      />
    );
    
    const user = userEvent.setup();
    
    // Fill out work experience form
    await user.type(screen.getByLabelText(/Company\/Organization/i), 'ABC Company');
    await user.type(screen.getByLabelText(/Position/i), 'Project Manager');
    
    // Get the work experience start date input and set a value
    const startDateInputs = screen.getAllByLabelText(/Start Date/i);
    await user.type(startDateInputs[1], '2020-01');
    
    // Get the work experience end date input and set a value
    const endDateInputs = screen.getAllByLabelText(/End Date/i);
    await user.type(endDateInputs[1], '2022-01');
    
    await user.type(screen.getByLabelText(/Relevant Skills & Experience/i), 'Project management, team leadership');
    
    // Click the Add Work Experience button
    const addButton = screen.getByText(/Add Work Experience/i);
    await user.click(addButton);
    
    // Check if handleChange was called with the correct values
    expect(mockHandleChange).toHaveBeenCalledWith('relevantWorkExperience', expect.arrayContaining([
      expect.objectContaining({
        company: 'ABC Company',
        position: 'Project Manager',
        startDate: '2020-01',
        endDate: '2022-01',
        relevantSkills: 'Project management, team leadership'
      })
    ]));
  });
  
  test('displays added experiences', () => {
    const mockFormDataWithExperiences = {
      volunteerExperience: [
        {
          id: 1,
          organization: 'Red Cross',
          role: 'Disaster Relief Volunteer',
          startDate: '2022-01',
          endDate: '2023-01',
          description: 'Helped with disaster relief efforts'
        }
      ],
      relevantWorkExperience: [
        {
          id: 2,
          company: 'ABC Company',
          position: 'Project Manager',
          startDate: '2020-01',
          endDate: '2022-01',
          relevantSkills: 'Project management, team leadership'
        }
      ],
      communityInvolvement: 'I volunteer at the local food bank'
    };
    
    render(
      <ExperienceForm 
        formData={mockFormDataWithExperiences} 
        handleChange={mockHandleChange} 
      />
    );
    
    // Check if added volunteer experience is displayed
    expect(screen.getByText(/Red Cross - Disaster Relief Volunteer/i)).toBeInTheDocument();
    expect(screen.getByText(/Helped with disaster relief efforts/i)).toBeInTheDocument();
    
    // Check if added work experience is displayed
    expect(screen.getByText(/ABC Company - Project Manager/i)).toBeInTheDocument();
    expect(screen.getByText(/Project management, team leadership/i)).toBeInTheDocument();
  });
});
