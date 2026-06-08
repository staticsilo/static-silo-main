import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Static Silo",
  description: "A one-page digital business card for Static Silo.",
};

const serviceTags = [
  "Custom Software",
  "Web Apps",
  "Mobile Apps",
  "SaaS",
  "Automation",
  "Reporting",
];

export default function CompanyProfile() {
  return (
    <main className="min-h-screen bg-[#030405] p-5 text-[#F5F7FA] print:min-h-0 print:p-0">
      <style>{`
        @page {
          size: 105mm 60mm;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 105mm;
            height: 60mm;
            overflow: hidden;
            background: #030405;
          }
        }
      `}</style>

      <section className="mx-auto grid aspect-[7/4] w-full max-w-[980px] overflow-hidden rounded-[12px] border border-white/10 bg-[#080B10] shadow-[0_0_80px_rgba(0,200,255,0.16)] print:m-[1mm] print:h-[58mm] print:w-[103mm] print:max-w-none print:rounded-[2mm] print:shadow-none">
        <div className="relative isolate grid h-full grid-cols-[0.92fr_1.08fr] overflow-hidden">
          <div className="absolute inset-0 -z-20 bg-[#030405]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(125deg,rgba(0,200,255,0.20),rgba(37,99,255,0.10),rgba(138,43,255,0.14),rgba(255,43,214,0.10),rgba(255,122,0,0.10),rgba(255,208,0,0.08))]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.052)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.052)_1px,transparent_1px)] bg-[size:34px_34px] opacity-20" />

          <div className="flex flex-col justify-center border-r border-white/10 p-7 pb-10 print:px-[7mm] print:pb-[8.5mm] print:pt-[7mm]">
            <div>
              <Image
                src="/StaticSilo-1on1.png"
                alt="Static Silo logo"
                width={1254}
                height={1254}
                className="h-24 w-24 rounded-[10px] object-cover shadow-[0_0_34px_rgba(0,200,255,0.28)] print:h-[18mm] print:w-[18mm]"
                preload
              />
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#9BA3AF] print:mt-[4mm] print:text-[7px]">
                Static Silo
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-normal text-white print:mt-[1mm] print:text-[19px]">
                Code. Connect. Create.
              </h1>
            </div>
          </div>

          <div className="flex flex-col p-7 pb-10 print:px-[7mm] print:pb-[8.5mm] print:pt-[7mm]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00C8FF] print:text-[7px]">
                Software Development
              </p>
              <div className="mt-5 flex flex-wrap gap-2 print:mt-[4mm] print:gap-[1.5mm]">
                {serviceTags.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-[#F5F7FA] print:px-[2.5mm] print:py-[1mm] print:text-[6.5px]"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-14 grid gap-2 text-sm leading-6 text-[#D8DEE8] print:mt-[5mm] print:gap-[1.4mm] print:leading-[1.35]">
              <p className="text-xl font-semibold text-white print:text-[9.4px]">
                Wan Muhammad Faiz
              </p>
              <a
                className="text-lg font-semibold text-white print:text-[8.8px]"
                href="mailto:staticsilo@gmail.com"
              >
                staticsilo@gmail.com
              </a>
              <a
                className="text-lg font-semibold text-white print:text-[8.8px]"
                href="tel:+60104164294"
              >
                +60 10-416 4294
              </a>
              <p className="text-sm print:text-[7px]">
                Kuala Terengganu, Terengganu, Malaysia
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
