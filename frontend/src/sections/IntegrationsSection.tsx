import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const IntegrationsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl
        .fromTo(titleRef.current, { x: '-70vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(paragraphRef.current, { y: '60vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.1)
        .fromTo(ctaRef.current, { y: '70vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.14)
        .fromTo(visualRef.current, { x: '80vw', scale: 0.96, opacity: 0 }, { x: 0, scale: 1, opacity: 1, ease: 'none' }, 0.08);

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl
        .fromTo(titleRef.current, { x: 0, opacity: 1 }, { x: '-60vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(paragraphRef.current, { x: 0, opacity: 1 }, { x: '-60vw', opacity: 0, ease: 'power2.in' }, 0.72)
        .fromTo(ctaRef.current, { x: 0, opacity: 1 }, { x: '-60vw', opacity: 0, ease: 'power2.in' }, 0.74)
        .fromTo(visualRef.current, { x: 0, opacity: 1 }, { x: '60vw', opacity: 0, ease: 'power2.in' }, 0.76);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const integrations = [
    'Salesforce', 'HubSpot', 'Slack', 'Zapier', 'Stripe', 
    'Google Workspace', 'Microsoft 365', 'Notion', 'Airtable', 'Make'
  ];

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-[#0B0C0F] z-[70]"
    >
      <div className="relative w-full h-full px-6 lg:px-0">
        {/* Left title */}
        <div
          ref={titleRef}
          className="card-tile absolute flex flex-col justify-center p-8 lg:p-10"
          style={{
            left: '6vw',
            top: '10vh',
            width: '34vw',
            height: '22vh',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-6 h-6 text-[#F2C94C]" />
            <span className="micro-label">CONNECTIVITY</span>
          </div>
          <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase">
            Integrations
          </h2>
        </div>

        {/* Left paragraph */}
        <div
          ref={paragraphRef}
          className="card-tile absolute flex flex-col justify-center p-8 lg:p-10"
          style={{
            left: '6vw',
            top: '36vh',
            width: '34vw',
            height: '24vh',
          }}
        >
          <p className="body-text">
            We connect the tools you already use—CRMs, calendars, messaging, payments—into one coherent system.
          </p>
        </div>

        {/* Left CTA */}
        <div
          ref={ctaRef}
          className="card-tile absolute flex flex-col justify-center p-8"
          style={{
            left: '6vw',
            top: '64vh',
            width: '34vw',
            height: '26vh',
          }}
        >
          <button
            className="btn-secondary w-full"
            onClick={() => {
              if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                  event_category: 'engagement',
                  event_label: 'request_integration_list',
                });
              }
              alert('Integration list coming soon!');
            }}
          >
            Request Integration List
            <ArrowRight size={18} />
          </button>
          <div className="mt-4 flex flex-wrap gap-2">
            {integrations.slice(0, 5).map((integration) => (
              <span
                key={integration}
                className="px-2 py-1 rounded-md bg-white/[0.05] text-xs text-[#A7ACB8]"
              >
                {integration}
              </span>
            ))}
            <span className="px-2 py-1 rounded-md bg-white/[0.05] text-xs text-[#A7ACB8]">+50 more</span>
          </div>
        </div>

        {/* Right large visual tile */}
        <div
          ref={visualRef}
          className="card-tile absolute overflow-hidden"
          style={{
            left: '42vw',
            top: '10vh',
            width: '52vw',
            height: '80vh',
          }}
        >
          <img
            src="/images/integrations-map.jpg"
            alt="Integrations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B62B8]/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="grid grid-cols-5 gap-2">
              {integrations.map((integration) => (
                <div
                  key={integration}
                  className="px-3 py-2 rounded-lg bg-[#0B0C0F]/80 backdrop-blur-sm text-center"
                >
                  <span className="text-xs text-[#F4F6FA]">{integration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
