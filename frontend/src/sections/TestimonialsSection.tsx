import { useEffect, useRef, useState } from 'react';
import { Quote, Star } from 'lucide-react';

const TestimonialsSection = () => {
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

  const testimonials = [
    {
      quote: 'Codebrix turned our workflow into a system that runs overnight. What used to take hours now happens automatically. The ROI has been incredible.',
      author: 'Sarah Chen',
      role: 'Operations Director',
      company: 'TechFlow Inc.',
      rating: 5,
    },
    {
      quote: 'The AI agent handles 80% of inbound questions without us lifting a finger. Our team can finally focus on high-value work.',
      author: 'Michael Torres',
      role: 'Customer Success Lead',
      company: 'ScaleUp Co.',
      rating: 5,
    },
    {
      quote: 'Fast, clean, and built to scale—exactly what we needed. The team understood our requirements from day one and delivered beyond expectations.',
      author: 'Emma Williams',
      role: 'CTO',
      company: 'DataDrive',
      rating: 5,
    },
    {
      quote: 'Our new website loads in under 2 seconds and conversions are up 40%. The attention to performance detail is unmatched.',
      author: 'David Okonkwo',
      role: 'Founder',
      company: 'Nigerian Eats',
      rating: 5,
    },
    {
      quote: 'The graphic design team created a brand identity that perfectly captures our vision. Professional, creative, and responsive.',
      author: 'Amara Okafor',
      role: 'Marketing Manager',
      company: 'Luxe Fashion',
      rating: 5,
    },
    {
      quote: 'Best investment we made this year. The automation system paid for itself within the first month. Highly recommend!',
      author: 'James Peterson',
      role: 'CEO',
      company: 'GrowthLabs',
      rating: 5,
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
            <span className="micro-label mb-4 block">TESTIMONIALS</span>
            <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase mb-4">
              What Clients Say
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about working with Codebrix.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className={`card-tile p-5 sm:p-6 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <Quote className="w-8 h-8 text-[#F2C94C] mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F2C94C] text-[#F2C94C]" />
                  ))}
                </div>
                
                <p className="text-[#F4F6FA] text-sm sm:text-base leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                
                <div className="pt-4 border-t border-white/[0.08]">
                  <p className="font-semibold text-[#F4F6FA] text-sm">{testimonial.author}</p>
                  <p className="text-xs text-[#A7ACB8]">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
