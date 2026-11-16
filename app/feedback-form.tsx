"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { FEEDBACK_EMAIL, WEB3FORMS_KEY } from "./site-config";

const GAME = "Fathomless Maw";
const kinds = ["Review", "Bug report", "Idea", "Question", "Other"] as const;
type Kind = (typeof kinds)[number];
type Status = "idle" | "sending" | "sent" | "error";

/** Fired by any "Leave Feedback" link on the site to open the feedback popup. */
export const OPEN_FEEDBACK_EVENT = "open-feedback";

const fieldClass =
  "w-full border border-parchment/20 bg-ink/80 px-4 py-3 text-base text-parchment placeholder:text-muted/80 transition focus:border-eye/70 focus:outline-none";
const labelClass = "font-type text-[11px] uppercase tracking-[0.24em] text-sepia";

function ratingText(rating: number) {
  return rating ? `${"★".repeat(rating)}${"☆".repeat(5 - rating)}  (${rating} / 5)` : "No rating given";
}

/** Everything the email shows, in order, as label -> value. Used by both the form service and the mail-app fallback. */
function emailFields(kind: Kind, rating: number, name: string, email: string, message: string) {
  return {
    Game: GAME,
    "Feedback type": kind,
    Rating: ratingText(rating),
    "Player name": name || "Not given",
    "Player email": email || "Not given (no reply possible)",
    Message: message,
    "Sent at": new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" }),
    "Sent from": window.location.href.split("#")[0],
  };
}

function emailSubject(kind: Kind, rating: number, name: string) {
  return [GAME, kind, rating ? `${"★".repeat(rating)} ${rating}/5` : null, name ? `from ${name}` : null]
    .filter(Boolean)
    .join(" · ");
}

function Skull({ lit }: Readonly<{ lit: boolean }>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
      <path
        d="M12 2.5c-4.7 0-8 3.3-8 7.6 0 2.6 1.2 4.5 3 5.6V19c0 .8.6 1.5 1.5 1.5h7c.9 0 1.5-.7 1.5-1.5v-3.3c1.8-1.1 3-3 3-5.6 0-4.3-3.3-7.6-8-7.6z"
        fill={lit ? "#e8dcc0" : "transparent"}
        stroke={lit ? "#e8dcc0" : "#8c7f68"}
        strokeWidth="1.3"
      />
      <circle cx="9" cy="11" r="1.9" fill={lit ? "#f2a531" : "#8c7f68"} />
      <circle cx="15" cy="11" r="1.9" fill={lit ? "#f2a531" : "#8c7f68"} />
      <path d="M11 15.2l1-1.6 1 1.6z" fill={lit ? "#0b0a08" : "#8c7f68"} />
      <path d="M10 20.5v-2M12 20.5v-2M14 20.5v-2" stroke={lit ? "#0b0a08" : "#8c7f68"} strokeWidth="1" />
    </svg>
  );
}

