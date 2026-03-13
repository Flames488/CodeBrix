import { useEffect, useState } from 'react';
import { Check, ArrowRight, Sparkles, Zap, Rocket, Building2, Palette, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'one-time' | 'monthly'>('one-time');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const webPackages = [
    {
      icon: Sparkles,
      name: 'Starter',
      description: 'Perfect for small businesses getting started.',
      oneTimePrice: '₦350,000',
      monthlyPrice: '₦35,000',
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
      oneTimePrice: '₦750,000',
      monthlyPrice: '₦75,000',
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
      oneTimePrice: '₦1,500,000',
      monthlyPrice: '₦150,000',
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
      oneTimePrice: 'Custom',
      monthlyPrice: 'Custom',
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

  const designPackages = [
    {
      icon: Palette,
      name: 'Brand Identity',
      description: 'Complete brand package for new businesses.',
      price: '₦250,000',
      features: [
        'Logo Design (3 concepts)',
        'Brand Guidelines',
        'Business Cards',
        'Letterheads',
        'Social Media Kit',
        '2 Weeks Delivery',
      ],
    },
    {
      icon: Sparkles,
      name: 'UI/UX Design',
      description: 'User-centered design for web and mobile.',
      price: '₦400,000',
      features: [
        'Wireframing & Prototyping',
        'User Research',
        'Design System',
        'Mobile Responsive',
        'Usability Testing',
        '3 Weeks Delivery',
      ],
    },
  ];

  const faqs = [
    {
      q: 'What is included in the support period?',
      a: 'Support includes bug fixes, minor updates, and technical assistance. Extended support packages are available.',
    },
    {
      q: 'Can I upgrade my package later?',
      a: 'Yes! You can upgrade at any time. We will credit what you have already paid towards the new package.',
    },
    {
      q: 'What are the payment terms?',
      a: 'We typically require 50% upfront and 50% upon completion. For larger projects, milestone-based payments are available.',
    },
    {
      q: 'Do you offer refunds?',
      a: 'We offer a satisfaction guarantee. If you are not happy with the initial concepts, we will work with you until you are satisfied.',
    },
    {
      q: 'How long does a typical project take?',
      a: 'Timelines vary by package: Starter (2 weeks), Business (4 weeks), Enterprise (6 weeks). Custom projects depend on scope.',
    },
    {
      q: 'Do you work with international clients?',
      a: 'Absolutely! We work with clients globally and can accommodate different time zones and currencies.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0F] pt-20 sm:pt-24 lg:pt-28">
      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`text-center max-w-3xl mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="micro-label mb-4 block">PRICING</span>
            <h1 className="heading-xl font-display font-bold text-[#F4F6FA] uppercase mb-6">
              Transparent Pricing
            </h1>
            <p className="body-text text-lg sm:text-xl">
              Choose a package that fits your needs. All packages include our core commitment to quality, performance, and results.
            </p>
          </div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`flex justify-center transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
              <button
                onClick={() => setBillingCycle('one-time')}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'one-time'
                    ? 'bg-[#F2C94C] text-[#0B0C0F]'
                    : 'text-[#A7ACB8] hover:text-[#F4F6FA]'
                }`}
              >
                One-Time Payment
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#F2C94C] text-[#0B0C0F]'
                    : 'text-[#A7ACB8] hover:text-[#F4F6FA]'
                }`}
              >
                Monthly Installments
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Web & Automation Packages */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <h2 
            className={`heading-md font-display font-bold text-[#F4F6FA] mb-8 sm:mb-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            Web & Automation Packages
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {webPackages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`relative rounded-[20px] p-5 sm:p-6 transition-all duration-700 ${
                  pkg.popular
                    ? 'bg-[#F2C94C] border-2 border-[#F2C94C]'
                    : 'bg-black/60 backdrop-blur-md border border-white/[0.08]'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${(index + 4) * 100}ms` }}
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
                  <h3 className={`font-display font-semibold text-lg ${pkg.popular ? 'text-[#0B0C0F]' : 'text-[#F4F6FA]'}`}>
                    {pkg.name}
                  </h3>
                </div>

                <p className={`text-sm mb-4 ${pkg.popular ? 'text-[#0B0C0F]/80' : 'text-[#A7ACB8]'}`}>
                  {pkg.description}
                </p>

                <div className="mb-6">
                  <span className={`font-display text-2xl sm:text-3xl font-bold ${pkg.popular ? 'text-[#0B0C0F]' : 'text-[#F4F6FA]'}`}>
                    {billingCycle === 'one-time' ? pkg.oneTimePrice : pkg.monthlyPrice}
                  </span>
                  {pkg.oneTimePrice !== 'Custom' && (
                    <span className={`text-xs ${pkg.popular ? 'text-[#0B0C0F]/70' : 'text-[#A7ACB8]'}`}>
                      /{billingCycle === 'one-time' ? 'one-time' : 'month x 12'}
                    </span>
                  )}
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
                >
                  {pkg.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Graphic Design Packages */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <h2 
            className={`heading-md font-display font-bold text-[#F4F6FA] mb-8 sm:mb-10 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            Graphic Design Packages
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl">
            {designPackages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`card-tile p-5 sm:p-6 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 8) * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center">
                    <pkg.icon className="w-5 h-5 text-[#F2C94C]" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#F4F6FA]">{pkg.name}</h3>
                </div>

                <p className="text-sm text-[#A7ACB8] mb-4">{pkg.description}</p>

                <div className="mb-6">
                  <span className="font-display text-2xl font-bold text-[#F4F6FA]">{pkg.price}</span>
                  <span className="text-xs text-[#A7ACB8]">/one-time</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F2C94C] flex-shrink-0" />
                      <span className="text-xs text-[#A7ACB8]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#F2C94C] text-[#0B0C0F] hover:brightness-110 transition-all"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="card-tile p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-6 h-6 text-[#F2C94C]" />
              <h2 className="heading-sm font-display font-bold text-[#F4F6FA]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-white/[0.06] pb-4">
                  <h4 className="font-display font-semibold text-[#F4F6FA] mb-2 text-sm">{faq.q}</h4>
                  <p className="body-text text-xs">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`card-tile p-8 sm:p-12 text-center transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ background: 'linear-gradient(135deg, #6B62B8 0%, #4a4190 100%)' }}
          >
            <h2 className="heading-md font-display font-bold text-white mb-4">
              Not Sure Which Package?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6 sm:mb-8">
              Book a free consultation and we'll help you choose the right package for your business needs.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0B0C0F] text-white font-semibold rounded-xl transition-all hover:bg-[#0B0C0F]/90"
            >
              Book Free Consultation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
