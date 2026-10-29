import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Square } from "lucide-react";
import { stripMarkdown } from "../lib/stripMarkdown";

/**
 * VoiceOutput — Text-to-Speech via native Web Speech API
 *
 * Props:
 *   text: string        — the content to read aloud (markdown stripped)
 *   lang?: string       — BCP-47 language tag (default: browser lang)
 *   rate?: number       — speech rate, 0.5–2 (default: 1)
 *   pitch?: number      — pitch, 0–2 (default: 1)
 */

// Strip markdown so the synthesizer doesn't read "hashtag" or "asterisk",
// then turn paragraph breaks into pauses.
function toSpeech(md = "") {
  return stripMarkdown(md)
    .replace(/^\s*\|\s*/gm, "")             // table pipes at line start
    .replace(/\n{2,}/g, ". ")                 // paragraph breaks → pause
    .replace(/\n/g, " ")
    .trim();
}

export default function VoiceOutput({
  text,
  lang,
  rate = 1,
  pitch = 1,
}) {
  const [status, setStatus] = useState("idle"); // "idle" | "speaking" | "paused" | "finished" | "stopped" | "error"
  const [errorMsg, setErrorMsg] = useState("");
  const utteranceRef = useRef(null);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Cancel speech if the component unmounts or text changes while speaking
  const cancel = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
    setStatus("idle");
  }, [isSupported]);

  useEffect(() => () => cancel(), [cancel]);
  useEffect(() => {
    // If output changes while speaking, stop the previous reading
    if (status === "speaking" || status === "paused") cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const speak = () => {
    if (!isSupported) {
      setErrorMsg("Text-to-speech is not supported in this browser.");
      setStatus("error");
      return;
    }

    const cleaned = toSpeech(text);
    if (!cleaned) return;

    setErrorMsg("");
    window.speechSynthesis.cancel(); // clear any previous utterance

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = lang || navigator.language || "en-US";
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("finished");
    utterance.onerror = (e) => {
      if (e.error === "interrupted" || e.error === "canceled") {
        setStatus("idle");
        return;
      }
      setErrorMsg(`Speech error: ${e.error}`);
      setStatus("error");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    cancel();
    setStatus("stopped");
  };

  const togglePause = () => {
    if (!isSupported) return;
    if (status === "speaking") {
      window.speechSynthesis.pause();
      setStatus("paused");
    } else if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("speaking");
    }
  };

  const isSpeaking = status === "speaking";
  const isPaused = status === "paused";
  const isActive = isSpeaking || isPaused;

  // Text for the polite live region so screen readers hear state changes
  const statusMessage = {
    speaking: "Reading aloud",
    paused: "Reading paused",
    finished: "Finished reading",
    stopped: "Reading stopped",
  }[status] || "";

  return (
    <span className="relative inline-flex items-center gap-1">
      {/* Screen-reader status announcements for playback state */}
      <span role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </span>

      {/* Play / Pause button */}
      <button
        type="button"
        onClick={isActive ? togglePause : speak}
        disabled={!isSupported || !text}
        title={
          !isSupported
            ? "Text-to-speech not supported in this browser"
            : isSpeaking
            ? "Pause reading"
            : isPaused
            ? "Resume reading"
            : "Read response aloud"
        }
        aria-label={
          isSpeaking ? "Pause reading" : isPaused ? "Resume reading" : "Read response aloud"
        }
        aria-pressed={isActive}
        className={[
          "flex items-center justify-center w-8 h-8 transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          !isSupported || !text
            ? "opacity-40 cursor-not-allowed text-gray-400"
            : isActive
            ? "bg-zinc-400 text-white shadow-panel hover:bg-zinc-300 focus-visible:ring-zinc-400"
            : "bg-gray-100 text-gray-600 hover:bg-zinc-50 hover:text-zinc-700 focus-visible:ring-zinc-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-zinc-500/15 dark:hover:text-zinc-300",
        ].join(" ")}
      >
        {isSpeaking ? (
          <Volume2 size={15} strokeWidth={2} className="animate-pulse" />
        ) : (
          <Volume2 size={15} strokeWidth={2} />
        )}
      </button>

      {/* Stop button — only shown when active */}
      {isActive && (
        <button
          type="button"
          onClick={stop}
          title="Stop reading"
          aria-label="Stop reading"
          className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 hover:bg-zinc-50 hover:text-zinc-600 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-zinc-900/30 dark:hover:text-zinc-400"
        >
          <Square size={13} strokeWidth={2} fill="currentColor" />
        </button>
      )}

      {/* Animated sound bars when speaking */}
      {isSpeaking && (
        <span
          aria-hidden="true"
          className="flex items-end gap-px h-4 ml-0.5"
        >
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-0.5 bg-zinc-500 "
              style={{
                height: "40%",
                animation: `soundBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
          <style>{`
            @keyframes soundBar {
              from { height: 25%; }
              to   { height: 100%; }
            }
          `}</style>
        </span>
      )}

      {/* Paused indicator */}
      {isPaused && (
        <span className="text-xs text-zinc-500 font-medium ml-1">paused</span>
      )}

      {/* Error tooltip */}
      {status === "error" && errorMsg && (
        <span
          role="alert"
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 w-56 px-2.5 py-1.5 text-xs text-white bg-zinc-600 shadow-panel"
        >
          {errorMsg}
        </span>
      )}
    </span>
  );
}
