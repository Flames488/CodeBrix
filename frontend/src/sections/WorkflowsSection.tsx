import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitBranch, FileCheck, RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WorkflowsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
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
        .fromTo(headlineRef.current, { x: '-70vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(imageRef.current, { y: '-40vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.08)
        .fromTo(bodyRef.current, { x: '70vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.1)
        .fromTo(visualRef.current, { x: '-70vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.12)
        .fromTo(featuresRef.current, { x: '70vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.14);

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl
        .fromTo(headlineRef.current, { y: 0, opacity: 1 }, { y: '-40vh', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(imageRef.current, { x: 0, opacity: 1 }, { x: '-30vw', opacity: 0, ease: 'power2.in' }, 0.72)
        .fromTo(bodyRef.current, { x: 0, opacity: 1 }, { x: '30vw', opacity: 0, ease: 'power2.in' }, 0.74)
        .fromTo(visualRef.current, { y: 0, opacity: 1 }, { y: '50vh', opacity: 0, ease: 'power2.in' }, 0.76)
        .fromTo(featuresRef.current, { y: 0, opacity: 1 }, { y: '50vh', opacity: 0, ease: 'power2.in' }, 0.78);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: GitBranch, text: 'Visual workflow builder' },
    { icon: FileCheck, text: 'Conditional logic & branches' },
    { icon: RotateCcw, text: 'Audit logs & retry policies' },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-[#0B0C0F] z-[60]"
    >
      <div className="relative w-full h-full px-6 lg:px-0">
        {/* Top-left headline */}
        <div
          ref={headlineRef}
          className="card-tile absolute flex flex-col justify-center p-8 lg:p-10"
          style={{
            left: '6vw',
            top: '10vh',
            width: '44vw',
            height: '26vh',
          }}
        >
          <span className="micro-label mb-4">WORKFLOW AUTOMATION</span>
          <h2 className="heading-lg font-display font-bold text-[#F4F6FA] uppercase">
            Smart Workflows
          </h2>
        </div>

        {/* Top-center image */}
        <div
          ref={imageRef}
          className="card-tile absolute overflow-hidden"
          style={{
            left: '52vw',
            top: '10vh',
            width: '20vw',
            height: '26vh',
          }}
        >
          <img
            src="/images/workflow-laptop.jpg"
            alt="Workflow"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top-right body */}
        <div
          ref={bodyRef}
          className="card-tile absolute flex flex-col justify-center p-6 lg:p-8"
          style={{
            left: '74vw',
            top: '10vh',
            width: '20vw',
            height: '26vh',
          }}
        >
          <p className="body-text text-sm">
            Connect your stack. Automate handoffs. Reduce busywork.
          </p>
        </div>

        {/* Bottom-left visual */}
        <div
          ref={visualRef}
          className="card-tile absolute overflow-hidden"
          style={{
            left: '6vw',
            top: '40vh',
            width: '44vw',
            height: '50vh',
          }}
        >
          <img
            src="/images/workflow-globe.jpg"
            alt="Global workflows"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B62B8]/20 to-transparent" />
        </div>

        {/* Bottom-right features */}
        <div
          ref={featuresRef}
          className="card-tile absolute flex flex-col justify-center p-8 lg:p-10"
          style={{
            left: '52vw',
            top: '40vh',
            width: '42vw',
            height: '50vh',
          }}
        >
          <h3 className="font-display font-semibold text-lg text-[#F4F6FA] mb-6">
            Workflow Features
          </h3>
          <div className="space-y-5">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F2C94C]/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-[#F2C94C]" />
                </div>
                <span className="text-[#F4F6FA] font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowsSection;
