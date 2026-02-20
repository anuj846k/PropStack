'use client';

import { ArrowDown, LeftWingCurve, RightWingCurve } from '@/components/icons';
import { ArrowDownRight, Building2 } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { label: 'Products', hasDropdown: true },
  { label: 'Resources', hasDropdown: true },
  { label: 'Pricing', hasDropdown: false },
];

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex justify-center items-start">
      <div className="flex items-start">
        <LeftWingCurve className="h-12.5 w-12.5 text-white" />

        {/* Central Content */}
        <div className="bg-white text-black px-4 flex items-center justify-between h-[80px] w-[1024px] rounded-b-[32px] text-[14.4px] font-medium leading-5 tracking-wide">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">PropPilot</span>
          </Link>

          {/* Nav Links (centered) */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href="#"
                className="inline-flex items-center rounded-full px-4 h-9 transition-colors hover:bg-gray-100 text-primary"
              >
                {item.label}
                {item.hasDropdown && (
                  <ArrowDown className="ml-1 size-4 shrink-0" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 pr-2">
            <Link
              href="#"
              className="text- font-medium text-primary transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="#"
              className="group relative flex items-stretch h-11 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center bg-black text-white px-5 text-sm font-semibold rounded-xl tracking-widest">
                Try for free
              </span>
              <span className="flex items-center justify-center bg-[#3b82f6] text-white pl-5 pr-3 -ml-3 rounded-r-xl">
                <ArrowDownRight
                  size={18}
                  className="transition-transform duration-300 group-hover:-rotate-45"
                />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Wing */}
        <RightWingCurve className="h-12.5 w-12.5 text-white" />
      </div>
    </nav>
  );
}
