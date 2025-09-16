"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function ShareModal({ isOpen, onClose, title = "Share project", projectLink = "", multipleCount = 0, onSubmit }) {
  const [input, setInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setEmails([]);
      setInput("");
      setMessage("");
    }
  }, [isOpen]);

  const addFromInput = () => {
    const parts = (input || "").split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...emails];
    for (const p of parts) {
      if (isValidEmail(p) && !next.includes(p)) next.push(p);
    }
    setEmails(next);
    setInput("");
  };

  const removeEmail = (e) => {
    setEmails((prev) => prev.filter((x) => x !== e));
  };

  const canSubmit = emails.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center bg-black/50">
      <div ref={containerRef} className="mt-24 w-full max-w-xl mx-4 bg-white shadow-2xl rounded-none border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <div className="px-5 py-4 space-y-4">
          {multipleCount > 1 ? (
            <div className="text-sm text-gray-700">You are sharing <span className="font-medium">{multipleCount}</span> projects.</div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project link</label>
              <input
                type="text"
                value={projectLink || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-none bg-gray-50 text-gray-800"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add recipients</label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="email"
                placeholder="Type email and press Enter or ,"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addFromInput();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-none"
              />
              <button type="button" onClick={addFromInput} className="px-3 py-2 border border-gray-300 rounded-none hover:bg-gray-50">Add</button>
            </div>
            {emails.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {emails.map((e) => (
                  <span key={e} className="inline-flex items-center gap-2 px-2 py-1 text-sm bg-gray-100 border border-gray-300">
                    {e}
                    <button onClick={() => removeEmail(e)} className="text-gray-500 hover:text-gray-700">×</button>
                  </span>
                ))}
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">We will send recipients an email with access. Link expires in 24 hours.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Write a short note for the recipients..."
              className="w-full px-3 py-2 border border-gray-300 rounded-none"
            />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-none hover:bg-gray-50">Cancel</button>
          <button
            onClick={async () => { if (!canSubmit) return; await onSubmit?.({ emails, message }); onClose?.(); }}
            disabled={!canSubmit}
            className="px-4 py-2 rounded-none text-white disabled:opacity-50"
            style={{ background: "#EA580B" }}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

function isValidEmail(str) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}
