"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

// Constants (match app blue: #3b82f6)
const RING_ACTIVE = "#3b82f6";
const RING_TRACK = "#93c5fd";
const REVIEW_DURATION_MS = 10000;

// Ring radius in SVG viewBox (96px container, m-2 gap)
const RING_RADIUS = 48;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Types
interface TeamMember {
  name: string;
  title: string;
  img: string;
  company: string;
  review: string;
}

// Data
const teamMembers: TeamMember[] = [
  {
    name: "Jennifer Walsh",
    title: "Portfolio Manager",
    img: "/Assets/JenniferWalsh.png",
    company: "CommandR",
    review:
      "PropStack has transformed how we manage our property portfolio. The AI automation saves us hours every week.",
  },
  {
    name: "Michael Torres",
    title: "Head of Operations",
    img: "/Assets/MichealTorres.png",
    company: "Interlock",
    review:
      "From onboarding to full deployment, the entire process was seamless. Our team productivity increased by 40% and we couldn't be happier with the results.",
  },
  {
    name: "Amanda Chen",
    title: "Director of Analytics",
    img: "/Assets/AmandaChen.png",
    company: "FocalPoint",
    review:
      "Real-time insights help us make data-driven decisions. Our vacancy costs have dropped significantly.",
  },
  {
    name: "David Patterson",
    title: "VP of Growth",
    img: "/Assets/DavidPatterson.png",
    company: "AcmeCorp",
    review:
      "Scaling our portfolio became effortless with PropStack. The platform grows with us seamlessly.",
  },
];

// Sub-components
interface AvatarButtonProps {
  member: TeamMember;
  isActive: boolean;
  onClick: () => void;
}

const AvatarButton = ({ member, isActive, onClick }: AvatarButtonProps) => {
  const { name, img } = member;

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex justify-center items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 w-[96px] h-[96px]"
      aria-label={`View testimonial from ${name}`}
      aria-pressed={isActive}
    >
      <div
        className={`relative flex justify-center items-center w-[96px] h-[96px] origin-center transition-transform duration-300 ease-out ${
          isActive ? "scale-100" : "scale-[0.68]"
        }`}
      >
        {isActive && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              stroke={RING_TRACK}
              strokeWidth="1.5"
              className="opacity-70"
            />
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              stroke={RING_ACTIVE}
              strokeWidth="1.5"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeLinecap="round"
              style={
                {
                  strokeDashoffset: RING_CIRCUMFERENCE,
                  animation: `trustedByRing ${REVIEW_DURATION_MS}ms linear forwards`,
                } as React.CSSProperties
              }
            />
          </svg>
        )}
        {/* m-2 (8px) gap between outer ring and inner ring */}
        <div
          className={`relative z-10 flex justify-center items-center rounded-full overflow-hidden bg-white transition-all duration-300 m-2 ${
            isActive
              ? "w-[72px] h-[72px] border-[6px] border-brand-500"
              : "w-[56px] h-[56px] border-0"
          }`}
        >
          <Image
            src={img}
            alt={name}
            width={72}
            height={72}
            className={`shrink-0 rounded-full object-cover transition-all duration-300 ${
              isActive ? "w-[60px] h-[60px] grayscale-0" : "w-[56px] h-[56px] grayscale opacity-80"
            }`}
          />
        </div>
      </div>
    </button>
  );
};

interface TestimonialPanelProps {
  member: TeamMember;
  isActive: boolean;
}

const TestimonialPanel = ({ member, isActive }: TestimonialPanelProps) => {
  const { name, title, review, company } = member;

  return (
    <div
      role="tabpanel"
      className={`absolute inset-0 w-full transition-[opacity,transform] duration-700 ease-out ${
        isActive
          ? "opacity-100 translate-y-0 z-10"
          : "opacity-0 translate-y-4 z-0 pointer-events-none"
      }`}
    >
      <p className="text-xl leading-[32px] font-normal text-[rgba(38,38,38,0.78)] max-w-xl py-1">
        {review}
      </p>
      <p className="mt-5 text-base font-semibold leading-6 text-[#404040]">
        {name}, {title} @ {company}
      </p>
    </div>
  );
};

// Main component
const TrustedBy = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleAvatarClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teamMembers.length);
    }, REVIEW_DURATION_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="flex w-full px-[223px] py-24 flex-col items-start border-t border-b border-[rgba(59,130,246,0.15)] bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes trustedByRing { from { stroke-dashoffset: ${RING_CIRCUMFERENCE} } to { stroke-dashoffset: 0 } }`,
        }}
      />
      <div className="max-w-[1024px] self-stretch w-full">
        <div className="flex flex-col items-start w-full gap-16">
          <h1 className="text-[60px] leading-[75px] font-semibold text-primary">
            Trusted by teams worldwide
          </h1>

          <div className="flex flex-col items-start w-full gap-6">
            <div className="flex w-full items-start gap-16 py-8">
              <div className="flex items-center gap-8 shrink-0">
                {teamMembers.map((member, index) => (
                  <AvatarButton
                    key={member.name}
                    member={member}
                    isActive={index === activeIndex}
                    onClick={() => handleAvatarClick(index)}
                  />
                ))}
              </div>

              <div className="flex-1 min-w-0 py-2">
                <div className="relative w-full min-h-48 rounded-xl bg-white/80 px-4 py-3 overflow-hidden">
                  {teamMembers.map((member, index) => (
                    <TestimonialPanel
                      key={member.name}
                      member={member}
                      isActive={index === activeIndex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
