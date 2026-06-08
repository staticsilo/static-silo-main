"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

const email = "staticsilo@gmail.com";
const encodedEmail = encodeURIComponent(email);

type EmailProvider = {
  accentClass: string;
  badge: string;
  description: string;
  href: string;
  launch: "app" | "tab";
  name: string;
};

const emailProviders: EmailProvider[] = [
  {
    accentClass: "from-[#00C8FF]/35 via-[#2563FF]/22 to-[#8A2BFF]/30",
    badge: "G",
    description: "Open Gmail compose in a new tab.",
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}`,
    launch: "tab",
    name: "Gmail",
  },
  {
    accentClass: "from-[#2563FF]/35 via-[#00C8FF]/18 to-[#FFD000]/28",
    badge: "O",
    description: "For Outlook, Hotmail, and Live accounts.",
    href: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedEmail}`,
    launch: "tab",
    name: "Outlook.com",
  },
  {
    accentClass: "from-[#2563FF]/35 via-[#8A2BFF]/18 to-[#FF2BD6]/28",
    badge: "365",
    description: "Open Outlook for Microsoft 365 work accounts.",
    href: `https://outlook.office.com/mail/deeplink/compose?to=${encodedEmail}`,
    launch: "tab",
    name: "Microsoft 365",
  },
  {
    accentClass: "from-[#FFD000]/35 via-[#FF7A00]/18 to-[#FF2BD6]/28",
    badge: "Y",
    description: "Compose from Yahoo Mail in a new tab.",
    href: `https://compose.mail.yahoo.com/?to=${encodedEmail}`,
    launch: "tab",
    name: "Yahoo Mail",
  },
  {
    accentClass: "from-white/24 via-[#00C8FF]/12 to-[#FFD000]/24",
    badge: "@",
    description: "Use the email app installed on this device.",
    href: `mailto:${email}`,
    launch: "app",
    name: "Default Email App",
  },
];

