import { useEffect, useState } from 'react';
import { Target, Lightbulb, Zap, Shield, ArrowRight, Users, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const values = [
    {
      icon: Target,
      title: 'Outcome-Focused',
      description: 'We measure success by the results we deliver, not the features we build. Every decision is tied to business outcomes.',
    },
    {
      icon: Lightbulb,
      title: 'Systems Thinking',
      description: 'We see the big picture. Our solutions are designed as cohesive systems, not isolated features.',
    },
    {
      icon: Zap,
      title: 'Performance First',
      description: 'Speed, reliability, and scalability are non-negotiable. We build for production from day one.',
    },
    {
      icon: Shield,
      title: 'Transparent & Reliable',
      description: 'No hidden complexity. No technical debt. Clean, documented, maintainable code every time.',
    },
  ];

  const stats = [
    { icon: Users, value: '150+', label: 'Projects Completed' },
    { icon: Award, value: '50+', label: 'Happy Clients' },
    { icon: Clock, value: '5+', label: 'Years Experience' },
    { icon: Zap, value: '99%', label: 'Client Retention' },
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
            <span className="micro-label mb-4 block">ABOUT CODEBRIX</span>
            <h1 className="heading-xl font-display font-bold text-[#F4F6FA] uppercase mb-6">
              We Build Systems That Work
            </h1>
            <p className="body-text text-lg sm:text-xl">
              Codebrix designs intelligent systems that remove friction from digital operations. Our work blends software engineering, automation, and AI to help businesses operate faster, smarter, and more reliably.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`card-tile p-6 sm:p-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-[#F2C94C]" />
                  </div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-[#F2C94C]">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-[#A7ACB8] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div 
              className={`transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <h2 className="heading-md font-display font-bold text-[#F4F6FA] mb-6">
                Our Approach
              </h2>
              <p className="body-text mb-4">
                We don't just write code—we architect solutions. Every project starts with understanding your business problem, mapping the bottleneck, and designing a modular system that scales.
              </p>
              <p className="body-text mb-4">
                Our team combines deep technical expertise with business acumen. We've built systems for startups, enterprises, and everything in between—across e-commerce, healthcare, fintech, and more.
              </p>
              <p className="body-text">
                The result? Systems that don't just work—they transform how your business operates.
              </p>
            </div>
            <div 
              className={`card-tile p-6 sm:p-8 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <h3 className="font-display font-semibold text-lg text-[#F4F6FA] mb-6">
                Why Businesses Choose Codebrix
              </h3>
              <ul className="space-y-4">
                {[
                  'Built for performance, not trends',
                  'Systems designed to scale',
                  'AI as infrastructure, not hype',
                  'Clean UI, robust backend, full observability',
                  'Transparent pricing and timelines',
                  'Dedicated support and maintenance',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#F2C94C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#F2C94C] text-xs">✓</span>
                    </div>
                    <span className="text-sm text-[#A7ACB8]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 
            className={`heading-md font-display font-bold text-[#F4F6FA] mb-8 sm:mb-12 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`card-tile card-tile-hover p-6 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 6) * 100}ms` }}
              >
                <value.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#F2C94C] mb-4" />
                <h3 className="font-display font-semibold text-[#F4F6FA] text-base sm:text-lg mb-2">
                  {value.title}
                </h3>
                <p className="body-text text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`card-tile p-8 sm:p-12 lg:p-16 text-center transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <h2 className="heading-md font-display font-bold text-[#F4F6FA] mb-4">
              Ready to Transform Your Operations?
            </h2>
            <p className="body-text max-w-xl mx-auto mb-6 sm:mb-8">
              Let's discuss how Codebrix can help you build systems that eliminate manual work and scale your business.
            </p>
            <Link
              to="/contact"
              className="btn-primary inline-flex"
            >
              Book a Strategy Call
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
