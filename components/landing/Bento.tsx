import { Rocket, Zap } from 'lucide-react';
import Image from 'next/image';
import type { ComponentType } from 'react';
import { Check, Star } from '../icons';

type Avatar = { src: string; alt: string };
type KpiRow = {
  Icon: ComponentType<{ className?: string }>;
  label: string;
  delta: string;
};

const AVATARS = [
  { src: '/Assets/img1.png', alt: 'User avatar 1' },
  { src: '/Assets/img2.png', alt: 'User avatar 2' },
  { src: '/Assets/img3.png', alt: 'User avatar 3' },
  { src: '/Assets/img4.png', alt: 'User avatar 4' },
] satisfies Avatar[];

const KPI_ROWS = [
  { Icon: Rocket, label: '2,598 Tickets Resolved', delta: '+24%' },
  { Icon: Zap, label: '99.9% Rent Collected', delta: '+0.2%' },
] satisfies KpiRow[];

const PROJECT_META = ['PRJ', '2024', 'LIVE'] as const;

const REALTIME_TABS = [
  { label: 'Rent', active: true },
  { label: 'Tickets', active: false },
  { label: 'Leases', active: false },
] as const;

const RINGS = [
  'h-[352px] w-[352px] border-[rgba(59,130,246,0.40)]',
  'h-[288px] w-[288px] border-[rgba(59,130,246,0.60)]',
  'h-[224px] w-[224px] border-[rgba(59,130,246,0.80)]',
] as const;

const ROUND_CARD = 'rounded-[32px]';
const PHONE_NOTCH =
  'absolute left-1/2 top-2 -translate-x-1/2 rounded-[16777200px] bg-[#262626]';
const KPI_TILE =
  'flex items-center justify-between rounded-xl bg-[#F5F5F5] p-3';
const META_TEXT = 'text-[12px] leading-4 tracking-[1.2px] text-[#404040]';

