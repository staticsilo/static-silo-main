"use client";

import { useEffect, useRef, useState } from "react";

export default function BusinessCardButton() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }

    const handleLoad = () => {
      setIsReady(true);
    };

    iframe.addEventListener("load", handleLoad);

    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, []);

  const handleAction = () => {
    const isMobile =
      window.matchMedia("(max-width: 767px), (pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini|IEMobile/i.test(
        navigator.userAgent,
      ) ||
      navigator.maxTouchPoints > 1;

    if (isMobile) {
      const downloadLink = document.createElement("a");
      downloadLink.href = "/static-silo-company-profile.pdf";
      downloadLink.download = "static-silo-company-profile.pdf";
      downloadLink.rel = "noopener";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      return;
    }

    const iframeWindow = iframeRef.current?.contentWindow;

    if (!iframeWindow) {
      return;
    }

    iframeWindow.focus();
    iframeWindow.print();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAction}
        className={`inline-flex min-h-10 whitespace-nowrap items-center justify-center border border-ember/40 bg-ember/5 px-4 font-display text-xs font-semibold uppercase tracking-[0.18em] text-parchment transition hover:border-eye/70 hover:text-eye ${
          isReady ? "" : "opacity-70"
        }`}
      >
        <span className="hidden sm:inline">{isReady ? "Business Card" : "Preparing..."}</span>
        <span className="sm:hidden">{isReady ? "Business Card" : "..."}</span>
      </button>

      <iframe
        ref={iframeRef}
        src="/company-profile"
        title="Business card print frame"
        className="pointer-events-none absolute h-0 w-0 border-0 opacity-0"
      />
    </>
  );
}
