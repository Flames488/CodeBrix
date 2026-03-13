import { useEffect, useRef, useState } from 'react';
import { Globe, Workflow, Bot, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CapabilitiesSection = () => {
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

  const capabilities = [
    {
      icon: Globe,
      title: 'AI-Powered Websites',
      description: 'Conversion-focused, performance-optimized, automated websites with AI enhancement.',
      price: '₦350,000',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'CMS Integration'],
    },
    {
      icon: Workflow,
      title: 'Automation & Workflows',
      description: 'Replace repetitive tasks with reliable systems that run 24/7.',
      price: '₦750,000',
      features: ['Process Automation', 'Tool Integration', 'Error Handling', 'Monitoring'],
    },
    {
      icon: Bot,
      title: 'AI Agents & Digital Workers',
      description: 'Deploy intelligent agents that qualify leads and provide instant responses.',
      price: '₦1,200,000',
      features: ['24/7 Availability', 'Lead Qualification', 'Multi-channel', 'Analytics'],
    },
    {
      icon: TrendingUp,
      title: 'SEO & Growth Engines',
      description: 'Automated ranking and measurable lead generation systems.',
      price: '₦500,000',
      features: ['Keyword Research', 'Content Strategy', 'Link Building', 'Reporting'],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="capabilities"
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
            <span className="micro-label mb-4 block">WHAT WE BUILD</span>
            <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase mb-4">
              Our Core Services
            </h2>
            <p className="body-text max-w-2xl">
              We design systems that remove friction—so your team can focus on high-value work while automation handles the rest.
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {capabilities.map((capability, index) => (
              <div
                key={capability.title}
                className={`card-tile card-tile-hover p-5 sm:p-6 flex flex-col transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center mb-4">
                  <capability.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#F2C94C]" />
                </div>
                
                <h3 className="font-display font-semibold text-[#F4F6FA] text-base sm:text-lg mb-2">
                  {capability.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#A7ACB8] mb-4 flex-grow">
                  {capability.description}
                </p>
                
                <div className="pt-4 border-t border-white/[0.08]">
                  <p className="text-[#F2C94C] font-semibold text-sm sm:text-base mb-3">
                    Starting {capability.price}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {capability.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] sm:text-xs text-[#A7ACB8]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div 
            className={`mt-10 sm:mt-12 text-center transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
             
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
