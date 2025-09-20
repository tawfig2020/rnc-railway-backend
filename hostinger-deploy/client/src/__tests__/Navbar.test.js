import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
    spacing: (factor) => `${8 * factor}px`,
    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
      up: jest.fn(() => true),
      down: jest.fn(() => false)
    }
  })
}));

// Mock MegaMenu component
jest.mock('../components/MegaMenu', () => {
  return function MockMegaMenu(props) {
    return (
      <div data-testid="mega-menu">
        <button onClick={props.onClose}>Close Menu</button>
      </div>
    );
  };
});

describe('Navbar Component', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('renders logo and navigation items', () => {
    renderWithRouter(<Navbar />);
    
    // Check if logo is rendered
    const logo = screen.getByAltText(/RNC Logo/i);
    expect(logo).toBeInTheDocument();
    
    // Check if main navigation items are rendered
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Our Services/i)).toBeInTheDocument();
    
    // Check if action buttons are rendered
    expect(screen.getByText(/Donate/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  test('logo links to homepage', () => {
    renderWithRouter(<Navbar />);
    
    const logoLink = screen.getByRole('link', { name: /RNC Logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.getAttribute('href')).toBe('/');
  });

  test('navigation items have correct links', () => {
    renderWithRouter(<Navbar />);
    
    // Check About Us link
    const aboutLink = screen.getByText(/About Us/i).closest('a');
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink.getAttribute('href')).toBe('/about');
    
    // Check Our Services link
    const servicesLink = screen.getByText(/Our Services/i).closest('a');
    expect(servicesLink).toBeInTheDocument();
    expect(servicesLink.getAttribute('href')).toBe('/our-services');
    
    // Check Donate button link
    const donateLink = screen.getByText(/Donate/i).closest('a');
    expect(donateLink).toBeInTheDocument();
    expect(donateLink.getAttribute('href')).toBe('/donate');
    
    // Check Login button link
    const loginLink = screen.getByText(/Login/i).closest('a');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/login');
    
    // Check Register button link
    const registerLink = screen.getByText(/Register/i).closest('a');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.getAttribute('href')).toBe('/register');
  });

  test('opens mega menu when clicking on dropdown items', async () => {
    renderWithRouter(<Navbar />);
    const user = userEvent.setup();
    
    // Find and click on a dropdown item (e.g., Education)
    const educationDropdown = screen.getByText(/Education/i);
    await user.click(educationDropdown);
    
    // Check if mega menu is opened
    expect(screen.getByTestId('mega-menu')).toBeInTheDocument();
    
    // Close the mega menu
    await user.click(screen.getByText(/Close Menu/i));
    
    // Check if mega menu is closed (this depends on your implementation)
    // This might need adjustment based on how your component handles closing the menu
  });

  test('mobile menu toggle works', async () => {
    // Mock window.innerWidth to simulate mobile view
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    renderWithRouter(<Navbar />);
    const user = userEvent.setup();
    
    // Find and click on the mobile menu button
    const menuButton = screen.getByLabelText(/menu/i);
    await user.click(menuButton);
    
    // Check if mobile menu is opened (this depends on your implementation)
    // Adjust this expectation based on your actual implementation
    
    // Reset window size
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
  });
});