async function writeEmailToClipboard() {
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = email;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

export default function StartProjectCard() {
  const [copied, setCopied] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!pickerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setPickerOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [pickerOpen]);

  function resetCopiedState() {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimeoutRef.current = null;
    }, 1900);
  }

  function triggerVictory() {
    setCopied(true);
    setBurstId((current) => current + 1);
    resetCopiedState();
  }

  async function startProjectFlow() {
    const clipboardWrite = writeEmailToClipboard();
    setPickerOpen(true);
    await clipboardWrite;
    triggerVictory();
  }

  function openProvider(provider: EmailProvider) {
    setPickerOpen(false);

    if (provider.launch === "app") {
      window.location.assign(provider.href);
      return;
    }

    const composeWindow = window.open(provider.href, "_blank");

    if (!composeWindow) {
      window.location.assign(`mailto:${email}`);
      return;
    }

    composeWindow.opener = null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startProjectFlow();
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={startProjectFlow}
        onKeyDown={handleKeyDown}
        aria-label={`Copy Static Silo email address and choose an email platform: ${email}`}
        className="group/cta relative mx-auto max-w-5xl cursor-pointer overflow-hidden rounded-[8px] bg-[linear-gradient(110deg,rgba(0,200,255,0.55),rgba(37,99,255,0.35),rgba(138,43,255,0.45),rgba(255,43,214,0.35),rgba(255,122,0,0.42),rgba(255,208,0,0.45))] p-px shadow-[0_0_48px_rgba(0,200,255,0.12)] transition duration-500 hover:scale-[1.01] hover:shadow-[0_0_58px_rgba(0,200,255,0.26),0_0_94px_rgba(255,43,214,0.18)] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#00C8FF]/70 focus:ring-offset-2 focus:ring-offset-[#030405]"
      >
        <span className="pointer-events-none absolute inset-[-40%] bg-[conic-gradient(from_0deg,#00C8FF,#2563FF,#8A2BFF,#FF2BD6,#FF7A00,#FFD000,#00C8FF)] opacity-0 blur-2xl transition duration-500 group-hover/cta:animate-[neon-orbit_5s_linear_infinite] group-hover/cta:opacity-55" />
        <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 skew-x-[-18deg] bg-white/25 blur-2xl transition-transform duration-700 group-hover/cta:translate-x-[430%]" />

        {copied && (
          <span key={burstId} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
            <span className="victory-screen-flash" />
            <span className="victory-ring left-1/2 top-1/2" />
            <span className="victory-ring left-1/2 top-1/2 [animation-delay:160ms]" />
            <span className="victory-badge left-1/2 top-1/2">
              <span className="text-xl sm:text-2xl">{"Let's Build!"}</span>
            </span>
            <span className="victory-particle left-[10%] top-[18%] bg-[#00C8FF] [--victory-x:-46px] [--victory-y:-52px]" />
            <span className="victory-particle left-[18%] top-[78%] bg-[#2563FF] [--victory-x:-58px] [--victory-y:46px] [animation-delay:45ms]" />
            <span className="victory-particle left-[30%] top-[20%] bg-[#8A2BFF] [--victory-x:-24px] [--victory-y:-70px] [animation-delay:80ms]" />
            <span className="victory-particle left-[44%] top-[82%] bg-[#FF2BD6] [--victory-x:-18px] [--victory-y:66px] [animation-delay:120ms]" />
            <span className="victory-particle left-[58%] top-[16%] bg-[#FFD000] [--victory-x:20px] [--victory-y:-72px] [animation-delay:150ms]" />
            <span className="victory-particle left-[70%] top-[78%] bg-[#FF7A00] [--victory-x:44px] [--victory-y:58px] [animation-delay:190ms]" />
            <span className="victory-particle left-[84%] top-[24%] bg-[#FFD000] [--victory-x:62px] [--victory-y:-38px] [animation-delay:230ms]" />
            <span className="victory-particle left-[92%] top-[64%] bg-[#00C8FF] [--victory-x:70px] [--victory-y:30px] [animation-delay:270ms]" />
          </span>
        )}

        <div className="relative rounded-[7px] bg-[#080B10]/95 px-6 py-10 text-center backdrop-blur-xl sm:px-10 lg:px-16 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFD000]">
            Start a Project
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[#F5F7FA] sm:text-5xl">
            Build the software and automation your operations need next.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#9BA3AF]">
            Share the business challenge, the software idea, and the outcome you need.
            Static Silo will help shape the technical path forward.
          </p>
          <div className="mx-auto mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-white/[0.16] bg-[#030405]/80 px-6 text-sm font-semibold text-[#F5F7FA] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 group-hover/cta:border-[#00C8FF]/70 group-hover/cta:shadow-[0_0_34px_rgba(0,200,255,0.24)]">
            <span
              className={`mr-2 grid h-5 w-5 place-items-center rounded-full border text-[8px] transition duration-300 ${
                copied
                  ? "border-[#FFD000] bg-[#FFD000] text-[#030405]"
                  : "border-[#00C8FF]/70 bg-[#00C8FF]/10 text-[#00C8FF]"
              }`}
              aria-hidden="true"
            >
              {copied ? "!" : "@"}
            </span>
            <span aria-live="polite">
              {pickerOpen ? "Choose Platform" : copied ? "Let's Build!" : "Press to Copy"}
            </span>
          </div>
        </div>
      </div>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#030405]/86 px-5 py-6 backdrop-blur-md"
          onClick={() => setPickerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-platform-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-4xl overflow-hidden rounded-[8px] border border-white/[0.1] bg-[#080B10]/96 shadow-[0_0_80px_rgba(0,0,0,0.45),0_0_52px_rgba(0,200,255,0.08)]"
          >
            <div className="border-b border-white/[0.08] px-6 py-5 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFD000]">
                    Email Options
                  </p>
                  <h3
                    id="email-platform-title"
                    className="mt-3 text-2xl font-semibold tracking-normal text-[#F5F7FA] sm:text-3xl"
                  >
                    Choose your email platform
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9BA3AF] sm:text-base">
                    The email address is already copied. Pick the service you want to
                    open and start writing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] px-4 text-sm font-semibold text-[#F5F7FA] transition hover:border-[#00C8FF]/60 hover:bg-white/[0.07]"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {emailProviders.map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    onClick={() => openProvider(provider)}
                    className="group/provider relative overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#0D1117]/85 p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#00C8FF]/40 hover:bg-[#111822]/95"
                  >
                    <span
                      className={`absolute inset-0 bg-gradient-to-br ${provider.accentClass} opacity-0 transition duration-300 group-hover/provider:opacity-100`}
                    />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <span className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#030405]/80 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#F5F7FA]">
                          {provider.badge}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9BA3AF] transition group-hover/provider:text-[#F5F7FA]">
                          Open
                        </span>
                      </div>
                      <h4 className="mt-5 text-lg font-semibold text-[#F5F7FA]">
                        {provider.name}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-[#9BA3AF] transition group-hover/provider:text-[#D3D9E2]">
                        {provider.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#9BA3AF]">
                  Press outside this panel or hit Escape to close it.
                </p>
                <button
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] px-5 text-sm font-semibold text-[#F5F7FA] transition hover:border-[#FFD000]/45 hover:bg-[#FFD000]/10"
                >
                  Stay on Site
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
