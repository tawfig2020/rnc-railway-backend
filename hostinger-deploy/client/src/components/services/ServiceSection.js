import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component helps with scroll behavior when navigating to anchor links
const ServiceSection = ({ id, children }) => {
  const location = useLocation();

  useEffect(() => {
    // Check if the current location hash matches this section's id
    if (location.hash === `#${id}`) {
      const element = document.getElementById(id);
      if (element) {
        // Wait a bit to ensure the DOM is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location, id]);

  return (
    <div id={id}>
      {children}
    </div>
  );
};

export default ServiceSection;
