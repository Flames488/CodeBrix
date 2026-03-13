import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Plug, AlertCircle, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AutomationSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
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
        .fromTo(headlineRef.current, { x: '-70vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(imageRef.current, { x: '70vw', scale: 0.96, opacity: 0 }, { x: 0, scale: 1, opacity: 1, ease: 'none' }, 0.08)
        .fromTo(bodyRef.current, { y: '70vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.1)
        .fromTo(visualRef.current, { x: '70vw', y: '20vh', opacity: 0 }, { x: 0, y: 0, opacity: 1, ease: 'none' }, 0.12);

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl
        .fromTo(headlineRef.current, { x: 0, opacity: 1 }, { x: '-60vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(imageRef.current, { x: 0, opacity: 1 }, { x: '60vw', opacity: 0, ease: 'power2.in' }, 0.72)
        .fromTo(bodyRef.current, { y: 0, opacity: 1 }, { y: '60vh', opacity: 0, ease: 'power2.in' }, 0.74)
        .fromTo(visualRef.current, { x: 0, y: 0, opacity: 1 }, { x: '60vw', y: '40vh', opacity: 0, ease: 'power2.in' }, 0.76);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Zap, text: 'Trigger-based tasks' },
    { icon: Plug, text: 'Multi-tool integrations' },
    { icon: AlertCircle, text: 'Error handling + alerts' },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-[#0B0C0F] z-40"
    >
      <div className="relative w-full h-full px-6 lg:px-0">
        {/* Top-left headline tile */}
        <div
          ref={headlineRef}
          className="card-tile absolute flex flex-col justify-center p-8 lg:p-12"
          style={{
            left: '6vw',
            top: '10vh',
            width: '62vw',
            height: '28vh',
          }}
        >
          <span className="micro-label mb-4">24/7 OPERATIONS</span>
          <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase">
            Automation That Runs 24/7
          </h2>
        </div>

        {/* Top-right image tile */}
        <div
          ref={imageRef}
          className="card-tile absolute overflow-hidden"
          style={{
            left: '70vw',
            top: '10vh',
            width: '24vw',
            height: '28vh',
          }}
        >
          <img
            src="/images/automation-meeting.jpg"
            alt="Team collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F]/50 to-transparent" />
        </div>

        {/* Bottom-left body tile */}
        <div
          ref={bodyRef}
          className="card-tile absolute flex flex-col justify-center p-8 lg:p-12"
          style={{
            left: '6vw',
            top: '42vh',
            width: '44vw',
            height: '48vh',
          }}
        >
          <p className="body-text text-lg mb-8">
            We replace repetitive work with reliable workflows—integrated across your tools, monitored in real time, and built to scale.
          </p>
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F2C94C]/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-[#F2C94C]" />
                </div>
                <span className="text-[#F4F6FA] font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-right visual tile */}
        <div
          ref={visualRef}
          className="card-tile absolute overflow-hidden"
          style={{
            left: '52vw',
            top: '42vh',
            width: '42vw',
            height: '48vh',
          }}
        >
          <img
            src="/images/automation-dashboard.jpg"
            alt="Automation dashboard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B62B8]/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 text-[#F4F6FA]">
              <Check className="w-5 h-5 text-[#F2C94C]" />
              <span className="text-sm font-medium">99.9% Uptime Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationSection;
