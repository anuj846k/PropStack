"use client";

import { AcmeCorp, CommandR, FocalPoint, Interlock } from "@/components/icons";
import Image from "next/image";
import { useEffect, useState } from "react";

const teamMembers = [
  {
    name: "Jennifer Walsh",
    img: "/Assets/JenniferWalsh.png",
    company: "CommandR",
    review:
      "Centora has transformed how we manage our property portfolio. The AI automation saves us hours every week.",
  },
  {
    name: "Micheal Torres",
    img: "/Assets/MichealTorres.png",
    company: "Interlock",
    review:
      "The rent collection automation is incredible. We've seen a 99% collection rate since switching to Centora.",
  },
  {
    name: "Amanda Chen",
    img: "/Assets/AmandaChen.png",
    company: "FocalPoint",
    review:
      "Real-time insights help us make data-driven decisions. Our vacancy costs have dropped significantly.",
  },
  {
    name: "David Patterson",
    img: "/Assets/DavidPatterson.png",
    company: "AcmeCorp",
    review:
      "Scaling our portfolio became effortless with Centora. The platform grows with us seamlessly.",
  },
];

const logos = [
  {
    name: "CommandR",
    component: <CommandR />,
    wrapperClass:
      "inline-flex h-[40px] flex-col items-start aspect-9/2 opacity-30",
    innerClass: "w-[180px] h-[40px] shrink-0 opacity-100",
  },
  {
    name: "Interlock",
    component: <Interlock />,
    wrapperClass:
      "inline-flex h-[44px] flex-col items-start aspect-[149.41/44] opacity-30",
    innerClass:
      "flex w-[149.41px] h-[44px] py-[0.001px] flex-col justify-center items-center shrink-0",
  },
  {
    name: "FocalPoint",
    component: <FocalPoint />,
    wrapperClass:
      "inline-flex h-[40px] flex-col items-start aspect-199/48 opacity-30",
    innerClass:
      "flex w-[165.83px] h-[40px] flex-col justify-center items-center shrink-0",
    extraInnerClass: "w-[165.83px] h-[39.999px] shrink-0 opacity-100",
  },
  {
    name: "AcmeCorp",
    component: <AcmeCorp />,
    wrapperClass:
      "inline-flex h-[40px] flex-col items-start aspect-101/24 opacity-30",
    innerClass:
      "flex w-[168.33px] h-[40px] flex-col justify-center items-center shrink-0",
    extraInnerClass: "w-[168.33px] h-[39.999px] shrink-0 opacity-100",
  },
];

const TrustedBy = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teamMembers.length);
    }, 4000);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="flex w-[1470px] px-[223px] py-[128px] flex-col items-start border-t border-b border-[rgba(168,217,70,0.15)] bg-white">
      <div className="h-[424.5px] max-w-[1024px] self-stretch">
        <div className="flex flex-col items-start w-5xl">
          <h1 className="text-[60px] leading-[75px] font-medium text-[#171717]">
            Trusted by teams worldwide
          </h1>

          {/* Team Members */}
          <div className="flex w-[1024px] justify-center items-start gap-12">
            <div className="flex h-[149.5px] pr-[100px] pl-1 items-center gap-6 flex-1">
              {teamMembers.map(({ name, img }, index) => (
                <div
                  key={name}
                  className="flex h-[149.5px] py-[38.75px] flex-col justify-center items-start"
                >
                  <div
                    className={`transition-all duration-500 ${
                      index === activeIndex
                        ? "opacity-100 scale-110"
                        : "opacity-60 scale-100"
                    }`}
                  >
                    <div
                      className={`flex w-[72px] h-[72px] justify-center items-center rounded-full transition-all duration-500 ${
                        index === activeIndex
                          ? "bg-[#3b82f6] ring-4 ring-[#3b82f6]/20"
                          : "bg-transparent"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={name}
                        width={72}
                        height={72}
                        className="w-[57.6px] h-[57.6px] max-w-[64.8px] shrink-0 rounded-full bg-white object-cover transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mt-12 min-h-[120px] w-full overflow-hidden">
            <div className="relative">
              {teamMembers.map(({ name, review, company }, index) => (
                <div
                  key={name}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out will-change-opacity ${
                    index === activeIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                  style={{
                    transition: "opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div className="flex flex-col gap-4 max-w-3xl">
                    <div className="relative">
                      <svg
                        className="absolute -left-8 -top-2 h-8 w-8 text-[#3b82f6]/20 transition-opacity duration-1000"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-xl leading-[32px] font-normal text-[rgba(10,10,10,0.70)] pl-6">
                        {review}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pl-6">
                      <div className="h-px w-8 bg-[#3b82f6]" />
                      <div className="flex flex-col">
                        <span className="text-base font-medium leading-6 text-[#171717]">
                          {name}
                        </span>
                        <span className="text-sm leading-5 text-[rgba(10,10,10,0.50)]">
                          {company}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logos */}
          <div className="h-10 w-5xl flex justify-between mt-12">
            {logos.map(
              (
                { name, component, wrapperClass, innerClass, extraInnerClass },
                index,
              ) => {
                const isActive = teamMembers[activeIndex]?.company === name;
                return (
                  <div
                    key={name}
                    className={`transition-all duration-500 ${
                      isActive
                        ? wrapperClass.replace("opacity-30", "opacity-100")
                        : wrapperClass
                    }`}
                  >
                    <div className={innerClass}>
                      {extraInnerClass ? (
                        <div className={extraInnerClass}>{component}</div>
                      ) : (
                        component
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
