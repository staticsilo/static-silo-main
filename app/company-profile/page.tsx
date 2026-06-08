import type { Metadata } from "next";
import Image from "next/image";
import PrintTrigger from "./print-trigger";

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
      <PrintTrigger />

      <style>{`
        @page {
          size: 90mm 54mm;
          margin: 0;
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          html,
          body {
            width: 90mm;
            height: 54mm;
            overflow: hidden;
            background: #030405 !important;
          }

          body {
            margin: 0;
          }

          main,
          section {
            background: #030405 !important;
          }
        }
      `}</style>

      <section className="mx-auto grid aspect-[5/3] w-full max-w-[920px] overflow-hidden rounded-[12px] border border-white/10 bg-[#080B10] shadow-[0_0_80px_rgba(0,200,255,0.16)] print:h-[54mm] print:w-[90mm] print:max-w-none print:rounded-none print:border-white/15 print:shadow-none">
        <div className="relative isolate grid h-full grid-cols-[0.8fr_1.2fr] overflow-hidden">
          <div className="absolute inset-0 -z-20 bg-[#030405]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(125deg,rgba(0,200,255,0.20),rgba(37,99,255,0.10),rgba(138,43,255,0.14),rgba(255,43,214,0.10),rgba(255,122,0,0.10),rgba(255,208,0,0.08))]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.052)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.052)_1px,transparent_1px)] bg-[size:34px_34px] opacity-20" />

          <div className="flex flex-col justify-between border-r border-white/10 px-6 py-6 print:px-[4mm] print:py-[3.8mm]">
            <div>
              <Image
                src="/StaticSilo-1on1.png"
                alt="Static Silo logo"
                width={1254}
                height={1254}
                className="h-20 w-20 rounded-[10px] object-cover shadow-[0_0_34px_rgba(0,200,255,0.28)] print:h-[14.5mm] print:w-[14.5mm]"
                preload
              />
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9BA3AF] print:mt-[2.8mm] print:text-[5.8px]">
                Static Silo
              </p>
              <h1 className="mt-2 text-[30px] font-semibold leading-[1.02] tracking-normal text-white print:mt-[0.8mm] print:text-[12px]">
                Code. Connect. Create.
              </h1>
            </div>

            <div className="mt-6 print:mt-[2.6mm]">
              <div className="h-px w-full bg-[linear-gradient(90deg,rgba(0,200,255,0.85),rgba(138,43,255,0.75),rgba(255,122,0,0.7))]" />
            </div>
          </div>

          <div className="flex flex-col px-6 py-6 print:px-[4mm] print:py-[3.8mm]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#00C8FF] print:text-[5.6px]">
                Software Development
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 print:mt-[2.1mm] print:gap-[1mm]">
                {serviceTags.map((service) => (
                  <span
                    key={service}
                    className="flex min-h-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-2 py-1.5 text-center text-[10px] font-semibold leading-tight text-[#F5F7FA] print:min-h-[4.2mm] print:px-[1.1mm] print:py-[0.7mm] print:text-[4.8px]"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto grid gap-2 pt-5 text-sm leading-6 text-[#D8DEE8] print:gap-[0.85mm] print:pt-[2.1mm] print:leading-[1.18]">
              <p className="text-base font-semibold text-white print:text-[8px]">
                CT0165206-X
              </p>
              <p className="text-lg font-semibold text-white print:text-[12px]">
                Wan Muhammad Faiz
              </p>
              <a
                className="text-lg font-semibold text-white print:text-[10px]"
                href="mailto:staticsilo@gmail.com"
              >
                staticsilo@gmail.com
              </a>
              <a
                className="text-lg font-semibold text-white print:text-[10px]"
                href="tel:+60104164294"
              >
                +60 10-416 4294
              </a>
              <p className="text-[12px] text-[#C9D1DB] print:text-[8px]">
                Kuala Terengganu, Terengganu, Malaysia
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
