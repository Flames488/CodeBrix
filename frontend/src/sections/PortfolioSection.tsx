import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

const PortfolioSection = () => {
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

  const cases = [
    { 
      title: 'E-commerce Platform', 
      image: '/images/work-ecommerce.jpg',
      category: 'Web Development',
      price: '₦850,000'
    },
    { 
      title: 'Real Estate Listings', 
      image: '/images/work-realestate.jpg',
      category: 'Web Application',
      price: '₦1,200,000'
    },
    { 
      title: 'Cybersecurity Dashboard', 
      image: '/images/work-cyber.jpg',
      category: 'Enterprise Software',
      price: '₦2,500,000'
    },
    { 
      title: 'Healthcare Portal', 
      image: '/images/work-healthcare.jpg',
      category: 'Web Application',
      price: '₦1,800,000'
    },
    { 
      title: 'Fintech Onboarding', 
      image: '/images/work-fintech.jpg',
      category: 'Mobile & Web',
      price: '₦1,500,000'
    },
    { 
      title: 'Automation Dashboard', 
      image: '/images/automation-dashboard.jpg',
      category: 'SaaS Platform',
      price: '₦2,000,000'
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative w-full py-16 sm:py-20 lg:py-28 bg-[#0B0C0F]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div 
            className={`mb-10 sm:mb-14 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="micro-label mb-4 block">PORTFOLIO</span>
            <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase mb-4">
              Selected Work
            </h2>
            <p className="body-text max-w-2xl">
              Explore our recent projects and see how we've helped businesses transform their digital presence.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cases.map((item, index) => (
              <div
                key={item.title}
                className={`group card-tile overflow-hidden cursor-pointer transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-[#0B0C0F]/50 to-transparent opacity-80" />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#F2C94C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <span className="text-[10px] sm:text-xs text-[#F2C94C] mb-1 block">{item.category}</span>
                    <h3 className="font-display font-semibold text-[#F4F6FA] text-sm sm:text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-[#A7ACB8]">Starting {item.price}</p>
                  </div>
                  
                  {/* External link icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#F2C94C]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ExternalLink className="w-4 h-4 text-[#F2C94C]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
