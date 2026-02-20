'use client';

import { useEffect, useRef, useState } from 'react';

const Description = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate when section enters viewport
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Start animation when section top reaches 70% of viewport
      // Complete when section bottom reaches top of viewport
      const triggerPoint = windowHeight * 0.7;
      const endPoint = -sectionHeight;
      const scrollRange = triggerPoint - endPoint;
      const currentScroll = triggerPoint - sectionTop;

      const progress = Math.max(0, Math.min(1, currentScroll / scrollRange));
      setScrollProgress(progress);
    };

    // Initial check
    handleScroll();

    // Throttle scroll events
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    window.addEventListener('resize', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', throttledHandleScroll);
    };
  }, []);

  const text = "Landlords use our platform to automate rent collection, handle maintenance tickets via WhatsApp, and screen tenants with AI voice agents, blending human expertise with AI capabilities in a unified system.";
  const words = text.split(' ');

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-start py-16 md:py-24 px-6 md:px-12 lg:px-55.75 font-medium text-3xl md:text-5xl leading-tight md:leading-16.5 tracking-[-1.2px] bg-background"
    >
      <p className="flex flex-wrap">
        {words.map((word, index) => {
          // Calculate which words should be colored based on scroll progress
          // Each word gets a portion of the scroll progress
          const totalWords = words.length;
          const wordStartProgress = index / totalWords;
          const wordEndProgress = (index + 1) / totalWords;

          // Interpolate color based on scroll progress within this word's range
          let opacity = 0.3; // Start gray
          if (scrollProgress >= wordEndProgress) {
            opacity = 1; // Fully black
          } else if (scrollProgress > wordStartProgress) {
            // Gradually transition from gray to black
            const wordProgress = (scrollProgress - wordStartProgress) / (wordEndProgress - wordStartProgress);
            opacity = 0.3 + (wordProgress * 0.7); // Transition from 0.3 to 1.0
          }

          return (
            <span
              key={index}
              className="transition-opacity duration-200 ease-out"
              style={{
                color: `rgba(10, 10, 10, ${opacity})`,
              }}
            >
              {word}
              {index < words.length - 1 && '\u00A0'}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default Description;
