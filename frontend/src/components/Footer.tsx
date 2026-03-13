import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'AI-Powered Websites', href: '/services' },
      { label: 'Automation Workflows', href: '/services' },
      { label: 'AI Agents', href: '/services' },
      { label: 'Graphic Design', href: '/services' },
      { label: 'SEO & Growth', href: '/services' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Work', href: '/portfolio' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Case Studies', href: '/portfolio' },
      { label: 'Blog', href: '#' },
      { label: 'Support', href: '/contact' },
      { label: 'FAQ', href: '/contact' },
    ],
  };

  const whatsappNumbers = [
    { number: '+2347016479713', label: 'Primary' },
    { number: '+2348156792070', label: 'Secondary' },
  ];

  return (
    <footer className="bg-[#0B0C0F] border-t border-white/[0.06]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <Link to="/" className="inline-block mb-4">
                <img 
                  src="/images/logo.png" 
                  alt="Codebrix Logo" 
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </Link>
              
              {/* Slogan */}
              <p className="text-sm text-[#F2C94C] font-medium mb-4">
                Your Partner in AI, Automation & Intelligent Web Systems
              </p>
              
              <p className="text-sm text-[#A7ACB8] max-w-sm mb-6">
                We build intelligent digital systems that automate work, solve problems, and scale operations efficiently.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="mailto:codebrix48@gmail.com"
                  className="flex items-center gap-3 text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors text-sm"
                >
                  <Mail size={16} />
                  <span>codebrix48@gmail.com</span>
                </a>
                {whatsappNumbers.map((whatsapp) => (
                  <a
                    key={whatsapp.number}
                    href={`https://wa.me/${whatsapp.number.replace(/\+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors text-sm"
                  >
                    <Phone size={16} />
                    <span>{whatsapp.number}</span>
                  </a>
                ))}
                <div className="flex items-center gap-3 text-[#A7ACB8] text-sm">
                  <MapPin size={16} />
                  <span>Global Remote Team</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#A7ACB8] hover:text-[#F4F6FA] hover:bg-white/[0.1] transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#A7ACB8] hover:text-[#F4F6FA] hover:bg-white/[0.1] transition-all"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#A7ACB8] hover:text-[#F4F6FA] hover:bg-white/[0.1] transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="font-display font-semibold text-[#F4F6FA] mb-4 text-sm">Services</h4>
              <ul className="space-y-2.5">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-display font-semibold text-[#F4F6FA] mb-4 text-sm">Company</h4>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-display font-semibold text-[#F4F6FA] mb-4 text-sm">Resources</h4>
              <ul className="space-y-2.5">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#A7ACB8]">
              © {currentYear} Codebrix. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-xs text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-xs text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;