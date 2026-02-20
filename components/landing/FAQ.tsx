'use client';

import { useState } from 'react';
import { MyChevronDown } from '../icons';

type FAQItem = {
  que: string;
  ans: string;
};

const FAQ = () => {
  const faqs: FAQItem[] = [
    {
      que: 'How does the AI voice agent work?',
      ans: 'Our AI voice agent uses advanced natural language processing to converse with tenants in multiple regional languages. It can handle rent reminders, negotiate payment plans, and triage maintenance issues just like a human property manager.',
    },
    {
      que: 'Do my tenants need to download an app?',
      ans: 'No! We know tenant app adoption is low. All tenant interactions happen natively through WhatsApp and phone calls. Only landlords and property managers need to use our dashboard.',
    },
    {
      que: 'How do you handle maintenance requests?',
      ans: 'Tenants send a message or photo via WhatsApp. Our AI analyzes the issue, determines the severity, and automatically contacts the appropriate vendor from your preferred list to schedule a repair.',
    },
    {
      que: 'What is Rent Price Intelligence?',
      ans: 'Our system continuously analyzes comparable properties in your area. Every 6 months, we provide a report showing if you are undercharging for rent, helping you maximize your rental yield.',
    },
    {
      que: 'How does the security deposit dispute resolution work?',
      ans: "We facilitate move-in and move-out video walkthroughs. Our AI analyzes the videos to document the condition of the unit, creating an indisputable visual record that prevents 'he said, she said' disputes.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="flex w-full flex-col items-center gap-16 bg-[#F5F5F5] py-16 md:py-30 px-4 md:px-8">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8 md:gap-16">
        {/* Upper section */}
        <div className="flex flex-col items-center gap-[13.3px] self-stretch pt-[2.75px]">
          <h1 className="flex flex-col items-center self-stretch text-center text-[#0A0A0A] text-4xl md:text-[48px] font-[590] leading-tight md:leading-12 tracking-[-1.2px]">
            Everything you need to know
          </h1>

          <div className="flex w-full max-w-xl flex-col items-center pt-[2.7px] text-center text-[#737373] text-[16.9px] font-normal leading-7">
            Can't find the answer you're looking for? Reach out!
          </div>

          <div className="flex flex-wrap content-center items-center justify-center self-stretch gap-x-3 gap-y-0 pt-[18.7px]">
            <a
              href=""
              className="flex items-center justify-center px-6 py-2.5 text-center text-[#F5F5F5] text-[13.7px] font-[590] leading-5 rounded-xl bg-[#0A0A0A]"
            >
              Get Started
            </a>

            <a
              href=""
              className="flex items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-6 py-2.5 text-center text-[#0A0A0A] text-[13.7px] font-[590] leading-5"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Questions and answers */}
        <div className="flex flex-col items-start gap-3 self-stretch">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => toggleFAQ(index)}
              className="flex flex-col items-start self-stretch p-6 rounded-3xl bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]"
            >
              <div className="flex items-center justify-between self-stretch">
                <h1 className="flex flex-col items-start text-[#0A0A0A] text-[16.9px] font-[510] leading-7 ">
                  {faq.que}
                </h1>

                <MyChevronDown
                  className={`flex flex-col items-start w-5 h-5 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : 'rotate-0'
                    }`}
                />
              </div>

              {activeIndex === index && (
                <div className="flex flex-col items-start self-stretch pt-4">
                  <p className="self-stretch text-[#737373] text-[15.3px] font-normal leading-6.5">
                    {faq.ans}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
