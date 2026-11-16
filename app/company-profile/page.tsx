import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Static Silo",
  description: "Business card for Static Silo, an independent game studio.",
};

const serviceTags = [
  "Indie Games",
  "Hand-etched Art",
  "Dark Worlds",
];

export default function CompanyProfile() {
  return (
    <main className="min-h-screen bg-[#0b0a08] p-5 text-[#e8dcc0] print:min-h-0 print:p-0">
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
            background: #0b0a08 !important;
          }

          body {
            margin: 0;
          }

          main,
          section {
            background: #0b0a08 !important;
          }
        }
      `}</style>

      <section className="mx-auto grid aspect-[5/3] w-full max-w-[920px] overflow-hidden border border-[#e8dcc0]/15 bg-[#13110d] shadow-[0_0_80px_rgba(0,0,0,0.6)] print:h-[54mm] print:w-[90mm] print:max-w-none print:rounded-none print:border-[#e8dcc0]/20 print:shadow-none">
        <div className="relative isolate grid h-full grid-cols-[0.8fr_1.2fr] overflow-hidden">
          <div className="absolute inset-0 -z-20 bg-[#0b0a08]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_30%,rgba(226,238,108,0.10),transparent_55%)]" />
          <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(-45deg,rgba(232,220,192,0.05)_0,rgba(232,220,192,0.05)_1px,transparent_1px,transparent_6px)]" />

          <div className="flex flex-col justify-between border-r border-[#e8dcc0]/10 px-6 py-6 print:px-[4mm] print:py-[3.8mm]">
            <div>
              <Image
                src="/brand/silo-engraved.webp"
                alt="Static Silo logo"
                width={1024}
                height={1024}
                className="h-20 w-20 border border-[#e8dcc0]/20 object-cover print:h-[14.5mm] print:w-[14.5mm]"
                preload
              />
              <p className="mt-4 font-type text-[10px] uppercase tracking-[0.3em] text-[#8c7f68] print:mt-[2.8mm] print:text-[5.8px]">
                Static Silo
              </p>
              <h1 className="mt-2 font-display text-[28px] font-semibold leading-[1.05] tracking-wide text-[#e8dcc0] print:mt-[0.8mm] print:text-[12px]">
                Independent Games.
              </h1>
            </div>

            <div className="mt-6 print:mt-[2.6mm]">
              <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(185,166,132,0.8),transparent)]" />
            </div>
          </div>

          <div className="flex flex-col px-6 py-6 print:px-[4mm] print:py-[3.8mm]">
            <div>
              <p className="font-type text-[11px] uppercase tracking-[0.24em] text-[#e2ee6c] print:text-[5.6px]">
                Independent Game Studio
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 print:mt-[2.1mm] print:gap-[1mm]">
                {serviceTags.map((service) => (
                  <span
                    key={service}
                    className="flex min-h-9 items-center justify-center border border-[#e8dcc0]/15 px-2 py-1.5 text-center font-display text-[10px] font-semibold leading-tight text-[#e8dcc0] print:min-h-[4.2mm] print:px-[1.1mm] print:py-[0.7mm] print:text-[4.8px]"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto grid gap-2 pt-5 text-sm leading-6 text-[#b9a684] print:gap-[0.85mm] print:pt-[2.1mm] print:leading-[1.18]">
              <p className="text-base font-semibold text-[#e8dcc0] print:text-[8px]">
                CT0165206-X
              </p>
              <p className="text-lg font-semibold text-[#e8dcc0] print:text-[12px]">
                Wan Muhammad Faiz
              </p>
              <a
                className="text-lg font-semibold text-[#e8dcc0] print:text-[10px]"
                href="mailto:staticsilo@gmail.com"
              >
                staticsilo@gmail.com
              </a>
              <a
                className="text-lg font-semibold text-[#e8dcc0] print:text-[10px]"
                href="tel:+60104164294"
              >
                +60 10-416 4294
              </a>
              <p className="text-[12px] text-[#8c7f68] print:text-[8px]">
                Kuala Terengganu, Terengganu, Malaysia
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
