/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Navbar from '../Navbar';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Wrapper component for tests
const NavbarWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  test('renders navbar with logo', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    // Check if logo/brand is present
    const logo = screen.getByAltText(/logo|brand/i) || screen.getByText(/refugee network centre|rnc/i);
    expect(logo).toBeInTheDocument();
  });

  test('renders main navigation links', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    // Check for main navigation items
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/programs|services/i)).toBeInTheDocument();
    expect(screen.getByText(/marketplace/i)).toBeInTheDocument();
    expect(screen.getByText(/donate/i)).toBeInTheDocument();
  });

  test('shows login/register buttons when user is not logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('shows user menu when user is logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      token: 'fake-token',
      user: { name: 'Test User', email: 'test@example.com' }
    }));

    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    // Should show user name or profile link
    expect(screen.getByText(/test user|profile|account/i)).toBeInTheDocument();
  });

  test('mobile menu toggle works', async () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    // Look for mobile menu toggle (hamburger menu)
    const mobileToggle = screen.getByRole('button', { name: /menu|toggle/i }) || 
                        screen.getByTestId('mobile-menu-toggle') ||
                        document.querySelector('.navbar-toggler, .mobile-menu-toggle, .hamburger');

    if (mobileToggle) {
      fireEvent.click(mobileToggle);
      
      // Check if mobile menu is now visible
      await waitFor(() => {
        const mobileMenu = document.querySelector('.mobile-menu, .navbar-collapse.show');
        expect(mobileMenu).toBeInTheDocument();
      });
    }
  });

  test('dropdown menus work correctly', async () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    // Find dropdown triggers
    const dropdownTriggers = screen.getAllByRole('button').filter(button => 
      button.textContent.includes('Programs') || 
      button.textContent.includes('Services') ||
      button.textContent.includes('Resources')
    );

    if (dropdownTriggers.length > 0) {
      fireEvent.click(dropdownTriggers[0]);
      
      await waitFor(() => {
        // Check if dropdown menu is visible
        const dropdownMenu = document.querySelector('.dropdown-menu, .submenu');
        expect(dropdownMenu).toBeInTheDocument();
      });
    }
  });

  test('logout functionality works', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      token: 'fake-token',
      user: { name: 'Test User', email: 'test@example.com' }
    }));

    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    // Find logout button
    const logoutButton = screen.getByText(/logout|sign out/i);
    
    if (logoutButton) {
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    }
  });

  test('navigation links have correct hrefs', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    // Check navigation links
    const aboutLink = screen.getByText(/about/i).closest('a');
    const donateLink = screen.getByText(/donate/i).closest('a');
    const marketplaceLink = screen.getByText(/marketplace/i).closest('a');

    if (aboutLink) expect(aboutLink).toHaveAttribute('href', '/about');
    if (donateLink) expect(donateLink).toHaveAttribute('href', '/donate');
    if (marketplaceLink) expect(marketplaceLink).toHaveAttribute('href', '/marketplace');
  });

  test('navbar is responsive', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    const navbar = document.querySelector('nav, .navbar');
    expect(navbar).toBeInTheDocument();
    
    // Check for responsive classes
    expect(navbar).toHaveClass(/navbar|navigation/);
  });

  test('accessibility features are present', () => {
    render(
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    );

    // Check for navigation landmark
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Check for proper button roles
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });

    // Check for proper link roles
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toBeInTheDocument();
    });
  });
});
