import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Shield, Users, Timer } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AIAgentsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

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
        .fromTo(headlineRef.current, { x: '80vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.08)
        .fromTo(bodyRef.current, { y: '70vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.12)
        .fromTo(statRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0.14)
        .fromTo(featuresRef.current, { y: '70vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.16);

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl
        .fromTo(portraitRef.current, { x: 0, opacity: 1 }, { x: '-70vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(headlineRef.current, { x: 0, opacity: 1 }, { x: '70vw', opacity: 0, ease: 'power2.in' }, 0.72)
        .fromTo(bodyRef.current, { y: 0, opacity: 1 }, { y: '-40vh', opacity: 0, ease: 'power2.in' }, 0.74)
        .fromTo(statRef.current, { y: 0, opacity: 1 }, { y: '-40vh', opacity: 0, ease: 'power2.in' }, 0.76)
        .fromTo(featuresRef.current, { y: 0, opacity: 1 }, { y: '40vh', opacity: 0, ease: 'power2.in' }, 0.78);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Clock, text: '24/7 availability' },
    { icon: Shield, text: 'Consistent tone & compliance' },
    { icon: Users, text: 'Handoffs to your team' },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-[#0B0C0F] z-50"
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
            src="/images/agent-portrait.jpg"
            alt="AI agent"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F]/60 via-transparent to-transparent" />
        </div>

        {/* Top-right headline tile */}
        <div
          ref={headlineRef}
          className="card-tile absolute flex flex-col justify-center p-8 lg:p-12"
          style={{
            left: '42vw',
            top: '10vh',
            width: '52vw',
            height: '28vh',
          }}
        >
          <span className="micro-label mb-4">DIGITAL WORKFORCE</span>
          <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase">
            AI Agents & Digital Workers
          </h2>
        </div>

        {/* Middle-right body tile */}
        <div
          ref={bodyRef}
          className="card-tile absolute flex flex-col justify-center p-6 lg:p-8"
          style={{
            left: '42vw',
            top: '42vh',
            width: '30vw',
            height: '24vh',
          }}
        >
          <p className="body-text">
            Deploy agents that qualify leads, answer questions, and book meetings—across chat, email, and voice.
          </p>
        </div>

        {/* Stat tile */}
        <div
          ref={statRef}
          className="card-tile absolute flex flex-col justify-center items-center p-6 text-center"
          style={{
            left: '74vw',
            top: '42vh',
            width: '20vw',
            height: '24vh',
          }}
        >
          <Timer className="w-8 h-8 text-[#F2C94C] mb-3" />
          <p className="font-display text-3xl font-bold text-[#F4F6FA]">&lt;2min</p>
          <p className="text-sm text-[#A7ACB8] mt-1">Response time</p>
        </div>

        {/* Bottom-right feature tile */}
        <div
          ref={featuresRef}
          className="card-tile absolute flex flex-col justify-center p-6 lg:p-8"
          style={{
            left: '42vw',
            top: '70vh',
            width: '52vw',
            height: '20vh',
          }}
        >
          <div className="flex items-center justify-between">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F2C94C]/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-[#F2C94C]" />
                </div>
                <span className="text-sm text-[#F4F6FA] font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentsSection;
