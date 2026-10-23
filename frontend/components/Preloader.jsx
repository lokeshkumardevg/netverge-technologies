"use client"; // needed for Next.js App Router, harmless in plain React / Vite

import { useEffect, useRef, useState } from "react";
import "./Preloader.css";

/* ---------- Logo data (your original SVG) ---------- */
const ROOF = "M12 122 L112 22 Q118 16 124 22 L226 122";

// [path, delay in seconds]
const LINES = [
  ["M117 61 V247", 1.0],
  ["M117 83 H87 V201", 1.3],
  ["M117 94 H68 V157", 1.4],
  ["M117 111 H48 V181", 1.5],
  ["M117 88 H135 V194", 1.3],
  ["M117 106 H151 V163", 1.4],
  ["M117 119 H168 V175", 1.5],
  ["M117 132 H188 V194", 1.6],
  ["M117 120 H102 V139", 1.6],
  ["M117 75 H137 V109 H154 V135 H168", 1.7],
];

// [cx, cy, r, delay, white?]
const NODES = [
  [117, 247, 16, 1.95],
  [87, 201, 8.5, 2.1],
  [68, 157, 7.5, 2.15],
  [48, 181, 8, 2.2],
  [102, 139, 7.5, 2.25],
  [102, 139, 3.5, 2.35, true],
  [135, 194, 8, 2.25],
  [151, 163, 7.5, 2.3],
  [168, 175, 7.5, 2.35],
  [188, 194, 9, 2.4],
];

/**
 * <Preloader />
 *
 * Props
 *  - speed      : creation speed multiplier. 1 = fast, 1.5 = default, 2 = slow
 *  - hold       : ms to hold the full logo before fading out (default 1400)
 *  - minimal    : true -> only show once per browser session (sessionStorage)
 *  - ink        : colour of circuit lines / nodes (use "#080808" on a light bg)
 *  - background : preloader background colour
 *  - textColor  : colour of "Net" / "erge"
 *  - onFinish   : called when the preloader has fully faded out
 */
// ms after the exit fade begins when landing-page animations start.
// 0 = at the very start of the fade-out. Increase to start later, e.g. 300.
const START_PAGE_ANIM_AFTER_EXIT_MS = 0;

// Tells the CSS that the preloader is over, so landing-page animations can start.
function markPageLoaded() {
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("nv-loaded");
  }
}

export default function Preloader({
  speed = 1.5,
  hold = 1400,
  minimal = false,
  ink = "#f2f2f2",
  background = "#0d0d10",
  textColor = "#ffffff",
  onFinish = undefined,
}) {
  // phases: draw -> pulse -> reveal -> exit -> done
  const [phase, setPhase] = useState("draw");
  const [textWidth, setTextWidth] = useState(0);
  const textRef = useRef(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    // show only once per session if requested
    if (minimal) {
      try {
        if (sessionStorage.getItem("nv-preloader-seen")) {
          setPhase("done");
          markPageLoaded();
          finishRef.current?.();
          return;
        }
        sessionStorage.setItem("nv-preloader-seen", "1");
      } catch {}
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 0.2 : speed;

    const drawMs = (2.4 * k + 0.5) * 1000; // when icon creation finishes
    const pulseAt = drawMs;
    const revealAt = drawMs + 700;
    const exitAt = revealAt + 1100 + hold;
    const doneAt = exitAt + 1200;

    const t = [
      setTimeout(() => setPhase("pulse"), pulseAt),
      setTimeout(() => {
        if (textRef.current) setTextWidth(textRef.current.offsetWidth);
        setPhase("reveal");
      }, revealAt),
      // start landing-page animations as the preloader begins fading out,
      // so they are already moving while it disappears (no stall afterwards)
      setTimeout(() => {
        setPhase("exit");
        markPageLoaded();
      }, exitAt + START_PAGE_ANIM_AFTER_EXIT_MS),
      setTimeout(() => {
        setPhase("done");
        markPageLoaded();
        finishRef.current?.();
      }, doneAt),
    ];
    return () => t.forEach(clearTimeout);
  }, [speed, hold, minimal]);

  // lock page scroll while the preloader is visible
  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase === "done"]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "done") return null;

  return (
    <div
      className="nv-preloader"
      data-phase={phase}
      role="status"
      aria-label="Loading"
      style={{
        "--nv-bg": background,
        "--nv-ink": ink,
        "--nv-text": textColor,
        "--nv-k": speed,
      }}
    >
        
      <div className="nv-logo">
        {/* wordmark: slides out from behind the icon */}
        <div className="nv-wordmark" style={{ width: textWidth }}>
          <span className="nv-wordmark-inner" ref={textRef}>
            Net<span className="nv-v">V</span>erge
          </span>
        </div>

        {/* icon: gets drawn first */}
        <div className="nv-icon">
          <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="nv-draw nv-roof"
              pathLength="1"
              style={{ "--t": "1s", "--d": ".1s" }}
              d={ROOF}
              strokeWidth="23"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              className="nv-hole"
              style={{ "--d": "1s" }}
              cx="118"
              cy="37"
              r="6.5"
              fill="#fff"
            />

            <g className="nv-ink-stroke" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              {LINES.map(([d, delay], i) => (
                <path
                  key={i}
                  className="nv-draw"
                  pathLength="1"
                  style={{ "--d": `${delay}s`, "--t": i === 0 ? ".9s" : ".8s" }}
                  d={d}
                />
              ))}
            </g>

            <g className="nv-ink-fill">
              {NODES.map(([cx, cy, r, delay, white], i) => (
                <circle
                  key={i}
                  className={`nv-pop${white ? " nv-white" : ""}`}
                  style={{ "--d": `${delay}s` }}
                  cx={cx}
                  cy={cy}
                  r={r}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}