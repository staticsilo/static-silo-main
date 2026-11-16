"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

const email = "staticsilo@gmail.com";
const encodedEmail = encodeURIComponent(email);
const pickerRevealDelayMs = 720;

type ProviderIconName = "gmail" | "outlook" | "m365" | "yahoo" | "mail";

type EmailProvider = {
  accentClass: string;
  href: string;
  icon: ProviderIconName;
  launch: "app" | "tab";
  name: string;
  surfaceClass: string;
};

const emailProviders: EmailProvider[] = [
  {
    accentClass: "from-[#EA4335]/35 via-[#FBBC05]/28 to-[#34A853]/35",
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}`,
    icon: "gmail",
    launch: "tab",
    name: "Gmail",
    surfaceClass:
      "bg-[linear-gradient(135deg,rgba(234,67,53,0.22),rgba(251,188,5,0.14),rgba(52,168,83,0.18),rgba(66,133,244,0.24))] border-[#EA4335]/22",
  },
  {
    accentClass: "from-[#0078D4]/35 via-[#1A8CFF]/24 to-[#65B7FF]/30",
    href: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedEmail}`,
    icon: "outlook",
    launch: "tab",
    name: "Outlook",
    surfaceClass:
      "bg-[linear-gradient(135deg,rgba(0,120,212,0.24),rgba(26,140,255,0.18),rgba(101,183,255,0.24))] border-[#0078D4]/24",
  },
  {
    accentClass: "from-[#6559FF]/35 via-[#8A2BFF]/28 to-[#C43AFF]/35",
    href: `https://outlook.office.com/mail/deeplink/compose?to=${encodedEmail}`,
    icon: "m365",
    launch: "tab",
    name: "Microsoft 365",
    surfaceClass:
      "bg-[linear-gradient(135deg,rgba(101,89,255,0.24),rgba(138,43,255,0.16),rgba(196,58,255,0.24))] border-[#8A2BFF]/24",
  },
  {
    accentClass: "from-[#5F01D1]/35 via-[#7B2CFF]/24 to-[#A973FF]/30",
    href: `https://compose.mail.yahoo.com/?to=${encodedEmail}`,
    icon: "yahoo",
    launch: "tab",
    name: "Yahoo",
    surfaceClass:
      "bg-[linear-gradient(135deg,rgba(95,1,209,0.24),rgba(123,44,255,0.18),rgba(169,115,255,0.24))] border-[#7B2CFF]/24",
  },
  {
    accentClass: "from-[#A1A9B6]/30 via-[#D7DDE6]/20 to-[#7B8798]/30",
    href: `mailto:${email}`,
    icon: "mail",
    launch: "app",
    name: "Mail App",
    surfaceClass:
      "bg-[linear-gradient(135deg,rgba(161,169,182,0.18),rgba(215,221,230,0.12),rgba(123,135,152,0.2))] border-white/[0.14]",
  },
];

