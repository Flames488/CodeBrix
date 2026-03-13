import { useEffect, useRef, useState } from 'react';
import { Check, ArrowRight, Sparkles, Zap, Rocket, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
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

  const packages = [
    {
      icon: Sparkles,
      name: 'Starter',
      description: 'Perfect for small businesses getting started.',
      price: '₦350,000',
      period: 'one-time',
      features: [
        '5-Page Responsive Website',
        'Basic SEO Setup',
        'Contact Form Integration',
        'Mobile Optimized',
        '2 Weeks Delivery',
        '1 Month Support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      icon: Zap,
      name: 'Business',
      description: 'Best for growing businesses with automation needs.',
      price: '₦750,000',
      period: 'one-time',
      features: [
        'Everything in Starter',
        '10+ Pages',
        'Custom Workflows',
        'CRM Integration',
        'Analytics Dashboard',
        '4 Weeks Delivery',
        '3 Months Support',
      ],
      cta: 'Most Popular',
      popular: true,
    },
    {
      icon: Rocket,
      name: 'Enterprise',
      description: 'Full-scale solution with AI and automation.',
      price: '₦1,500,000',
      period: 'one-time',
      features: [
        'Everything in Business',
        'Unlimited Pages',
        'AI Agent Integration',
        'Advanced Automation',
        'Priority Support',
        '6 Weeks Delivery',
        '6 Months Support',
      ],
      cta: 'Scale Up',
      popular: false,
    },
    {
      icon: Building2,
      name: 'Custom',
      description: 'Tailored solutions for complex requirements.',
      price: 'Custom',
      period: 'quote',
      features: [
        'Dedicated Team',
        'Custom Development',
        'Enterprise Integrations',
        'White-label Options',
        'SLA Guarantee',
        'Flexible Timeline',
        '12 Months Support',
      ],
      cta: 'Contact Us',
      popular: false,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full py-16 sm:py-20 lg:py-28"
      style={{ background: 'linear-gradient(180deg, #0B0C0F 0%, #1a1b1f 50%, #0B0C0F 100%)' }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div 
            className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="micro-label mb-4 block">PRICING</span>
            <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase mb-4">
              Packages & Pricing
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              Choose a package that fits your needs. All packages include our core commitment to quality and performance.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`relative rounded-[20px] p-5 sm:p-6 transition-all duration-700 ${
                  pkg.popular
                    ? 'bg-[#F2C94C] border-2 border-[#F2C94C]'
                    : 'bg-black/60 backdrop-blur-md border border-white/[0.08]'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0B0C0F] rounded-full">
                    <span className="text-xs font-semibold text-[#F2C94C]">Most Popular</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    pkg.popular ? 'bg-[#0B0C0F]/20' : 'bg-[#F2C94C]/10'
                  }`}>
                    <pkg.icon className={`w-5 h-5 ${pkg.popular ? 'text-[#0B0C0F]' : 'text-[#F2C94C]'}`} />
                  </div>
                  <div>
                    <h3 className={`font-display font-semibold text-lg ${pkg.popular ? 'text-[#0B0C0F]' : 'text-[#F4F6FA]'}`}>
                      {pkg.name}
                    </h3>
                  </div>
                </div>

                <p className={`text-sm mb-4 ${pkg.popular ? 'text-[#0B0C0F]/80' : 'text-[#A7ACB8]'}`}>
                  {pkg.description}
                </p>

                <div className="mb-6">
                  <span className={`font-display text-2xl sm:text-3xl font-bold ${pkg.popular ? 'text-[#0B0C0F]' : 'text-[#F4F6FA]'}`}>
                    {pkg.price}
                  </span>
                  <span className={`text-xs ${pkg.popular ? 'text-[#0B0C0F]/70' : 'text-[#A7ACB8]'}`}>
                    /{pkg.period}
                  </span>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 ${pkg.popular ? 'text-[#0B0C0F]' : 'text-[#F2C94C]'}`} />
                      <span className={`text-xs ${pkg.popular ? 'text-[#0B0C0F]/90' : 'text-[#A7ACB8]'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                    pkg.popular
                      ? 'bg-[#0B0C0F] text-[#F2C94C] hover:bg-[#0B0C0F]/90'
                      : 'bg-[#F2C94C] text-[#0B0C0F] hover:brightness-110'
                  }`}
                  onClick={() => {
                    if (typeof gtag !== 'undefined') {
                      gtag('event', 'cta_click', {
                        event_category: 'conversion',
                        event_label: `pricing_${pkg.name.toLowerCase()}`,
                      });
                    }
                  }}
                >
                  {pkg.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div 
            className={`mt-10 sm:mt-12 text-center transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <p className="text-sm text-[#A7ACB8]">
              All prices are in Nigerian Naira (₦). Need a custom quote?{' '}
              <Link to="/contact" className="text-[#F2C94C] hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
