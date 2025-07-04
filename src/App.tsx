/**
 * Personal Portfolio Website
 * Copyright (c) 2025 Haokun Song
 * Licensed under MIT License
 * 
 * Original design and implementation by Haokun Song
 * https://kuk1song.com
 * https://github.com/kuk1song/my-personal-website
 */

import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const GA_MEASUREMENT_ID = 'G-TP1SLX5WWJ';

// Define the global gtag function type
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const App = () => {
  useEffect(() => {
    // Load Google Analytics asynchronously
    const loadGoogleAnalytics = () => {
      // Create the GA script tag
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialize the gtag function
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      // Configure GA
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        send_page_view: true
      });

      console.log('Google Analytics loaded successfully');
    };

    // Load GA after page load
    if (document.readyState === 'complete') {
      loadGoogleAnalytics();
    } else {
      window.addEventListener('load', loadGoogleAnalytics);
    }

    return () => {
      window.removeEventListener('load', loadGoogleAnalytics);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
