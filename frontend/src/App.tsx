import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import SEO from './components/SEO';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import PortfolioPage from './pages/PortfolioPage';
import PricingPage from './pages/PricingPage';
import BookingPage from './pages/BookingPage';

function App() {
  useEffect(() => {
    // Initialize analytics tracking
    const initAnalytics = () => {
      const pagePath = window.location.pathname;
      if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: pagePath,
        });
      }
    };

    initAnalytics();
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen bg-[#0B0C0F]">
        {/* SEO Component */}
        <SEO />

        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/book-call" element={<BookingPage />} />
            {/* Catch all - redirect to home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Sticky WhatsApp Button */}
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;