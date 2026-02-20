import { Component1, Component2, Component3 } from '../icons';

const steps = [
  {
    title: 'Add your properties',
    description:
      'Import your properties, units, and current tenancies. Our system automatically sets up rent collection and maintenance workflows.',
    Icon: Component1,
  },
  {
    title: 'Automate tenant interactions',
    description:
      'Our AI voice agent handles rent reminders, maintenance triage, and tenant screening via WhatsApp and phone calls.',
    Icon: Component2,
  },
  {
    title: 'Scale your portfolio',
    description:
      'Get real-time insights on vacancy costs, rent intelligence, and maintenance expenses to maximize your ROI.',
    Icon: Component3,
  },
];

const HowItWorks = () => {
  return (
    <section className="flex w-full flex-col items-start bg-[#F5F5F5] px-55.75 py-0 ">
      <div className="flex max-w-5xl self-stretch items-start justify-center gap-20 px-6 py-28">
        {/* Left Side */}
        <div className="flex flex-1 flex-col items-start gap-[23.4px]">
          <h2 className="self-stretch text-5xl font-stretch-expanded text-[#0A0A0A] text-[60px] font-[590] leading-15 tracking-[-1.5px]">
            How it works
          </h2>

          <p className="max-w-md self-stretch pb-[8.6px] text-[16.9px] font-normal leading-[29.25px] text-[rgba(10,10,10,0.60)]">
            Your property portfolio, managed by AI and launched on an{' '}
            <span className="text-[16.9px] font-[510] leading-[29.25px] text-[#0A0A0A]">
              intelligent platform,
            </span>{' '}
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
          <div className="absolute left-5.75 top-6 flex w-0.5 flex-col items-center justify-center pb-[2.02px]">
            <div className="h-[753.98px] w-0.5 bg-[#3b82f6]" />
          </div>

          <ul className="flex flex-col items-start self-stretch">
            {steps.map(({ title, description, Icon }, index) => (
              <li
                key={index}
                className="flex items-start gap-5 self-stretch pb-64"
              >
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6] text-white">
                  <Icon className="h-5 w-5 shrink-0" />
                </div>

                <div className="flex flex-col items-start gap-2 self-stretch pt-1">
                  <h3 className="self-stretch text-3xl font-bold">{title}</h3>

                  <p className="max-w-[384px] self-stretch text-[15.3px] font-normal leading-6.5 text-[rgba(10,10,10,0.60)]">
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