function ProviderIcon({ icon }: { icon: ProviderIconName }) {
  if (icon === "gmail") {
    return (
      <svg
        viewBox="0 0 48 48"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="h-7 w-7 overflow-visible"
      >
        <path d="M9 34V16l15 11 15-11v18" fill="none" stroke="#EA4335" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 16l7 5.4V34H9z" fill="#4285F4" />
        <path d="M39 16l-7 5.4V34h7z" fill="#34A853" />
        <path d="M16 21.4V34h16V21.4L24 27z" fill="#FBBC05" opacity="0.96" />
      </svg>
    );
  }

  if (icon === "outlook") {
    return (
      <svg
        viewBox="0 0 48 48"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="h-7 w-7 overflow-visible"
      >
        <rect x="8" y="11" width="18" height="26" rx="4" fill="#0A5FD2" />
        <path d="M24 15h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H24z" fill="#38A0FF" />
        <path d="M24 18l8 6 8-6" fill="none" stroke="#DDF0FF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="24" r="5.8" fill="none" stroke="#F5FBFF" strokeWidth="3" />
      </svg>
    );
  }

  if (icon === "m365") {
    return (
      <svg
        viewBox="0 0 48 48"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="h-7 w-7 overflow-visible"
      >
        <defs>
          <linearGradient id="m365-gradient" x1="6" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5B5CFF" />
            <stop offset="0.55" stopColor="#8A2BFF" />
            <stop offset="1" stopColor="#D54CFF" />
          </linearGradient>
        </defs>
        <path d="M15 10l12-4 10 7v20l-12 9-10-6z" fill="url(#m365-gradient)" />
        <path d="M18 16l7-3 6 4v13l-7 5-6-4z" fill="#F6F0FF" opacity="0.14" />
        <path d="M16.5 19.2L24 15l7 4.2v9.6L24 33l-7.5-4.2z" fill="none" stroke="#F8F4FF" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "yahoo") {
    return (
      <svg
        viewBox="0 0 48 48"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="h-7 w-7 overflow-visible"
      >
        <circle cx="24" cy="24" r="18" fill="#7B2CFF" />
        <path d="M18.2 15h4.7l2.9 6 2.8-6h4.8l-5.6 10.4V33h-4.1v-7.6z" fill="#fff" />
        <path d="M31.4 33.6h3.1l1.3-10.2h-4.1z" fill="#fff" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="h-7 w-7 overflow-visible"
    >
      <rect x="7" y="12" width="34" height="24" rx="6" fill="#D9E2EC" opacity="0.18" />
      <path d="M11 16l13 10 13-10" fill="none" stroke="#F5F7FA" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 32V16h26v16" fill="none" stroke="#F5F7FA" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function StatusPill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`platform-cloud-entry border px-4 py-2 font-type text-[11px] uppercase tracking-[0.26em] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export default function StartProjectCard() {
  const [copied, setCopied] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);
  const pickerRevealTimeoutRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }

      if (pickerRevealTimeoutRef.current) {
        window.clearTimeout(pickerRevealTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!pickerOpen) {
      return;
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setPickerOpen(false);
      }
    }

    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [pickerOpen]);

  function resetCopiedState() {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimeoutRef.current = null;
    }, 980);
  }

  function schedulePickerReveal() {
    if (pickerRevealTimeoutRef.current) {
      window.clearTimeout(pickerRevealTimeoutRef.current);
    }

    pickerRevealTimeoutRef.current = window.setTimeout(() => {
      setPickerOpen(true);
      pickerRevealTimeoutRef.current = null;
    }, pickerRevealDelayMs);
  }

  function triggerVictory() {
    setCopied(true);
    setBurstId((current) => current + 1);
    resetCopiedState();
  }

  async function startProjectFlow() {
    const clipboardWrite = writeEmailToClipboard();
    setPickerOpen(false);
    await clipboardWrite;
    triggerVictory();
    schedulePickerReveal();
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
    <div ref={wrapperRef} className="relative mx-auto max-w-5xl">
      {pickerOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="email-platform-title"
          className="absolute inset-x-4 top-5 z-40 sm:inset-x-8 lg:inset-x-12"
        >
          <div className="plate platform-cloud-entry bg-ink/95 px-4 py-4 backdrop-blur-xl sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <StatusPill className="border-eye/40 bg-ink-2 text-eye">
                Email Copied
              </StatusPill>
              <button
                type="button"
                aria-label="Close email app chooser"
                onClick={() => setPickerOpen(false)}
                className="platform-cloud-entry inline-flex h-10 w-10 items-center justify-center border border-sepia/40 font-display text-sm font-semibold text-parchment transition hover:border-eye/70 hover:text-eye [animation-delay:80ms]"
              >
                x
              </button>
            </div>

            <div className="mt-3 border-y border-parchment/10 px-4 py-3 text-center platform-cloud-entry [animation-delay:90ms]">
              <p className="font-type text-[11px] uppercase tracking-[0.3em] text-ember">
                Choose App
              </p>
              <h3
                id="email-platform-title"
                className="mt-2 font-display text-lg font-semibold tracking-wide text-parchment sm:text-xl"
              >
                Pick the email platform you want
              </h3>
            </div>

            <div className="mt-4 flex flex-wrap items-start justify-center gap-3 sm:gap-4">
              {emailProviders.map((provider, index) => (
                <button
                  key={provider.name}
                  type="button"
                  title={provider.name}
                  aria-label={provider.name}
                  onClick={() => openProvider(provider)}
                  className="platform-cloud-entry group/provider flex w-[4.9rem] flex-col items-center gap-2 text-center"
                  style={{ animationDelay: `${160 + index * 70}ms` }}
                >
                  <span
                    className={`relative inline-flex h-[4.6rem] w-[4.6rem] items-center justify-center rounded-full border ${provider.surfaceClass} shadow-[0_18px_36px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 group-hover/provider:-translate-y-1 group-hover/provider:scale-[1.04] group-hover/provider:shadow-[0_22px_44px_rgba(0,0,0,0.38),0_0_30px_rgba(226,238,108,0.18)]`}
                  >
                    <span
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${provider.accentClass} opacity-0 transition duration-300 group-hover/provider:opacity-100`}
                    />
                    <span className="relative inline-flex h-10 w-10 items-center justify-center">
                      <ProviderIcon icon={provider.icon} />
                    </span>
                  </span>
                  <span className="font-type text-[11px] leading-4 text-sepia">
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center">
              <StatusPill className="border-parchment/10 bg-ink-2 text-muted [animation-delay:420ms]">
                Click outside to close
              </StatusPill>
            </div>
          </div>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={startProjectFlow}
        onKeyDown={handleKeyDown}
        aria-label={`Copy Static Silo email address and choose an email platform: ${email}`}
        className="plate group/cta relative cursor-pointer overflow-hidden p-2 transition duration-500 hover:border-eye/40 hover:shadow-[inset_0_0_0_4px_#13110d,inset_0_0_0_5px_rgba(226,238,108,0.25),0_0_70px_rgba(226,238,108,0.12)] active:scale-[0.995] focus:outline-none focus-visible:ring-2 focus-visible:ring-eye/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(226,238,108,0.12),transparent_65%)] opacity-0 transition duration-500 group-hover/cta:opacity-100" />
        <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 skew-x-[-18deg] bg-parchment/10 blur-2xl transition-transform duration-700 group-hover/cta:translate-x-[430%]" />

        {copied && (
          <span key={burstId} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
            <span className="victory-screen-flash" />
            <span className="victory-ring left-1/2 top-1/2" />
            <span className="victory-ring left-1/2 top-1/2 [animation-delay:160ms]" />
            <span className="victory-badge left-1/2 top-1/2">
              <span className="text-lg sm:text-xl">{"Signal Sent"}</span>
            </span>
            <span className="victory-particle left-[10%] top-[18%] bg-eye [--victory-x:-46px] [--victory-y:-52px]" />
            <span className="victory-particle left-[18%] top-[78%] bg-ember [--victory-x:-58px] [--victory-y:46px] [animation-delay:45ms]" />
            <span className="victory-particle left-[30%] top-[20%] bg-parchment [--victory-x:-24px] [--victory-y:-70px] [animation-delay:80ms]" />
            <span className="victory-particle left-[44%] top-[82%] bg-blood [--victory-x:-18px] [--victory-y:66px] [animation-delay:120ms]" />
            <span className="victory-particle left-[58%] top-[16%] bg-eye [--victory-x:20px] [--victory-y:-72px] [animation-delay:150ms]" />
            <span className="victory-particle left-[70%] top-[78%] bg-ember [--victory-x:44px] [--victory-y:58px] [animation-delay:190ms]" />
            <span className="victory-particle left-[84%] top-[24%] bg-parchment [--victory-x:62px] [--victory-y:-38px] [animation-delay:230ms]" />
            <span className="victory-particle left-[92%] top-[64%] bg-eye [--victory-x:70px] [--victory-y:30px] [animation-delay:270ms]" />
          </span>
        )}

        <div className="hatch relative border border-parchment/10 px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">
          <p className="font-type text-xs uppercase tracking-[0.34em] text-ember">
            Get in Touch
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-wide text-parchment sm:text-5xl">
            Send word to the silo.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-sepia">
            Players, press, publishers, or fellow developers — if you want news about the
            game or just want to say hello, Static Silo is listening.
          </p>
          <div className="mx-auto mt-9 inline-flex min-h-12 items-center justify-center border border-parchment/40 bg-ink px-7 font-display text-xs font-semibold uppercase tracking-[0.24em] text-parchment transition duration-300 group-hover/cta:border-eye/70 group-hover/cta:text-eye group-hover/cta:shadow-[0_0_34px_rgba(226,238,108,0.2)]">
            <span
              className={`mr-2 grid h-5 w-5 place-items-center rounded-full border text-[8px] transition duration-300 ${
                copied
                  ? "border-eye bg-eye text-ink"
                  : "border-eye/70 bg-eye/10 text-eye"
              }`}
              aria-hidden="true"
            >
              {copied ? "!" : "@"}
            </span>
            <span aria-live="polite">
              {pickerOpen ? "Choose App" : copied ? "Signal Sent" : "Copy Our Email"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
