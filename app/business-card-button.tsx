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

  const handlePrint = () => {
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
        onClick={handlePrint}
        disabled={!isReady}
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#FF2BD6]/35 bg-[#FF2BD6]/10 px-4 text-sm font-semibold text-[#F5F7FA] transition hover:border-[#FFD000]/55 hover:bg-[#FFD000]/10 disabled:cursor-wait disabled:opacity-70"
      >
        <span className="hidden sm:inline">{isReady ? "Business Card" : "Preparing..."}</span>
        <span className="sm:hidden">{isReady ? "PDF" : "..."}</span>
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
