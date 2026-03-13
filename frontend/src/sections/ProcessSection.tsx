import { useEffect, useRef, useState } from 'react';
import { Search, PenTool, Code, TestTube, Rocket, TrendingUp } from 'lucide-react';

const ProcessSection = () => {
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

  const steps = [
    { icon: Search, title: 'DISCOVER', description: 'Map the bottleneck and understand your needs.', number: '01' },
    { icon: PenTool, title: 'DESIGN', description: 'Create modular, scalable architecture.', number: '02' },
    { icon: Code, title: 'BUILD', description: 'Develop with AI, automation, and backend logic.', number: '03' },
    { icon: TestTube, title: 'TEST', description: 'Observability-first monitoring and QA.', number: '04' },
    { icon: Rocket, title: 'DEPLOY', description: 'Production-ready rollout with zero downtime.', number: '05' },
    { icon: TrendingUp, title: 'SCALE', description: 'Iterate and improve with real-time data.', number: '06' },
  ];

  return (
    <section
      ref={sectionRef}
      id="process"
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
            <span className="micro-label mb-4 block">OUR PROCESS</span>
            <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase mb-4">
              How Codebrix Works
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              A proven methodology that takes your project from concept to production-ready system—fast, reliable, and built to scale.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`card-tile p-4 sm:p-5 text-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center mx-auto mb-3">
                  <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#F2C94C]" />
                </div>
                <span className="font-mono text-[10px] sm:text-xs text-[#A7ACB8] mb-1 block">{step.number}</span>
                <h3 className="font-display font-semibold text-[#F4F6FA] text-sm sm:text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-[#A7ACB8] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div 
            className={`mt-10 sm:mt-14 card-tile p-5 sm:p-6 transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#F2C94C]">2-6</p>
                <p className="text-xs sm:text-sm text-[#A7ACB8] mt-1">Weeks Delivery</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#F2C94C]">100%</p>
                <p className="text-xs sm:text-sm text-[#A7ACB8] mt-1">Client Satisfaction</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#F2C94C]">24/7</p>
                <p className="text-xs sm:text-sm text-[#A7ACB8] mt-1">Support Available</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#F2C94C]">∞</p>
                <p className="text-xs sm:text-sm text-[#A7ACB8] mt-1">Scalability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