const Bento = () => {
  return (
    <section className="w-full bg-background px-4 pb-24 md:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-6 xl:flex-row xl:gap-4">
        <div
          className={`flex w-full flex-col overflow-hidden bg-secondary px-8 pt-8 xl:h-[658px] xl:w-2/5 ${ROUND_CARD}`}
        >
          <div className="flex flex-col pb-6">
            <h2 className="text-center text-[36px] font-medium leading-[45px] text-white">
              Automated Workflows
              <br />
              For Every Property
            </h2>
            <p className="mt-3 text-center text-sm leading-5 text-white/80">
              Manage units, tenants, and maintenance
              <br />
              tickets effortlessly
            </p>
          </div>

          <div className="flex flex-1 items-end justify-center">
            <div className="relative h-[460px] w-[256px] rounded-t-[32px] border-x-[6px] border-t-[6px] border-[#262626] bg-[#F5F5F5]">
              <div className="flex h-[454px] w-[244px] flex-col rounded-[50px] bg-[#F5F5F5] px-5 pb-[27.5px] pt-[72px]">
                <h3 className="text-[30px] leading-[30px] font-medium tracking-[-0.75px] text-[#171717]">
                  Your property
                </h3>
                <h3 className="mt-1 text-[30px] leading-[30px] font-medium tracking-[-0.75px] text-[#171717]">
                  is ready!
                </h3>
                <p className="pb-8 pt-4 text-sm leading-5 text-[#737373]">
                  Add units and invite
                  <br />
                  tenants instantly.
                </p>

                <div className="relative mt-auto h-[208px] w-full overflow-hidden rounded-2xl bg-linear-to-br from-[#3b82f6] via-[#3b82f6]/80 to-[#3b82f6]/50 p-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)]">
                  <div className="absolute inset-0">
                    <svg
                      width="204"
                      height="208"
                      viewBox="0 0 204 208"
                      fill="none"
                      aria-hidden="true"
                      className="h-full w-full"
                    >
                      <path
                        d="M0 208C40.8 161.778 81.6 150.222 122.4 173.333C163.2 196.444 190.4 173.333 204 104"
                        stroke="white"
                        strokeOpacity="0.15"
                        strokeWidth="1.32966"
                      />
                      <path
                        d="M0 190.667C54.4 144.445 102 132.889 142.8 156C183.6 179.111 204 156 204 86.667"
                        stroke="white"
                        strokeOpacity="0.1"
                        strokeWidth="1.32966"
                      />
                    </svg>
                  </div>

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm leading-6 font-semibold text-white">
                          Property
                        </p>
                        <p className="text-sm leading-6 font-semibold text-white">
                          Sunrise
                        </p>
                      </div>
                      <Check className="h-6 w-6 text-white opacity-50" />
                    </div>

                    <div
                      className={`mt-auto inline-flex items-center gap-2 text-[12px] leading-4 tracking-[1.2px] text-white/80`}
                    >
                      {PROJECT_META.map((item, index) => (
                        <div
                          key={item}
                          className="inline-flex items-center gap-2"
                        >
                          {index > 0 && <span>•</span>}
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${PHONE_NOTCH} h-5 w-20`} />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 xl:h-[658px] xl:w-3/5">
          <div
            className={`relative min-h-[320px] overflow-hidden bg-[#eff6ff] p-8 xl:h-[320px] ${ROUND_CARD}`}
          >
            <div className="max-w-[192px]">
              <h2 className="text-[24px] leading-[30px] font-medium text-[#171717]">
                Real-time Insights
              </h2>
              <p className="mt-3 text-sm leading-5 text-[#525252]">
                Monitor rent collection, vacancies,
                <br />
                and maintenance instantly
              </p>
            </div>

            <div className="absolute bottom-[7.89%] right-12 top-[7.89%] flex items-center justify-center">
              {RINGS.map((ringClass) => (
                <div
                  key={ringClass}
                  className={`pointer-events-none  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${ringClass}`}
                />
              ))}

              <div className="relative h-[288px] w-[192px] overflow-hidden rounded-[24px] border-4 border-[#262626] bg-[#F5F5F5] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-[#F5F5F5]" />
                <div className="absolute left-3 right-3 top-9 rounded-[16777200px] border border-[#E5E5E5] bg-white px-[9px] py-[7px] text-[12px] leading-4 text-[#A1A1A1]">
                  Search properties...
                </div>
                <div className="absolute left-3 top-[78px] text-[12px] leading-4 text-[#737373]">
                  Active units
                </div>
                <div className="absolute left-3 top-24 text-[28px] leading-7 font-medium text-[#171717]">
                  24 occupied
                </div>
                <div className="absolute left-3 top-[136px] flex items-start gap-[6px]">
                  {REALTIME_TABS.map((tab) => (
                    <div
                      key={tab.label}
                      className={
                        tab.active
                          ? 'rounded-[16777200px] bg-[#3b82f6] px-[10px] py-1 text-[12px] leading-4 text-white'
                          : 'px-2 py-1 text-[12px] leading-4 text-[#A1A1A1]'
                      }
                    >
                      {tab.label}
                    </div>
                  ))}
                </div>
                <div className={`${PHONE_NOTCH} h-4 w-16`} />
              </div>

              <div className="absolute -bottom-3 left-1/2 w-52 -translate-x-1/2 rounded-2xl bg-[#171717] px-6 py-3 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)]">
                <div className="flex items-center gap-2 text-[12px] leading-4 text-[#A1A1A1]">
                  <span>Collection status</span>
                  <span className="text-[#737373]">ⓘ</span>
                </div>
                <div className="mt-0.5 flex items-center gap-3">
                  <span className="text-base font-medium text-white">
                    All paid
                  </span>
                  <span className="rounded bg-[#3b82f633] px-2 py-[2px] text-[12px] leading-4 text-[#3b82f6]">
                    ✓ 100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid w-full gap-4 md:grid-cols-2 xl:flex-1 xl:grid-cols-2">
            <div
              className={`flex min-h-[256px] flex-col items-center justify-center bg-[#eff6ff] p-8 xl:h-full ${ROUND_CARD}`}
            >
              <h3 className="text-center text-[24px] font-[510] text-[#171717]">
                Trusted By
                <br />
                254k+ Users
              </h3>

              <div className="mt-5 flex items-center pr-4">
                {AVATARS.map((avatar, index) => (
                  <div
                    key={avatar.src}
                    className={`relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/25 ${
                      index === 0 ? '' : '-ml-3'
                    }`}
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="-ml-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/25 bg-[#3b82f6] text-sm leading-5 font-semibold text-white">
                  5+
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium leading-4 text-[#525252]">
                <Star />
                <span>4.9 from 48k+ reviews</span>
              </div>
            </div>

            <div
              className={`flex min-h-[256px] flex-col bg-secondary p-8 xl:h-full ${ROUND_CARD}`}
            >
              <div className="flex min-h-[78px] flex-1 flex-col gap-2 pb-[22px]">
                <h3 className="text-[24px] leading-[30px] font-medium text-white">
                  Built to Scale
                </h3>
                <p className="text-sm leading-5 text-white/80">
                  Enterprise-ready property management that
                  <br />
                  scales with your portfolio
                </p>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                {KPI_ROWS.map((row) => (
                  <div key={row.label} className={KPI_TILE}>
                    <div className="flex items-center gap-2">
                      <row.Icon className="h-4 w-4 text-[#737373]" />
                      <span className="text-sm leading-6 font-medium text-[#0A0A0A]">
                        {row.label}
                      </span>
                    </div>
                    <span className="text-sm leading-5 font-medium text-black">
                      {row.delta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bento;
