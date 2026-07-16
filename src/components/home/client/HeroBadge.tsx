"use client";

import { useState, useEffect, useRef } from "react";

const TEXTS = ["轻松简历制作", "ZoneYottaZenith"];
const TYPE_SPEED = 90;
const DELETE_SPEED = 45;
const PAUSE_MS = 1800;

export default function HeroBadge() {
  const [display, setDisplay] = useState(TEXTS[0]);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("pausing");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(TEXTS[0].length);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = TEXTS[textIdx];

    if (phase === "typing") {
      if (charIdx < current.length) {
        timer.current = setTimeout(() => {
          setDisplay(current.slice(0, charIdx + 1));
          setCharIdx(i => i + 1);
        }, TYPE_SPEED);
      } else {
        timer.current = setTimeout(() => setPhase("pausing"), PAUSE_MS);
      }
    } else if (phase === "pausing") {
      timer.current = setTimeout(() => setPhase("deleting"), 200);
    } else if (phase === "deleting") {
      if (charIdx > 0) {
        timer.current = setTimeout(() => {
          setDisplay(current.slice(0, charIdx - 1));
          setCharIdx(i => i - 1);
        }, DELETE_SPEED);
      } else {
        setTextIdx(i => (i + 1) % TEXTS.length);
        setPhase("typing");
      }
    }

    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [phase, charIdx, textIdx]);

  return (
    <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/25 dark:border-white/15 text-primary mb-6 md:mb-10 backdrop-blur-md shadow-sm">
      <img
        src="/WJK.jpg"
        alt="avatar"
        className="w-5 h-5 md:w-9 md:h-9 rounded-md object-cover shrink-0 ring-1 ring-white/30"
      />
      <span className="text-sm md:text-lg font-medium tracking-wide italic">
        {display}
        <span className="animate-pulse opacity-70">|</span>
      </span>
    </div>
  );
}

