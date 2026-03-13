import { useEffect, useRef, useState } from 'react';
import { Palette, Image, PenTool, Layout, Monitor, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GraphicDesignSection = () => {
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

  const designServices = [
    {
      icon: Palette,
      title: 'Brand Identity Design',
      description: 'Complete brand packages including logo, color palette, typography, and brand guidelines.',
      price: 'From ₦250,000',
      features: ['Logo Design', 'Brand Guidelines', 'Business Cards', 'Letterheads'],
    },
    {
      icon: Layout,
      title: 'UI/UX Design',
      description: 'User-centered interface design for web and mobile applications that convert.',
      price: 'From ₦400,000',
      features: ['Wireframing', 'Prototyping', 'User Research', 'Design Systems'],
    },
    {
      icon: Image,
      title: 'Social Media Graphics',
      description: 'Eye-catching visuals for all your social media platforms and campaigns.',
      price: 'From ₦80,000',
      features: ['Instagram Posts', 'Facebook Covers', 'LinkedIn Banners', 'Story Templates'],
    },
    {
      icon: PenTool,
      title: 'Print Design',
      description: 'Professional print materials from brochures to billboards and everything in between.',
      price: 'From ₦120,000',
      features: ['Flyers & Brochures', 'Posters', 'Packaging', 'Magazine Ads'],
    },
    {
      icon: Monitor,
      title: 'Web Graphics',
      description: 'Custom graphics, banners, and visual elements for your website.',
      price: 'From ₦150,000',
      features: ['Hero Banners', 'Icons & Illustrations', 'Infographics', 'Email Templates'],
    },
    {
      icon: Smartphone,
      title: 'Motion Graphics',
      description: 'Animated graphics and video content to bring your brand to life.',
      price: 'From ₦300,000',
      features: ['Logo Animation', 'Explainer Videos', 'Social Media Reels', 'Video Ads'],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 lg:py-28 bg-[#0B0C0F]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div 
            className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="micro-label mb-4 block">CREATIVE SERVICES</span>
            <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase mb-4">
              Graphic Design
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              Stunning visuals that capture your brand essence and communicate your message effectively. From logos to full brand identities.
            </p>
          </div>

          {/* Design Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {designServices.map((service, index) => (
              <div
                key={service.title}
                className={`card-tile card-tile-hover p-5 sm:p-6 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#F2C94C]" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[#F4F6FA] text-sm sm:text-base">{service.title}</h3>
                    <p className="text-xs sm:text-sm text-[#F2C94C]">{service.price}</p>
                  </div>
                </div>
                
                <p className="text-sm text-[#A7ACB8] mb-4">{service.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 rounded-md bg-white/[0.05] text-xs text-[#A7ACB8]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div 
            className={`mt-10 sm:mt-12 text-center transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <Link
              to="/contact"
              className="btn-primary inline-flex"
              onClick={() => {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'cta_click', {
                    event_category: 'conversion',
                    event_label: 'graphic_design_cta',
                  });
                }
              }}
            >
              Click Me To Get Starterd
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GraphicDesignSection;
