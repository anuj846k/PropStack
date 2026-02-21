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
      const sectionTop = rect.top;

      // Start reveal when section is in view; not too early so faded state is visible first
      const startPoint = windowHeight * 0.75;  // section in lower half of viewport
      const endPoint = windowHeight * 0.2;     // complete when section is in upper viewport
      const scrollRange = startPoint - endPoint;
      const currentScroll = startPoint - sectionTop;

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
      className="flex flex-col items-start py-24 px-55.75 font-semibold text-5xl leading-16.5 bg-background text-[#0A0A0A]"
    >
      <p className="flex flex-wrap">
        {words.map((word, index) => {
          const totalWords = words.length;
          const wordStartProgress = index / totalWords;
          const wordEndProgress = (index + 1) / totalWords;

          // Revealed = full black, no blur; unrevealed = faint shade + blur
          const isRevealed = scrollProgress >= wordEndProgress;
          const inTransition =
            scrollProgress > wordStartProgress && scrollProgress < wordEndProgress;
          const wordProgress = inTransition
            ? (scrollProgress - wordStartProgress) /
              (wordEndProgress - wordStartProgress)
            : 0;

          const opacity = isRevealed ? 1 : inTransition ? 0.14 + wordProgress * 0.86 : 0.14;
          const blurPx = isRevealed ? 0 : inTransition ? (1 - wordProgress) * 5 : 5;

          return (
            <span
              key={index}
              className="inline-block transition-all duration-300 ease-out"
              style={{
                color: `rgba(10, 10, 10, ${opacity})`,
                filter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
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
