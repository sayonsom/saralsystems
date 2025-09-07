"use client";
export default function BottomConsole({ resultsData, consoleOutput }) {
  return (
    <div className="h-64 bg-white border-t-2 border-gray-300 shrink-0 flex flex-col">
      <div className="p-4 flex-1 overflow-auto">
        {resultsData ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-500">Simulation Results:</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-100 rounded-lg shadow"><div className="text-xs font-semibold text-gray-700 uppercase mb-2">Voltage Violations</div><div className="text-lg font-bold text-[#ea580b]">{resultsData.voltageViolations}</div></div>
              <div className="p-3 bg-gray-100 rounded-lg shadow"><div className="text-xs font-semibold text-gray-700 uppercase mb-2">Peak Load (kW)</div><div className="text-lg font-bold text-[#ea580b]">{resultsData.peakLoad}</div></div>
              <div className="p-3 bg-gray-100 rounded-lg shadow"><div className="text-xs font-semibold text-gray-700 uppercase mb-2">Losses (kW)</div><div className="text-lg font-bold text-[#ea580b]">{resultsData.losses}</div></div>
              <div className="p-3 bg-gray-100 rounded-lg shadow"><div className="text-xs font-semibold text-gray-700 uppercase mb-2">Convergence</div><div className="text-lg font-bold text-[#10B981]">{resultsData.convergence ? 'Yes' : 'No'}</div></div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No results available. Run the simulation to see results here.</div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <h3 className="font-bold text-sm mb-3">Console Output</h3>
        <div className="space-y-2">
          {consoleOutput.map((msg, idx) => (
            <div key={idx} className={`text-xs p-2 rounded-lg ${msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <span className="font-semibold">{msg.timestamp}</span>: {msg.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