function FeedbackForm({ onClose }: Readonly<{ onClose: () => void }>) {
  const [kind, setKind] = useState<Kind>("Review");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return; // a bot filled the hidden field

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = emailSubject(kind, rating, name);
    const fields = emailFields(kind, rating, name, email, message);

    // No form key yet: hand the same email to the visitor's own mail app.
    if (!WEB3FORMS_KEY) {
      const body = Object.entries(fields)
        .map(([k, v]) => (k === "Message" ? `\n${k}:\n${v}\n` : `${k}: ${v}`))
        .join("\n");
      window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: `${GAME} feedback`,
          ...(email ? { replyto: email } : {}),
          ...fields,
        }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!res.ok || !json.success) throw new Error("not sent");
      setStatus("sent");
      setRating(0);
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="px-6 py-14 text-center sm:px-10">
        <p className="font-type text-xs uppercase tracking-[0.34em] text-eye/80">Received</p>
        <h3 className="mt-4 font-display text-3xl font-semibold tracking-wide text-parchment">
          Your word reached the silo.
        </h3>
        <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-sepia">
          Thank you. Every review and report is read, and the game is better for it.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center border border-sepia/50 px-7 font-display text-xs font-semibold uppercase tracking-[0.28em] text-parchment transition hover:border-eye/70 hover:text-eye"
          >
            Send Another
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center border border-parchment bg-parchment px-7 font-display text-xs font-bold uppercase tracking-[0.28em] text-ink transition hover:bg-eye"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 px-6 py-8 sm:px-10">
      {/* hidden from people; bots tend to fill it */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <fieldset>
        <legend className={labelClass}>What is it?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {kinds.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={`cursor-pointer border px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.18em] transition ${
                kind === k
                  ? "border-ember/80 bg-ember/10 text-ember"
                  : "border-parchment/20 text-sepia hover:border-parchment/50 hover:text-parchment"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Your rating (optional)</legend>
        <div className="mt-2 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n === rating ? 0 : n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} of 5`}
              aria-pressed={rating === n}
              className="cursor-pointer p-1 transition hover:scale-110"
            >
              <Skull lit={n <= (hover || rating)} />
            </button>
          ))}
          <span className="ml-3 font-type text-xs text-muted">{rating ? `${rating} / 5` : ""}</span>
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Name (optional)</span>
          <input name="name" type="text" autoComplete="name" maxLength={80} className={fieldClass} placeholder="Nameless" />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Email (optional, for a reply)</span>
          <input name="email" type="email" autoComplete="email" maxLength={120} className={fieldClass} placeholder="you@example.com" />
        </label>
      </div>

      <label className="grid gap-2">
        <span className={labelClass}>Your message</span>
        <textarea
          name="message"
          required
          minLength={5}
          maxLength={5000}
          rows={6}
          className={`${fieldClass} resize-y`}
          placeholder={
            kind === "Bug report"
              ? "What happened, where, and what you expected instead…"
              : "What you loved, what you hated, what you want next…"
          }
        />
      </label>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Sent straight to the studio.
          {status === "error" && (
            <span className="mt-1 block text-blood">
              It did not go through. Try again, or write to{" "}
              <a className="underline" href={`mailto:${FEEDBACK_EMAIL}`}>
                {FEEDBACK_EMAIL}
              </a>
              .
            </span>
          )}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-parchment bg-parchment px-8 font-display text-xs font-bold uppercase tracking-[0.28em] text-ink shadow-[0_0_0_4px_#0b0a08,0_0_0_5px_rgba(232,220,192,0.5)] transition hover:bg-eye disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Feedback"}
        </button>
      </div>
    </form>
  );
}

/** The "Leave Feedback" button and the popup it opens. */
export default function FeedbackDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    document.documentElement.classList.add("overflow-hidden");
    dialog.showModal();
    dialog.scrollTop = 0;
  }

  function close() {
    dialogRef.current?.close();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => document.documentElement.classList.remove("overflow-hidden");
    const openFromElsewhere = () => open();
    dialog.addEventListener("close", unlock);
    window.addEventListener(OPEN_FEEDBACK_EVENT, openFromElsewhere);
    return () => {
      dialog.removeEventListener("close", unlock);
      window.removeEventListener(OPEN_FEEDBACK_EVENT, openFromElsewhere);
      unlock();
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-ember/60 bg-ink/40 px-7 font-display text-xs font-semibold uppercase tracking-[0.28em] text-ember transition duration-300 hover:border-eye/70 hover:text-eye"
      >
        Leave Feedback
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="feedback-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="game-dialog no-scrollbar m-auto max-h-[92svh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto border border-parchment/15 bg-ink p-0 text-parchment shadow-[0_30px_120px_rgba(0,0,0,0.85)] backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="hatch">
          <div className="relative border-b border-parchment/10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,165,49,0.12),transparent_70%)] px-6 pb-7 pt-8 sm:px-10">
            <p className="font-type text-[11px] uppercase tracking-[0.34em] text-ember">
              {GAME} · Feedback
            </p>
            <h2
              id="feedback-title"
              className="mt-3 pr-12 font-display text-2xl font-semibold leading-tight tracking-wide text-parchment sm:text-4xl"
            >
              Tell us what you found down there.
            </h2>
            <p className="mt-3 text-base leading-7 text-sepia sm:text-lg">
              Reviews, bug reports, ideas, complaints. Every message goes straight to the studio.
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close feedback"
              className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-parchment/30 bg-ink/70 font-display text-lg text-parchment transition hover:border-eye/70 hover:text-eye"
            >
              ×
            </button>
          </div>
          <FeedbackForm onClose={close} />
        </div>
      </dialog>
    </>
  );
}
