import { useEffect, useState } from 'react';
import { 
  Globe, 
  Workflow, 
  Bot, 
  TrendingUp, 
  ArrowRight,
  Palette,
  Image,
  PenTool,
  Layout,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const coreServices = [
    {
      icon: Globe,
      title: 'AI-Powered Websites',
      description: 'Conversion-focused, performance-optimized, automated websites with AI enhancement.',
      price: 'From ₦350,000',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading (<2s)', 'CMS Integration', 'Analytics Setup'],
    },
    {
      icon: Workflow,
      title: 'Automation & Workflows',
      description: 'Replace repetitive tasks with reliable systems that run 24/7.',
      price: 'From ₦750,000',
      features: ['Process Automation', 'Tool Integration', 'Error Handling', 'Monitoring Dashboard', 'API Development'],
    },
    {
      icon: Bot,
      title: 'AI Agents & Digital Workers',
      description: 'Deploy intelligent agents that qualify leads and provide instant responses.',
      price: 'From ₦1,200,000',
      features: ['24/7 Availability', 'Lead Qualification', 'Multi-channel Support', 'Analytics & Reporting', 'Human Handoff'],
    },
    {
      icon: TrendingUp,
      title: 'SEO & Growth Engines',
      description: 'Automated ranking and measurable lead generation systems.',
      price: 'From ₦500,000',
      features: ['Keyword Research', 'Content Strategy', 'Link Building', 'Technical SEO', 'Monthly Reporting'],
    },
  ];

  const graphicDesignServices = [
    {
      icon: Palette,
      title: 'Brand Identity Design',
      description: 'Complete brand packages including logo, color palette, typography, and brand guidelines.',
      price: 'From ₦250,000',
      features: ['Logo Design', 'Brand Guidelines', 'Business Cards', 'Letterheads', 'Social Media Kit'],
    },
    {
      icon: Layout,
      title: 'UI/UX Design',
      description: 'User-centered interface design for web and mobile applications that convert.',
      price: 'From ₦400,000',
      features: ['Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Usability Testing'],
    },
    {
      icon: Image,
      title: 'Social Media Graphics',
      description: 'Eye-catching visuals for all your social media platforms and campaigns.',
      price: 'From ₦80,000',
      features: ['Instagram Posts', 'Facebook Covers', 'LinkedIn Banners', 'Story Templates', 'Ad Creatives'],
    },
    {
      icon: PenTool,
      title: 'Print Design',
      description: 'Professional print materials from brochures to billboards and everything in between.',
      price: 'From ₦120,000',
      features: ['Flyers & Brochures', 'Posters', 'Packaging Design', 'Magazine Ads', 'Billboards'],
    },
  ];

  const processSteps = [
    { step: '01', title: 'Discover', desc: 'Map the bottleneck' },
    { step: '02', title: 'Design', desc: 'Modular architecture' },
    { step: '03', title: 'Build', desc: 'AI + automation' },
    { step: '04', title: 'Test', desc: 'Observability-first' },
    { step: '05', title: 'Deploy', desc: 'Production-ready' },
    { step: '06', title: 'Scale', desc: 'Iterate with data' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0F] pt-20 sm:pt-24 lg:pt-28">
      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`max-w-3xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="micro-label mb-4 block">OUR SERVICES</span>
            <h1 className="heading-xl font-display font-bold text-[#F4F6FA] uppercase mb-6">
              Systems Built for Outcomes
            </h1>
            <p className="body-text text-lg sm:text-xl">
              We design and build intelligent systems across multiple disciplines—each designed to eliminate friction and drive measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 
            className={`heading-md font-display font-bold text-[#F4F6FA] mb-8 sm:mb-12 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            Web & Automation Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {coreServices.map((service, index) => (
              <div
                key={service.title}
                className={`card-tile p-5 sm:p-6 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-[#F2C94C]" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[#F4F6FA] text-base sm:text-lg">{service.title}</h3>
                    <p className="text-sm text-[#F2C94C] font-semibold">{service.price}</p>
                  </div>
                </div>
                
                <p className="text-sm text-[#A7ACB8] mb-4">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F2C94C] flex-shrink-0" />
                      <span className="text-xs text-[#A7ACB8]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm text-[#F2C94C] hover:underline"
                >
                  Get Quote
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Graphic Design Services */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 
            className={`heading-md font-display font-bold text-[#F4F6FA] mb-8 sm:mb-12 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            Graphic Design Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {graphicDesignServices.map((service, index) => (
              <div
                key={service.title}
                className={`card-tile p-5 sm:p-6 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 7) * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-[#F2C94C]" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[#F4F6FA] text-base sm:text-lg">{service.title}</h3>
                    <p className="text-sm text-[#F2C94C] font-semibold">{service.price}</p>
                  </div>
                </div>
                
                <p className="text-sm text-[#A7ACB8] mb-4">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#F2C94C] flex-shrink-0" />
                      <span className="text-xs text-[#A7ACB8]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm text-[#F2C94C] hover:underline"
                >
                  Get Quote
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`card-tile p-6 sm:p-8 lg:p-10 transition-all duration-700 delay-900 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <h2 className="heading-md font-display font-bold text-[#F4F6FA] mb-8 sm:mb-10 text-center">
              How We Work
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {processSteps.map((item) => (
                <div key={item.step} className="text-center">
                  <span className="font-mono text-xs text-[#F2C94C] mb-2 block">{item.step}</span>
                  <h4 className="font-display font-semibold text-[#F4F6FA] text-sm sm:text-base mb-1">{item.title}</h4>
                  <p className="text-[10px] sm:text-xs text-[#A7ACB8]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`card-tile p-8 sm:p-12 text-center transition-all duration-700 delay-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ background: 'linear-gradient(135deg, #6B62B8 0%, #4a4190 100%)' }}
          >
            <h2 className="heading-md font-display font-bold text-white mb-4">
              Not Sure What You Need?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6 sm:mb-8">
              Book a free strategy call. We'll help you identify the right services for your business.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0B0C0F] text-white font-semibold rounded-xl transition-all hover:bg-[#0B0C0F]/90"
            >
              Book a Free Call
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
