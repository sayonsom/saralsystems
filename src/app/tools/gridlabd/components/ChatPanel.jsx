"use client";
import { useCallback } from 'react';

export default function ChatPanel({
  chatMessages,
  chatInput,
  isChatOpen,
  handleChatInputChange,
  handleSendChat,
  setIsChatOpen,
  setChatMessages
}) {
  return (
    <div className={`h-full border-l-2 border-gray-300 bg-gradient-to-b from-[#fff4ec] to-gray-50 flex flex-col transition-all duration-300 w-72`}>
      <div className="flex items-center justify-between px-2 py-1 border-b bg-gray-50 shrink-0">
        <button onClick={() => setIsChatOpen(o=>!o)} className="text-xs text-gray-600 hover:text-[#ea580b]">{isChatOpen ? '⟨' : '⟩'}</button>
        {isChatOpen && <div className="text-xs font-semibold">AI Assistant</div>}
        {isChatOpen && <button onClick={() => setChatMessages([{ role:'assistant', content:'Cleared. Ask another question.'}])} className="text-[10px] text-gray-500 hover:text-red-600">Clear</button>}
      </div>
      {isChatOpen && (
        <>
          <div className="flex-1 overflow-auto p-3 space-y-2 text-sm">
            {chatMessages.map((m,i)=>(
              <div key={i} className={`${m.role==='assistant' ? 'bg-orange-50 border border-orange-200' : 'bg-gray-100'} px-2 py-1`}> 
                <span className="block text-[10px] uppercase tracking-wide mb-0.5 text-gray-500">{m.role}</span>
                {m.content}
              </div>
            ))}
          </div>
          <div className="p-2 border-t bg-white/70 backdrop-blur-[1px] shrink-0 sticky bottom-0">
            <textarea
              rows={2}
              autoFocus
              value={chatInput}
              onChange={handleChatInputChange}
              onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); handleSendChat(); }}}
              placeholder="e.g. add node house_1"
              className="w-full text-xs border border-gray-300 focus:border-[#ea580b] outline-none p-2 resize-none mb-2 bg-white"
            />
            <div className="flex justify-between items-center">
              <div className="text-[10px] text-gray-500">Commands: add node NAME • set starttime TIME • set stoptime TIME</div>
              <button onClick={handleSendChat} className="px-3 py-1 bg-[#ea580b] text-white text-xs hover:bg-orange-600">Send</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
