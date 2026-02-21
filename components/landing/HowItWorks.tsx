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

  const [lineTop, setLineTop] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);
  const lineHeightRef = useRef(0);

  const measureLine = () => {
    const stepsList = stepsListRef.current;
    const container = lineContainerRef.current;
    if (!stepsList || !container) return;

    const items = stepsList.querySelectorAll("li");
    if (items.length < 2) return;

    const firstIcon = items[0].querySelector<HTMLDivElement>('div[class*="rounded-full"]');
    const lastIcon = items[items.length - 1].querySelector<HTMLDivElement>(
      'div[class*="rounded-full"]'
    );
    if (!firstIcon || !lastIcon) return;

    const containerRect = container.getBoundingClientRect();
    const firstRect = firstIcon.getBoundingClientRect();
    const lastRect = lastIcon.getBoundingClientRect();

    const firstCenterY = firstRect.top - containerRect.top + firstRect.height / 2;
    const lastCenterY = lastRect.top - containerRect.top + lastRect.height / 2;
    const height = Math.max(0, lastCenterY - firstCenterY);

    lineHeightRef.current = height;
    setLineTop(firstCenterY);
    setLineHeight(height);
  };

  const updateProgress = () => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const start = windowHeight * 0.8;
    const end = -rect.height * 0.3;
    const total = start - end;
    const current = start - rect.top;
    const progress = Math.max(0, Math.min(1, current / total));

    setProgressHeight(progress * lineHeightRef.current);
  };

  useEffect(() => {
    const run = () => {
      measureLine();
      updateProgress();
    };

    const t = setTimeout(run, 50);

    const handleResize = () => {
      measureLine();
      updateProgress();
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex w-full flex-col bg-[#F5F5F5] px-55.75 py-0"
    >
      <div className="flex max-w-5xl gap-20 px-6 py-28">
        {/* Left */}
        <div className="flex flex-1 flex-col gap-[23.4px]">
          <h2 className="text-[60px] font-semibold text-primary">
            How it works
          </h2>

          <p className="max-w-md text-[16.9px] leading-[29.25px] text-[rgba(10,10,10,0.60)]">
            Your property portfolio, managed by AI and launched on an{" "}
            <span className="font-normal text-primary">
              intelligent platform,
            </span>{" "}
            ready to scale with you.
          </p>

          <a className="w-fit rounded-2xl bg-primary px-6 py-3 text-[13.7px] font-medium text-white">
            Start Managing
          </a>
        </div>

        {/* Right */}
        <div
          ref={lineContainerRef}
          className="relative flex flex-1 flex-col"
        >
          {lineHeight > 0 && (
            <div
              className="absolute left-6 w-0.5"
              style={{ top: `${lineTop}px`, height: `${lineHeight}px` }}
            >
              {/* Static */}
              <div className="absolute inset-0 bg-neutral-300" />

              {/* Progress – smooth transition when height updates */}
              <div
                className="absolute top-0 w-full bg-brand-500 transition-[height] duration-500 ease-out"
                style={{ height: `${progressHeight}px` }}
              />
            </div>
          )}

          <ul ref={stepsListRef} className="flex flex-col">
            {steps.map(({ title, description, Icon }, i) => (
              <li
                key={i}
                className={`flex items-start gap-5 ${
                  i !== steps.length - 1 ? "pb-64" : ""
                }`}
              >
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <h3 className="text-3xl font-bold text-[#0A0A0A]">
                    {title}
                  </h3>

                  <p className="max-w-[384px] text-[15.3px] leading-6.5 text-[rgba(10,10,10,0.60)]">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;