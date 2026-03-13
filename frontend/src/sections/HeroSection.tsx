import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger animations on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden hero-background"
    >
      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-20 pt-28">
        <div className="max-w-7xl mx-auto">
          {/* Logo & Slogan - Centered at top */}
          <div 
            className={`text-center mb-8 sm:mb-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <img 
              src="/images/logo.png" 
              alt="Codebrix Logo" 
              className="h-20 sm:h-24 lg:h-28 w-auto mx-auto object-contain mb-4"
            />
            <p className="text-[#F2C94C] text-sm sm:text-base font-medium tracking-wide">
              Your Partner in AI, Automation & Intelligent Web Systems
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column - Main Headline */}
            <div 
              className={`lg:col-span-7 card-tile p-6 sm:p-8 lg:p-12 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
            >
              <span className="micro-label mb-4 block">CODEBRIX — AI SYSTEMS STUDIO</span>
              <h1 className="heading-xl font-display font-bold text-[#F4F6FA] uppercase mb-6">
                <span className="block">We Build</span>
                <span className="block text-gradient">Intelligent Digital</span>
                <span className="block">Systems</span>
              </h1>
              <p className="body-text text-base sm:text-lg max-w-xl mb-8">
                AI-powered websites, automation, and workflows that eliminate manual tasks and scale your business efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="btn-primary"
                  onClick={() => {
                    if (typeof gtag !== 'undefined') {
                      gtag('event', 'cta_click', {
                        event_category: 'conversion',
                        event_label: 'hero_book_call',
                      });
                    }
                  }}
                >
                  Book a Strategy Call
                  <ArrowRight size={18} />
                </Link>
                <Link to="/portfolio" className="btn-secondary">
                  <Play size={18} />
                  View Our Work
                </Link>
              </div>
            </div>

            {/* Right Column - Stats & Features */}
            <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
              {/* Stats Card */}
              <div 
                className={`card-tile p-5 sm:p-6 transition-all duration-700 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                }`}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-[#F2C94C]">150+</p>
                    <p className="text-xs text-[#A7ACB8] mt-1">Projects</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-[#F2C94C]">50+</p>
                    <p className="text-xs text-[#A7ACB8] mt-1">Clients</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-[#F2C94C]">99%</p>
                    <p className="text-xs text-[#A7ACB8] mt-1">Satisfaction</p>
                  </div>
                </div>
              </div>

              {/* Features Card */}
              <div 
                className={`card-tile p-5 sm:p-6 flex-1 transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                }`}
              >
                <h3 className="font-display font-semibold text-[#F4F6FA] mb-4 text-sm sm:text-base">Why Choose Us</h3>
                <div className="space-y-3">
                  {[
                    'Performance-focused builds',
                    'Automation-first methodology',
                    'Scalable architecture',
                    'Business outcome-driven',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#F2C94C] flex-shrink-0" />
                      <span className="text-sm text-[#A7ACB8]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Contact */}
              <div 
                className={`card-tile p-4 sm:p-5 transition-all duration-700 delay-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                }`}
              >
                <p className="text-xs text-[#A7ACB8] mb-2">Start a Project</p>
                <p className="text-[#F4F6FA] font-semibold text-sm sm:text-base">codebrix48@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Bottom Service Cards */}
          <div 
            className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            }`}
          >
            {[
              { title: 'AI Websites', price: 'From ₦350K' },
              { title: 'Automation', price: 'From ₦750K' },
              { title: 'AI Agents', price: 'From ₦1.2M' },
              { title: 'SEO Growth', price: 'From ₦500K' },
            ].map((service) => (
              <Link 
                key={service.title} 
                to="/pricing"
                className="card-tile card-tile-hover p-4 text-center"
              >
                <p className="font-display font-semibold text-[#F4F6FA] text-sm sm:text-base">{service.title}</p>
                <p className="text-xs text-[#F2C94C] mt-1">{service.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
