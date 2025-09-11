"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const words = [
    "modeling",
    "security",
    "transition",
    "justice",
    "forecasting",
    "simulations",
  ];

  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = isDeleting ? 50 : 100;

  useEffect(() => {
    const currentWord = words[wordIndex];
    const handler = setTimeout(() => {
      const updated = isDeleting
        ? currentWord.slice(0, Math.max(0, text.length - 1))
        : currentWord.slice(0, Math.min(currentWord.length, text.length + 1));
      setText(updated);
    }, typingSpeed);

    return () => clearTimeout(handler);
  }, [text, isDeleting, wordIndex]);

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (!isDeleting && text === currentWord) {
      const pause = setTimeout(() => setIsDeleting(true), 900);
      return () => clearTimeout(pause);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }
  }, [text, isDeleting, wordIndex]);

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-white"
      style={{ minHeight: "calc(100svh - 80px)" }}
    >
      {/* Background video removed */}
      <div className="relative z-20 w-full text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900">
            AI Platform for{" "}
            <span className="whitespace-nowrap">
              Energy{" "}
              <span className="text-orange-600">{text}</span>
              <span className="inline-block w-[0.08em] h-[1em] align-[-0.15em] bg-orange-600 ml-1 animate-pulse"></span>
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/tools"
              className="bg-orange-600 text-white px-8 py-3 rounded-none font-bold text-lg hover:bg-orange-700 transition-transform duration-300 inline-block transform hover:scale-105"
            >
              Access Tools
            </a>
            <a
              href="#contact"
              className="bg-transparent border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-none font-bold text-lg hover:bg-orange-50 transition-transform duration-300 inline-block transform hover:scale-105"
            >
              Call us today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
