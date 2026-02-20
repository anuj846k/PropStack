import {
  CornerBottomLeft,
  CornerBottomRight,
  CornerTopLeft,
  CornerTopRight,
} from '@/components/icons';
import Bento from '@/components/landing/Bento';
import CTA from '@/components/landing/CTA';
import Description from '@/components/landing/Description';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import TrustedBy from '@/components/landing/TrustedBy';
import Hero from '../components/landing/Hero';
import Navbar from '../components/landing/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-2.5 font-sans">
      <div className="relative overflow-hidden ">
        {/* Corner SVGs */}
        <CornerTopLeft className="absolute top-0 left-0 z-40 text-white" />
        <CornerTopRight className="absolute top-0 right-0 z-40 text-white" />
        <CornerBottomLeft className="absolute bottom-0 left-0 z-40 text-white" />
        <CornerBottomRight className="absolute bottom-0 right-0 z-40 text-white" />

        <div
          className="relative w-full"
          style={{
            backgroundImage: "url('/Assets/bg2.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Navbar />
          <Hero />
        </div>

        <div className="w-full flex flex-col items-center">
          <Description />
          <Bento />
          <TrustedBy />
          <HowItWorks />
          <Pricing />
          <CTA />
          <FAQ />
          <Footer />
        </div>
      </div>
    </main>
  );
}
