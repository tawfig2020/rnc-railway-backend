import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will scroll to the top of the page whenever the route changes
// except for hash links which need to scroll to their specific targets
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only scroll to top if there's no hash in the URL
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Depend on both pathname and hash

  return null; // This component doesn't render anything
}

export default ScrollToTop;
