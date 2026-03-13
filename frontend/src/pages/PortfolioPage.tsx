import { useEffect, useState } from 'react';
import { ExternalLink, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortfolioPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = ['All', 'Web Development', 'AI & Automation', 'Graphic Design', 'Mobile Apps'];

  const projects = [
    {
      title: 'E-commerce Platform',
      category: 'Web Development',
      image: '/images/work-ecommerce.jpg',
      description: 'Full-featured online store with AI-powered product recommendations and automated inventory management.',
      price: '₦850,000',
      features: ['React & Node.js', 'Payment Integration', 'AI Recommendations', 'Admin Dashboard'],
      client: 'RetailMax Nigeria',
    },
    {
      title: 'Real Estate Listings',
      category: 'Web Development',
      image: '/images/work-realestate.jpg',
      description: 'Property listing platform with advanced search, virtual tours, and automated lead capture.',
      price: '₦1,200,000',
      features: ['Map Integration', 'Virtual Tours', 'Lead Automation', 'CRM Integration'],
      client: 'Prime Properties Ltd',
    },
    {
      title: 'Cybersecurity Dashboard',
      category: 'AI & Automation',
      image: '/images/work-cyber.jpg',
      description: 'Enterprise security monitoring platform with real-time threat detection and automated alerts.',
      price: '₦2,500,000',
      features: ['Real-time Monitoring', 'AI Threat Detection', 'Automated Alerts', 'Compliance Reporting'],
      client: 'SecureNet Solutions',
    },
    {
      title: 'Healthcare Portal',
      category: 'Web Development',
      image: '/images/work-healthcare.jpg',
      description: 'Patient management system with appointment scheduling, telemedicine, and automated reminders.',
      price: '₦1,800,000',
      features: ['Patient Records', 'Telemedicine', 'Appointment System', 'HIPAA Compliant'],
      client: 'MedCare Hospital',
    },
    {
      title: 'Fintech Onboarding',
      category: 'Mobile Apps',
      image: '/images/work-fintech.jpg',
      description: 'Mobile-first banking app with seamless onboarding, KYC verification, and secure transactions.',
      price: '₦1,500,000',
      features: ['KYC Integration', 'Biometric Auth', 'Secure Payments', 'Transaction History'],
      client: 'PayFast Nigeria',
    },
    {
      title: 'Automation Dashboard',
      category: 'AI & Automation',
      image: '/images/automation-dashboard.jpg',
      description: 'Business process automation platform with workflow builder and real-time analytics.',
      price: '₦2,000,000',
      features: ['Workflow Builder', 'Multi-tool Integration', 'Real-time Analytics', 'Error Handling'],
      client: 'TechFlow Inc.',
    },
    {
      title: 'Brand Identity - Luxe Fashion',
      category: 'Graphic Design',
      image: '/images/agent-portrait.jpg',
      description: 'Complete brand identity package including logo, color palette, and brand guidelines.',
      price: '₦350,000',
      features: ['Logo Design', 'Brand Guidelines', 'Business Cards', 'Social Media Kit'],
      client: 'Luxe Fashion',
    },
    {
      title: 'AI Customer Support Bot',
      category: 'AI & Automation',
      image: '/images/hero-nodes.jpg',
      description: 'Intelligent chatbot that handles 80% of customer inquiries with natural language processing.',
      price: '₦1,200,000',
      features: ['NLP Processing', 'Multi-language', '24/7 Support', 'Human Handoff'],
      client: 'ScaleUp Co.',
    },
    {
      title: 'Restaurant Ordering App',
      category: 'Mobile Apps',
      image: '/images/hero-workspace.jpg',
      description: 'Food ordering app with real-time tracking, payment integration, and loyalty program.',
      price: '₦950,000',
      features: ['Real-time Tracking', 'Payment Gateway', 'Loyalty Program', 'Push Notifications'],
      client: 'Nigerian Eats',
    },
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

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
            <span className="micro-label mb-4 block">OUR WORK</span>
            <h1 className="heading-xl font-display font-bold text-[#F4F6FA] uppercase mb-6">
              Featured Projects
            </h1>
            <p className="body-text text-lg sm:text-xl">
              Explore our portfolio of successful projects. Each one represents our commitment to excellence, innovation, and delivering measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`flex flex-wrap gap-2 sm:gap-3 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <Filter className="w-5 h-5 text-[#A7ACB8] mr-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeFilter === category
                    ? 'bg-[#F2C94C] text-[#0B0C0F]'
                    : 'bg-white/[0.05] text-[#A7ACB8] hover:bg-white/[0.1] hover:text-[#F4F6FA]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.title}
                className={`group card-tile overflow-hidden transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-[#0B0C0F]/60 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-md bg-[#F2C94C]/20 text-[#F2C94C] text-[10px] sm:text-xs font-medium">
                      {project.category}
                    </span>
                  </div>

                  {/* External link icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ExternalLink className="w-4 h-4 text-[#F4F6FA]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <p className="text-[10px] sm:text-xs text-[#A7ACB8] mb-1">{project.client}</p>
                  <h3 className="font-display font-semibold text-[#F4F6FA] text-base sm:text-lg mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A7ACB8] mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] text-[#A7ACB8]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div>
                      <p className="text-[10px] text-[#A7ACB8]">Starting from</p>
                      <p className="text-[#F2C94C] font-semibold text-sm">{project.price}</p>
                    </div>
                    <Link
                      to="/contact"
                      className="flex items-center gap-1 text-xs text-[#F2C94C] hover:underline"
                    >
                      Get Quote
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`card-tile p-8 sm:p-12 lg:p-16 text-center transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ background: 'linear-gradient(135deg, #6B62B8 0%, #4a4190 100%)' }}
          >
            <h2 className="heading-md font-display font-bold text-white mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6 sm:mb-8">
              Let's discuss how we can help bring your vision to life. Every great project starts with a conversation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0B0C0F] text-white font-semibold rounded-xl transition-all hover:bg-[#0B0C0F]/90"
            >
              Start Your Project
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
