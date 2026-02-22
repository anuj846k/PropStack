import { ArrowRight, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="relative w-full  flex justify-center items-center overflow-hidden">
      <div className="relative w-full ">
        {/* Background Image */}
        <Image
          src="/Assets/cta.png"
          alt="CTA Background"
          width={1200}
          height={800}
          className="w-full h-auto object-contain"
          priority
        />

        {/* Content Overlay */}
        <div className="absolute top-[33%] left-[38%] w-[24%] h-[45%] flex flex-col justify-between p-[4cqi] @container">
          {/* Top Label */}
          <div className="flex items-center gap-[1.5cqi]">
            <div className="w-[4cqi] h-[4cqi] bg-blue-600 rounded-[0.8cqi] flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-[2.5cqi] h-[2.5cqi]" />
            </div>
            <Link href="/dashboard" className="text-[4.5cqi] font-bold tracking-[0.2em] text-black uppercase hover:text-blue-600 transition-colors">
              Get Started
            </Link>
          </div>

          {/* Heading */}
          <h2 className="text-[10.5cqi] leading-[1.1] font-medium tracking-tight text-black">
            Wherever you are in the property journey, there is an{' '}
            <span className="text-blue-500">AI agent</span> designed for your
            next move.
          </h2>

          {/* Buttons */}
          <div className="flex items-center gap-[2cqi]">
            <button className="bg-black text-white px-[5cqi] py-[2.5cqi] rounded-[2cqi] text-[4.5cqi] font-medium hover:bg-gray-800 transition-colors">
              Find Your Agent
            </button>

            <button
              aria-label="Continue"
              className="bg-blue-500 text-white w-[10cqi] h-[10cqi] rounded-[2cqi] hover:bg-blue-600 transition-colors flex items-center justify-center shrink-0"
            >
              <ArrowRight className="w-[5cqi] h-[5cqi]" />
            </button>
          </div>

          {/* Decorative Lines */}
          <div className="flex flex-col gap-[2cqi] mt-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-[0.8cqi] bg-blue-500 ${i === 5 ? 'w-1/2' : 'w-3/4'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
