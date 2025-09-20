import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

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

describe('HomePage Component', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('renders hero section with correct buttons', () => {
    renderWithRouter(<HomePage />);
    
    // Check if hero title is rendered
    expect(screen.getByText(/Empowering Refugees/i)).toBeInTheDocument();
    
    // Check if hero buttons are rendered with correct links
    const exploreButton = screen.getByRole('link', { name: /Explore Our Programs/i });
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton.getAttribute('href')).toBe('/our-services');
    
    const joinProgramButton = screen.getByRole('link', { name: /Join Program/i });
    expect(joinProgramButton).toBeInTheDocument();
    expect(joinProgramButton.getAttribute('href')).toBe('/program-registration');
  });

  test('renders call-to-action buttons with correct links', () => {
    renderWithRouter(<HomePage />);
    
    // Check if the Volunteer button links to the correct route
    const volunteerButton = screen.getByRole('link', { name: /Volunteer/i });
    expect(volunteerButton).toBeInTheDocument();
    expect(volunteerButton.getAttribute('href')).toBe('/volunteer-application');
    
    // Check if the Partner button links to the correct route
    const partnerButton = screen.getByRole('link', { name: /Become a Partner/i });
    expect(partnerButton).toBeInTheDocument();
    expect(partnerButton.getAttribute('href')).toBe('/partnership-application');
  });

  test('renders static cards (formerly flip cards) correctly', () => {
    renderWithRouter(<HomePage />);
    
    // Check if the cards are rendered
    const cardTitles = [
      'Education & Training',
      'Career Development',
      'Social Integration',
      'Marketplace'
    ];
    
    cardTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('renders testimonial section correctly', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText(/What Our Community Says/i)).toBeInTheDocument();
    // Check for at least one testimonial
    expect(screen.getByText(/Sarah M/i)).toBeInTheDocument();
  });
});
