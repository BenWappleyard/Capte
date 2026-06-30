"use client";

import { useState, useEffect } from "react";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({ subsets: ["latin"], weight: "600" });

const PHRASE_1 = "Hi, Ben";
const PHRASE_2 = "Bonjour Ben";

export function TypewriterGreeting() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState(0);
  // 0: typing "Hi, Ben"
  // 1: deleting
  // 2: typing "Bonjour Ben"
  // 3: done

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    if (phase === 0) {
      if (text.length < PHRASE_1.length) {
        t = setTimeout(() => setText(PHRASE_1.slice(0, text.length + 1)), 80);
      } else {
        t = setTimeout(() => setPhase(1), 900);
      }
    } else if (phase === 1) {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), 45);
      } else {
        t = setTimeout(() => setPhase(2), 250);
      }
    } else if (phase === 2) {
      if (text.length < PHRASE_2.length) {
        t = setTimeout(() => setText(PHRASE_2.slice(0, text.length + 1)), 80);
      } else {
        setPhase(3);
      }
    }

    return () => clearTimeout(t);
  }, [text, phase]);

  return (
    <h1 className={`text-4xl mt-1 flex items-center justify-center gap-0.5 ${dancingScript.className}`}>
      {text}
      {phase < 3 && (
        <span
          className="inline-block w-0.5 bg-current ml-px"
          style={{ height: "1.1em", animation: "blink 0.9s step-end infinite" }}
        />
      )}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </h1>
  );
}
