'use client';

import { useRef, useEffect } from 'react';
import { Bot, Lock, ChevronRight } from 'lucide-react';

export default function AIChatbot({ onCollapse }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <aside className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-gray-700" />
          <h3 className="text-sm font-semibold text-gray-700">AI Chatbot</h3>
          <span className="ml-2 text-[10px] uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 inline-flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Disabled
          </span>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          className="text-gray-500 hover:text-gray-700 text-xs inline-flex items-center gap-1"
          title="Collapse"
          aria-label="Collapse AI Chat"
        >
          Collapse
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="text-center text-xs text-gray-500 mt-8">
            Chat is disabled for now. Activate to ask questions about your project.
          </div>
          <div className="bg-white border border-gray-200 rounded p-2 text-xs text-gray-600">
            <div className="font-medium text-gray-700 mb-1">Sample</div>
            <p>
              Once activated, the assistant can help with GridLAB-D model structure, common issues,
              and interpreting outputs.
            </p>
          </div>
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 bg-white p-3">
          <div className="space-y-2">
            <div className="text-[11px] text-gray-500">AI is currently disabled.</div>
            <button
              type="button"
              disabled
              className="w-full px-3 py-2 bg-gray-200 text-gray-600 border border-gray-300 rounded cursor-not-allowed"
              title="Activate AI Chat"
              aria-label="Activate AI Chat"
            >
              Activate AI Chat
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}