"use client";

import { useEffect, useRef, useState } from "react";
import { Component1, Component2, Component3 } from "../icons";

const steps = [
  {
    title: "Add your properties",
    description:
      "Import your properties, units, and current tenancies. Our system automatically sets up rent collection and maintenance workflows.",
    Icon: Component1,
  },
  {
    title: "Automate tenant interactions",
    description:
      "Our AI voice agent handles rent reminders, maintenance triage, and tenant screening via WhatsApp and phone calls.",
    Icon: Component2,
  },
  {
    title: "Scale your portfolio",
    description:
      "Get real-time insights on vacancy costs, rent intelligence, and maintenance expenses to maximize your ROI.",
    Icon: Component3,
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsListRef = useRef<HTMLUListElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const stepsList = stepsListRef.current;
    const lineContainer = lineContainerRef.current;
    if (!section || !stepsList || !lineContainer) return;

    const calculateLineHeight = () => {
      // Get the last step element
      const stepElements = stepsList.querySelectorAll("li");
      if (stepElements.length === 0) return 753.98; // Fallback to original height

      const lastStep = stepElements[stepElements.length - 1];
      const lastStepIcon = lastStep.querySelector('div[class*="rounded-full"]');

      if (!lastStepIcon) return 753.98; // Fallback to original height

      // Calculate distance from line container top to center of last icon
      const lineContainerRect = lineContainer.getBoundingClientRect();
      const lastStepIconRect = lastStepIcon.getBoundingClientRect();

      // Distance from line container top to center of last icon
      const iconCenterY =
        lastStepIconRect.top -
        lineContainerRect.top +
        lastStepIconRect.height / 2;

      // Total line height should reach the center of the last icon
      // Add a small buffer to ensure it connects properly
      return Math.max(iconCenterY, 0);
    };

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Calculate scroll progress (0 to 1) based on section visibility
      // Start animating when section top reaches 70% of viewport
      // Complete when section bottom reaches top of viewport
      const triggerPoint = windowHeight * 0.7;
      const endPoint = -sectionHeight;
      const scrollRange = triggerPoint - endPoint;
      const currentScroll = triggerPoint - sectionTop;

      const scrollProgress = Math.max(
        0,
        Math.min(1, currentScroll / scrollRange),
      );

      // Determine which step should be active based on scroll progress
      // Divide scroll progress into segments for each step (each step gets ~33% of progress)
      const stepCount = steps.length;
      const stepSegment = 1 / stepCount; // Each step gets 1/3 of the progress

      let newActiveStepIndex = -1;
      for (let i = 0; i < stepCount; i++) {
        const stepStart = i * stepSegment;
        if (scrollProgress >= stepStart) {
          newActiveStepIndex = i;
        }
      }

      setActiveStepIndex(newActiveStepIndex);

      // Calculate line height based on scroll progress
      // Line fills proportionally as steps become active
      const maxLineHeight = calculateLineHeight();

      // When we reach the last step, ensure line is fully extended
      // Otherwise, animate based on scroll progress
      if (newActiveStepIndex === stepCount - 1) {
        // Last step is active - show full line to connect properly
        setLineHeight(maxLineHeight);
      } else {
        // Animate based on scroll progress
        const lineProgress = scrollProgress;
        setLineHeight(lineProgress * maxLineHeight);
      }
    };

    // Initial check after a small delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      handleScroll();
    }, 100);

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

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    window.addEventListener("resize", throttledHandleScroll, { passive: true });

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener("scroll", throttledHandleScroll);
      window.removeEventListener("resize", throttledHandleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex w-full flex-col items-center bg-[#F5F5F5] px-4 md:px-12 lg:px-55.75 py-0"
    >
      <div className="flex w-full max-w-5xl flex-col lg:flex-row items-start justify-center gap-12 lg:gap-20 px-0 lg:px-6 py-16 md:py-28">
        {/* Left Side */}
        <div className="flex w-full lg:flex-1 flex-col items-start gap-[23.4px] shrink-0">
          <h2 className="self-stretch text-4xl md:text-5xl lg:text-[60px] font-stretch-expanded text-[#0A0A0A] font-[590] leading-tight lg:leading-15 tracking-[-1.5px]">
            How it works
          </h2>

          <p className="max-w-md self-stretch pb-[8.6px] text-[16.9px] font-normal leading-[29.25px] text-[rgba(10,10,10,0.60)]">
            Your property portfolio, managed by AI and launched on an{" "}
            <span className="text-[16.9px] font-[510] leading-[29.25px] text-[#0A0A0A]">
              intelligent platform,
            </span>{" "}
            ready to scale with you.
          </p>

          <a
            href="#"
            className="flex items-center rounded-2xl bg-[#0A0A0A] px-6 py-3 text-[13.7px] font-[590] leading-5 text-[#F5F5F5]"
          >
            Start Managing
          </a>
        </div>

        {/* Right Side */}
        <div className="relative flex flex-1 flex-col items-start">
          {/* Vertical Line */}
          <div
            ref={lineContainerRef}
            className="absolute left-5.75 top-6 flex w-0.5 flex-col items-start"
          >
            <div
              className="w-0.5 bg-[#3b82f6] transition-all duration-300 ease-out"
              style={{
                height: `${Math.max(lineHeight, 0)}px`,
                minHeight: "0px",
              }}
            />
          </div>

          <ul
            ref={stepsListRef}
            className="flex flex-col items-start self-stretch"
          >
            {steps.map(({ title, description, Icon }, index) => {
              // Step should be visible if it's the active step or any previous step
              const isVisible = index <= activeStepIndex;

              return (
                <li
                  key={index}
                  className={`flex items-start gap-5 self-stretch transition-all duration-700 ease-out ${index !== steps.length - 1 ? "pb-64" : ""
                    } ${isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                    }`}
                  style={{
                    transitionDelay: isVisible ? `${index * 200}ms` : "0ms",
                  }}
                >
                  <div
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6] text-white transition-all duration-500 ${isVisible ? "scale-100" : "scale-90"
                      }`}
                    style={{
                      transitionDelay: isVisible ? `${index * 200}ms` : "0ms",
                    }}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                  </div>

                  <div className="flex flex-col items-start gap-2 self-stretch pt-1">
                    <h3 className="self-stretch text-3xl font-bold">{title}</h3>

                    <p className="max-w-[384px] self-stretch text-[15.3px] font-normal leading-6.5 text-[rgba(10,10,10,0.60)]">
                      {description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
