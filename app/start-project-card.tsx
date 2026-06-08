"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

const email = "staticsilo@gmail.com";

export default function StartProjectCard() {
  const [copied, setCopied] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  function resetCopiedState() {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimeoutRef.current = null;
    }, 1900);
  }

  async function copyEmail() {
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

    setCopied(true);
    setBurstId((current) => current + 1);
    resetCopiedState();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copyEmail();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={copyEmail}
      onKeyDown={handleKeyDown}
      aria-label={`Copy Static Silo email address: ${email}`}
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
          <span aria-live="polite">{copied ? "Let's Build!" : "Press to Copy"}</span>
        </div>
      </div>
    </div>
  );
}
