import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VolunteerApplication from '../pages/VolunteerApplication';
import userEvent from '@testing-library/user-event';

// Mock any necessary providers or context
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    palette: {
      primary: { main: '#2A7D6F' },
      secondary: { main: '#D56C42' },
      text: { primary: '#333', secondary: '#666' },
      background: { default: '#fff', paper: '#f5f5f5' }
    },
    spacing: (factor) => `${8 * factor}px`
  })
}));

describe('VolunteerApplication Component', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('renders the volunteer application form with correct title', () => {
    renderWithRouter(<VolunteerApplication />);
    
    expect(screen.getByText(/Volunteer Application/i)).toBeInTheDocument();
    expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();
  });

  test('navigates through form steps correctly', async () => {
    renderWithRouter(<VolunteerApplication />);
    const user = userEvent.setup();
    
    // Check if we're on the first step (Personal Information)
    expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();
    
    // Fill out some required fields in the first step
    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
    await user.type(screen.getByLabelText(/Phone/i), '1234567890');
    
    // Click Next button
    const nextButton = screen.getByRole('button', { name: /Next/i });
    await user.click(nextButton);
    
    // Check if we're on the second step (Education)
    await waitFor(() => {
      expect(screen.getByText(/Education Background/i)).toBeInTheDocument();
    });
    
    // Click Next button again
    await user.click(screen.getByRole('button', { name: /Next/i }));
    
    // Check if we're on the third step (Skills)
    await waitFor(() => {
      expect(screen.getByText(/Skills & Profession/i)).toBeInTheDocument();
    });
    
    // Click Next button again
    await user.click(screen.getByRole('button', { name: /Next/i }));
    
    // Check if we're on the fourth step (Experience)
    await waitFor(() => {
      expect(screen.getByText(/Past Experience/i)).toBeInTheDocument();
    });
    
    // Click Next button again
    await user.click(screen.getByRole('button', { name: /Next/i }));
    
    // Check if we're on the fifth step (Contribution)
    await waitFor(() => {
      expect(screen.getByText(/Areas of Contribution/i)).toBeInTheDocument();
    });
    
    // Check if we can go back
    const backButton = screen.getByRole('button', { name: /Back/i });
    await user.click(backButton);
    
    // Check if we're back on the fourth step
    await waitFor(() => {
      expect(screen.getByText(/Past Experience/i)).toBeInTheDocument();
    });
  });

  test('form submission works correctly', async () => {
    renderWithRouter(<VolunteerApplication />);
    const user = userEvent.setup();
    
    // Navigate to the last step
    for (let i = 0; i < 4; i++) {
      await user.click(screen.getByRole('button', { name: /Next/i }));
      await waitFor(() => {
        // Just wait for the next step to render
        expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
      });
    }
    
    // Check if we're on the last step
    await waitFor(() => {
      expect(screen.getByText(/Areas of Contribution/i)).toBeInTheDocument();
    });
    
    // Check if the Submit button is available on the last step
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    
    // Click the Submit button
    await user.click(screen.getByRole('button', { name: /Submit/i }));
    
    // Check for submission confirmation (this might vary based on your implementation)
    await waitFor(() => {
      // This assumes you show some kind of success message after submission
      // Adjust this expectation based on your actual implementation
      expect(screen.getByText(/Thank you for your application/i)).toBeInTheDocument();
    });
  });
});
