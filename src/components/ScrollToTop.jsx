import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component to scroll to top when route changes
 * This component doesn't render anything in the DOM, it just performs an action
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling for better UX
    });
  }, [pathname]);

  return null; // Doesn't render anything
}

export default ScrollToTop;
