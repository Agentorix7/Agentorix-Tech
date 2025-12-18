"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TypewriterEffectProps = {
  words: string;
  className?: string;
  cursorClassName?: string;
  onComplete?: () => void;
  speed?: number;
};

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
  onComplete,
  speed = 30,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!words) {
      setIsTyping(false);
      if (onComplete) onComplete();
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText(words.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [words, speed, onComplete]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {isTyping && (
        <span
          className={cn(
            "inline-block ml-0.5 w-[2px] h-4 bg-current",
            cursorClassName
          )}
          style={{ animation: "blink 1s infinite" }}
        />
      )}
    </span>
  );
}

