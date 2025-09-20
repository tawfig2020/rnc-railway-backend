import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import './App.css';

import Education from './pages/Education';
import About from './pages/About';
import Donation from './pages/DonationEnhanced';
import Career from './pages/Career';
import CareerFairRegistration from './pages/CareerFairRegistration';
import PartnershipApplication from './pages/PartnershipApplication';
import VolunteerApplication from './pages/VolunteerApplication';
import Social from './pages/Social';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import AIHub from './pages/AIHub';
import VerifyEmail from './pages/VerifyEmail';
import VerificationPending from './pages/VerificationPending';
import ResendVerification from './pages/ResendVerification';
import CommunityProjects from './pages/CommunityProjects';
import Marketplace from './pages/Marketplace';
import Checkout from './pages/Checkout';
import Blog from './pages/Blog';
import Forum from './pages/Forum';
import OurServicesPage from './pages/OurServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ProgramRegistrationPage from './pages/ProgramRegistrationPage';
import HomePage from './pages/HomePage';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import PrivacySettings from './pages/PrivacySettings';
import CookieConsentBanner from './components/privacy/CookieConsentBanner';
import AccessibilityPage from './pages/Accessibility';
import Events from './pages/Events';
import AdminDashboard from './pages/AdminDashboard';
import ActivitiesAlbum from './pages/ActivitiesAlbum';
import MobileAccess from './pages/MobileAccess';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2A7D6F', // Deep teal
      light: '#4CA399',
      dark: '#1B5A50',
    },
    secondary: {
      main: '#D36135', // Terracotta
      light: '#E88B68',
      dark: '#A4492A',
    },
    background: {
      default: '#F9F4EF', // Soft beige
      paper: '#FFFFFF',
    },
    success: {
      main: '#79854E', // Olive green
    },
    error: {
      main: '#B23A48', // Deep red
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/donate" element={<Donation />} />
              <Route path="/our-services" element={<OurServicesPage />} />
              <Route path="/our-services/:category/:serviceId" element={<ServiceDetailPage />} />
              <Route path="/program-registration/:programId" element={<ProgramRegistrationPage />} />
              <Route path="/" element={<HomePage />} />
              
              {/* Education Routes */}
              <Route path="/education" element={<Education />} />
              <Route path="/education/community-centers" element={<Education />} />
              <Route path="/education/digital-courses" element={<Education />} />
              <Route path="/education/vibe-coding" element={<Education />} />
              <Route path="/education/school-support" element={<Education />} />
              
              {/* Career Routes */}
              <Route path="/career" element={<Career />} />
              <Route path="/career/fair-registration" element={<CareerFairRegistration />} />
              <Route path="/partnership-application" element={<PartnershipApplication />} />
              <Route path="/volunteer-application" element={<VolunteerApplication />} />
              <Route path="/career/ai-hub" element={<Career />} />
              <Route path="/career/vocational-training" element={<Career />} />
              <Route path="/career/job-readiness" element={<Career />} />
              <Route path="/career/mentorship" element={<Career />} />
              
              {/* Social Routes */}
              <Route path="/social" element={<Social />} />
              <Route path="/social/arts-crafts" element={<Social />} />
              <Route path="/social/women-empowerment" element={<Social />} />
              <Route path="/social/capacity-building" element={<Social />} />
              <Route path="/social/youth-wellness" element={<Social />} />
              
              {/* Marketplace Routes */}
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/handmade" element={<Marketplace />} />
              <Route path="/marketplace/handicrafts" element={<Marketplace />} />
              <Route path="/marketplace/art" element={<Marketplace />} />
              <Route path="/marketplace/clothing" element={<Marketplace />} />
              <Route path="/marketplace/digital" element={<Marketplace />} />
              <Route path="/marketplace/freelance" element={<Marketplace />} />
              <Route path="/marketplace/downloads" element={<Marketplace />} />
              <Route path="/marketplace/apps" element={<Marketplace />} />
              <Route path="/marketplace/bakery" element={<Marketplace />} />
              <Route path="/marketplace/bakery/*" element={<Marketplace />} />
              <Route path="/marketplace/cakes" element={<Marketplace />} />
              <Route path="/marketplace/desserts" element={<Marketplace />} />
              <Route path="/checkout" element={<Checkout />} />
              
              <Route path="/courses" element={<Courses />} />
              <Route path="/ai-hub" element={<AIHub />} />
              <Route path="/activities-album" element={<ActivitiesAlbum />} />
              <Route path="/community-projects" element={<CommunityProjects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/ask" element={<Forum />} />
              <Route path="/forum/:categoryId" element={<Forum />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/verification-pending" element={<VerificationPending />} />
              <Route path="/resend-verification" element={<ResendVerification />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Legal & Accessibility Pages */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/privacy-settings" element={<PrivacySettings />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<Events />} />
              <Route path="/mobile-access" element={<MobileAccess />} />
            </Routes>
          </main>
          <Footer />
          <CookieConsentBanner />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
