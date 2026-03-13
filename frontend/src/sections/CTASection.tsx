import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 lg:py-28"
      style={{ background: 'linear-gradient(135deg, #1a1b1f 0%, #0B0C0F 100%)' }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left - Main CTA */}
            <div 
              className={`card-tile p-6 sm:p-8 lg:p-10 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <span className="micro-label mb-4 block">READY TO START?</span>
              <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase mb-4">
                Book a Strategy Call
              </h2>
              <p className="body-text mb-6 sm:mb-8">
                Tell us what you're solving. We'll map a system plan and next steps—no pitch overload, just practical solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/contact"
                  className="btn-primary"
                  onClick={() => {
                    if (typeof gtag !== 'undefined') {
                      gtag('event', 'cta_click', {
                        event_category: 'conversion',
                        event_label: 'final_cta_book_call',
                      });
                    }
                  }}
                >
                  <Calendar size={18} />
                  Book a Call
                </Link>
                <Link
                  to="/contact"
                  className="btn-secondary"
                >
                  <Mail size={18} />
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right - Contact Info */}
            <div 
              className={`flex flex-col gap-4 sm:gap-6 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              {/* Email Card */}
              <a 
                href="mailto:hello@codebrixweb.com"
                className="card-tile p-5 sm:p-6 flex items-center gap-4 hover:border-[#F2C94C]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#F2C94C]" />
                </div>
                <div>
                  <p className="text-xs text-[#A7ACB8] mb-1">Email Us</p>
                  <p className="text-[#F4F6FA] font-semibold text-sm sm:text-base">hello@codebrixweb.com</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#A7ACB8] ml-auto" />
              </a>

              {/* Phone Card */}
              <a 
                href="tel:+2347016479713"
                className="card-tile p-5 sm:p-6 flex items-center gap-4 hover:border-[#F2C94C]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#F2C94C]" />
                </div>
                <div>
                  <p className="text-xs text-[#A7ACB8] mb-1">Call Us</p>
                  <p className="text-[#F4F6FA] font-semibold text-sm sm:text-base">+234 701 647 9713</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#A7ACB8] ml-auto" />
              </a>

              {/* Quick Stats */}
              <div className="card-tile p-5 sm:p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-[#F2C94C]">24h</p>
                    <p className="text-[10px] sm:text-xs text-[#A7ACB8] mt-1">Response Time</p>
                  </div>
                  <div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-[#F2C94C]">Free</p>
                    <p className="text-[10px] sm:text-xs text-[#A7ACB8] mt-1">Consultation</p>
                  </div>
                  <div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-[#F2C94C]">100%</p>
                    <p className="text-[10px] sm:text-xs text-[#A7ACB8] mt-1">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
