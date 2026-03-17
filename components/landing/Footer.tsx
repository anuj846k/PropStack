"use client";

import { ArrowRight, Building2, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type FooterLinkGroup = {
  title: string;
  minWidth?: string;
  links: { label: string; href: string }[];
};

const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "MENU",
    minWidth: "min-w-[70.06px]",
    links: [
      { label: "Customers", href: "#" },
      { label: "Resources", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "Help", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "SOCIAL",
    minWidth: "min-w-[68.17px]",
    links: [
      { label: "X (Twitter)", href: "#" },
      { label: "Email", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

const headingClass =
  "flex flex-col items-start self-stretch text-white/50  text-[12px] font-[510] leading-[16px]  uppercase";

const linkClass =
  "flex flex-col items-start self-stretch pt-[2.75px] pb-[1.25px] text-white text-[13.7px] font-[400] leading-[20px]";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "You're on the waitlist!");
        setEmail("");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative flex w-full flex-col items-start bg-[#F5F5F5] pt-[152px]  ">
      <div className="flex flex-col items-start self-stretch rounded-tl-[48px] rounded-tr-[48px] bg-[#3b82f6] px-6 md:px-16 lg:px-[213px] pb-[64px] pt-[280px] md:pt-[320px] lg:pt-[384px] rounded-b-none">
        <div className="flex max-w-[1024px] flex-col items-start gap-[88px] self-stretch px-[24px] py-0">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-16 self-stretch">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-[8px]"
              aria-label="PropStack Home"
            >
              <div className="h-[32px] w-[32px] rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="flex flex-col items-start text-white font-bold text-xl ">
                PropStack
              </span>
            </a>

            {/* Navigation */}
            <nav
              className="flex items-start flex-wrap md:flex-nowrap gap-8 md:gap-[64px] w-full md:w-auto"
              aria-label="Footer Navigation"
            >
              {FOOTER_LINK_GROUPS.map((group) => (
                <div
                  key={group.title}
                  className={`flex flex-col items-start gap-[16px] self-stretch ${
                    group.minWidth ?? ""
                  }`}
                >
                  <h2 className={headingClass}>{group.title}</h2>

                  <ul className="flex flex-col items-start gap-[8px] self-stretch">
                    {group.links.map((link) => (
                      <li key={link.label} className="self-stretch">
                        <a href={link.href} className={linkClass}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Copyright */}
          <p className="flex flex-col items-center self-stretch text-center text-white/50 text-[13.6px]  leading-5">
            © 2026 PropStack. All rights reserved.
          </p>
        </div>
      </div>

      {/* Overlapping CTA Card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1024px] px-6 md:px-8">
        <div className="relative w-full rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center px-4 py-20 md:py-28 border border-white/20">
          {/* Blurred Background Image */}
          <div
            className="absolute inset-0 z-0 blur-[7px] scale-[1.02]"
            style={{
              backgroundImage: "url('/Assets/bg2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          <h1 className="relative z-10 text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-semibold text-primary mb-10">
            Start building something
            <br />
            truly amazing today
          </h1>

          <form 
            onSubmit={handleSubmit}
            className="relative z-10 flex items-center bg-white/90 backdrop-blur-sm rounded-full p-1.5 w-full max-w-md shadow-lg border border-white/50"
          >
            <div className="pl-4 pr-2 text-gray-500">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500 text-sm md:text-base min-w-0 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-black text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Joining..." : "Join Waitlist"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
