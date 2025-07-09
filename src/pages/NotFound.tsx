import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Console error for debugging
    console.error(
      `404 Error: User attempted to access non-existent route: ${location.pathname}`
    );

    // Send 404 event to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_not_found', {
        event_category: 'navigation_error',
        event_label: location.pathname,
        page_location: window.location.href,
        page_path: location.pathname,
        page_referrer: document.referrer || 'direct'
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030637] text-white p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-[#48CAE4] font-mono cyberpunk-glitch-text" data-text="404">404</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-mono">PAGE NOT FOUND</p>
          <p className="text-sm text-gray-400 mb-8 font-mono break-words">
            The requested URL <span className="text-[#ADE8F4]">{location.pathname}</span> was not found on this server.
          </p>
        </div>
        
        <div className="space-y-6">
          <a 
            href="/" 
            className="inline-block px-8 py-3 border-2 border-[#48CAE4] text-[#48CAE4] hover:bg-[#48CAE4] hover:text-[#030637] transition-all duration-300 font-mono text-lg"
          >
            RETURN TO HOME
          </a>
          
          <div className="mt-8 text-sm text-gray-500 font-mono">
            <p>If you believe this is an error, feel free to reach out.</p>
            <a href="mailto:shk741612898@gmail.com" className="text-[#00B4D8] hover:underline mt-1">
              shk741612898@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
