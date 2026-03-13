import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gauge, Eye, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PerformanceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statementRef = useRef<HTMLDivElement>(null);

  const metrics = [
    { icon: Gauge, value: '<2s', label: 'Load targets', ref: 0 },
    { icon: Eye, value: '100%', label: 'Observability-first', ref: 1 },
    { icon: Layers, value: '∞', label: 'Scalable architecture', ref: 2 },
  ];

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
        .fromTo(portraitRef.current, { x: '-80vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(headlineRef.current, { x: '80vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.08);

      metricsRef.current.forEach((metric, index) => {
        scrollTl.fromTo(
          metric,
          { y: '60vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.12 + index * 0.04
        );
      });

      scrollTl.fromTo(
        statementRef.current,
        { y: '60vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.16
      );

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl
        .fromTo(portraitRef.current, { x: 0, opacity: 1 }, { x: '-70vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(headlineRef.current, { x: 0, opacity: 1 }, { x: '70vw', opacity: 0, ease: 'power2.in' }, 0.72);

      metricsRef.current.forEach((metric, index) => {
        scrollTl.fromTo(
          metric,
          { x: 0, opacity: 1 },
          { x: '70vw', opacity: 0, ease: 'power2.in' },
          0.74 + index * 0.02
        );
      });

      scrollTl.fromTo(
        statementRef.current,
        { x: 0, opacity: 1 },
        { x: '70vw', opacity: 0, ease: 'power2.in' },
        0.8
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-[#0B0C0F] z-[100]"
    >
      <div className="relative w-full h-full px-6 lg:px-0">
        {/* Left portrait tile */}
        <div
          ref={portraitRef}
          className="card-tile absolute overflow-hidden"
          style={{
            left: '6vw',
            top: '10vh',
            width: '34vw',
            height: '80vh',
          }}
        >
          <img
            src="/images/performance-portrait.jpg"
            alt="Performance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F]/60 via-transparent to-transparent" />
        </div>

        {/* Top-right headline */}
        <div
          ref={headlineRef}
          className="card-tile absolute flex flex-col justify-center p-8 lg:p-12"
          style={{
            left: '42vw',
            top: '10vh',
            width: '52vw',
            height: '26vh',
          }}
        >
          <span className="micro-label mb-4">WHY CODEBRIX</span>
          <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase">
            Built For Performance
          </h2>
        </div>

        {/* Middle-right metrics (3 tiles) */}
        {metrics.map((metric, index) => {
          const leftPositions = ['42vw', '59vw', '77vw'];
          return (
            <div
              key={metric.label}
              ref={(el) => { metricsRef.current[index] = el; }}
              className="card-tile absolute flex flex-col justify-center items-center p-6 text-center"
              style={{
                left: leftPositions[index],
                top: '40vh',
                width: index === 2 ? '17vw' : '15vw',
                height: '22vh',
              }}
            >
              <metric.icon className="w-6 h-6 text-[#F2C94C] mb-3" />
              <p className="font-display text-2xl lg:text-3xl font-bold text-[#F4F6FA]">{metric.value}</p>
              <p className="text-xs text-[#A7ACB8] mt-1">{metric.label}</p>
            </div>
          );
        })}

        {/* Bottom-right statement */}
        <div
          ref={statementRef}
          className="card-tile absolute flex flex-col justify-center p-8 lg:p-10"
          style={{
            left: '42vw',
            top: '66vh',
            width: '52vw',
            height: '24vh',
          }}
        >
          <p className="body-text text-lg">
            We ship systems designed to stay fast, stable, and easy to extend—without technical debt. Every build includes monitoring, logging, and error handling from day one.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
