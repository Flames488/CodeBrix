import HeroSection from '../sections/HeroSection';
import CapabilitiesSection from '../sections/CapabilitiesSection';
import GraphicDesignSection from '../sections/GraphicDesignSection';
import ProcessSection from '../sections/ProcessSection';
import PortfolioSection from '../sections/PortfolioSection';
import PricingSection from '../sections/PricingSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import CTASection from '../sections/CTASection';

const HomePage = () => {
  return (
    <div className="relative">
      {/* Section 1: Hero */}
      <HeroSection />
      
      {/* Section 2: What We Build / Capabilities */}
      <CapabilitiesSection />
      
      {/* Section 3: Graphic Design Services */}
      <GraphicDesignSection />
      
      {/* Section 4: How Codebrix Works */}
      <ProcessSection />
      
      {/* Section 5: Portfolio */}
      <PortfolioSection />
      
      {/* Section 6: Pricing */}
      <PricingSection />
      
      {/* Section 7: Testimonials */}
      <TestimonialsSection />
      
      {/* Section 8: CTA */}
      <CTASection />
    </div>
  );
};

export default HomePage;
