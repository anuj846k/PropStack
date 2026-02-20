import { CommandR, FocalPoint, AcmeCorp, Interlock } from "@/components/icons";
import Image from "next/image";

const teamMembers = [
  {
    name: "Jennifer Walsh",
    img: "/Assests/JenniferWalsh.png",
    highlight: false,
  },
  {
    name: "Micheal Torres",
    img: "/Assests/MichealTorres.png",
    highlight: true,
  },
  {
    name: "Amanda Chen",
    img: "/Assests/AmandaChen.png",
    highlight: false,
  },
  {
    name: "David Patterson",
    img: "/Assests/DavidPatterson.png",
    highlight: false,
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
    wrapperClass: "inline-flex h-[44px] flex-col items-start aspect-[149.41/44]",
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
              {teamMembers.map(({ name, img, highlight }) => (
                <div
                  key={name}
                  className="flex h-[149.5px] py-[38.75px] flex-col justify-center items-start"
                >
                  <div className="opacity-60">
                    <div
                      className={`flex w-[72px] h-[72px] justify-center items-center rounded-full ${
                        highlight ? "bg-[#3b82f6]" : ""
                      }`}
                    >
                      <Image
                        src={img}
                        alt={name}
                        width={72}
                        height={72}
                        className="w-[57.6px] h-[57.6px] max-w-[64.8px] shrink-0 rounded-full bg-white object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logos */}
          <div className="h-10 w-5xl flex justify-between">
            {logos.map(
              ({ name, component, wrapperClass, innerClass, extraInnerClass }) => (
                <div key={name} className={wrapperClass}>
                  <div className={innerClass}>
                    {extraInnerClass ? (
                      <div className={extraInnerClass}>{component}</div>
                    ) : (
                      component
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
