import { ArrowDownRight } from 'lucide-react';
import Image from 'next/image';
import DashboardPreview from './DashboardPreview';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 pt-24">
        <div className="animate-fade-in-up relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-24 pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-1.5 shadow-sm">
            <span className="text-sm font-medium text-black">
              Now Available
            </span>
            <span className="text-sm font-medium text-[#3b82f6]">✦</span>
          </div>

          <div className="mb-6 flex flex-col items-center leading-none text-center">
            <h1 className="text-5xl font-medium tracking-[-0.02em] text-black md:text-8xl md:leading-[1.02]">
              <span className="block">Manage Properties</span>
              <span className="block">
                with{' '}
                <span className="font-serif font-normal italic text-[#3b82f6]">
                  AI Intelligence
                </span>
              </span>
            </h1>
          </div>

          <p className="mb-8 max-w-2xl text-center text-base leading-7 text-[#525252] md:text-lg">
            The AI-native property management platform for landlords and
            tenants. Automate rent collection, maintenance, and tenant
            screening.
          </p>

          <div className="group relative">
            <button className="relative flex h-14 items-center rounded-xl bg-[#3b82f6] pr-11">
              <span className="flex h-full items-center rounded-xl bg-black px-6 text-[15px] font-medium leading-6 text-white">
                Get Started
              </span>
              <span className="absolute right-0 flex size-11 items-center justify-center rounded-xl text-white">
                <ArrowDownRight
                  size={20}
                  className="transition-transform duration-300 group-hover:-rotate-45 group-hover:translate-x-0.5"
                />
              </span>
            </button>
          </div>
        </div>

        <div className="-mt-2 flex w-full justify-center px-2 md:px-4">
          <div className="w-full max-w-[1022px] overflow-hidden bg-transparent flex justify-center">
            <DashboardPreview />
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-col items-center overflow-hidden px-6 pb-12 pt-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-16">
          {[
            'acmecorp.svg',
            'altshift.svg',
            'biosynthesis.svg',
            'boltshift.svg',
            'capsule.svg',
            'acmecorp.svg',
            'altshift.svg',
            'biosynthesis.svg',
            'boltshift.svg',
            'capsule.svg',
            'acmecorp.svg',
            'altshift.svg',
            'biosynthesis.svg',
            'boltshift.svg',
            'capsule.svg',
            'acmecorp.svg',
            'altshift.svg',
            'biosynthesis.svg',
            'boltshift.svg',
            'capsule.svg',
          ].map((logo, index) => (
            <Image
              key={index}
              src={`/Assets/${logo}`}
              alt={logo.replace('.svg', '')}
              width={100}
              height={100}
              className="h-8 w-auto opacity-80 brightness-0 invert transition-all duration-300 hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
