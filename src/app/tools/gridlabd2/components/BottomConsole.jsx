"use client";
export default function BottomConsole({ resultsData, consoleOutput, height = 260 }) {
  return (
    <div style={{ height }} className="bg-white border-t-2 border-gray-300 shrink-0 flex flex-col">
      {resultsData && (
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">Simulation Results</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-100 border border-gray-300"><div className="text-xs font-semibold text-gray-700 uppercase mb-2">Voltage Violations</div><div className="text-lg font-bold text-[#ea580b]">{resultsData.voltageViolations}</div></div>
              <div className="p-3 bg-gray-100 border border-gray-300"><div className="text-xs font-semibold text-gray-700 uppercase mb-2">Peak Load (kW)</div><div className="text-lg font-bold text-[#ea580b]">{resultsData.peakLoad}</div></div>
              <div className="p-3 bg-gray-100 border border-gray-300"><div className="text-xs font-semibold text-gray-700 uppercase mb-2">Losses (kW)</div><div className="text-lg font-bold text-[#ea580b]">{resultsData.losses}</div></div>
              <div className="p-3 bg-gray-100 border border-gray-300"><div className="text-xs font-semibold text-gray-700 uppercase mb-2">Convergence</div><div className="text-lg font-bold text-green-600">{resultsData.convergence ? 'Yes' : 'No'}</div></div>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-3 py-2 text-xs font-semibold text-gray-700 border-b border-gray-200">Console Output</div>
        <div className="flex-1 overflow-auto bg-[#0b0b0b] text-gray-100 font-mono text-xs leading-relaxed px-3 py-2">
          {consoleOutput && consoleOutput.length ? (
            consoleOutput.map((msg, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                <span className="text-gray-500">[{msg.timestamp}]</span> {msg.message}
              </div>
            ))
          ) : (
            <div className="text-gray-500">(no console output yet)</div>
          )}
        </div>
      </div>
    </div>
  );
}
