import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', href: '/', internal: true },
    { label: 'Services', href: '/services', internal: true },
    { label: 'Portfolio', href: '/portfolio', internal: true },
    { label: 'Pricing', href: '/pricing', internal: true },
    { label: 'About', href: '/about', internal: true },
    { label: 'Contact', href: '/contact', internal: true },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B0C0F]/95 backdrop-blur-lg border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo with Image */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <img 
                src="/images/logo.png" 
                alt="Codebrix Logo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={handleNavClick}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.href 
                      ? 'text-[#F2C94C]' 
                      : 'text-[#A7ACB8] hover:text-[#F4F6FA]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <Link
                to="/contact"
                className="btn-primary text-sm"
              >
                Book a Call
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[#F4F6FA] rounded-lg hover:bg-white/[0.05] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0B0C0F]/98 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div className="relative flex flex-col items-center justify-center h-full gap-5 px-6">
          {/* Logo in mobile menu */}
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mb-4">
            <img 
              src="/images/logo.png" 
              alt="Codebrix Logo" 
              className="h-16 w-auto object-contain"
            />
          </Link>
          
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-xl sm:text-2xl font-display font-semibold transition-colors ${
                location.pathname === link.href 
                  ? 'text-[#F2C94C]' 
                  : 'text-[#F4F6FA] hover:text-[#F2C94C]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="btn-primary mt-6"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book a Strategy Call
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
