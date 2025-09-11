"use client";
import { useEffect, useState } from 'react';

export default function RunBar({
  runSimulation,
  isRunning,
  selectedFile,
  simulationProgress,
  onRunPersisted,
  onRunArchive,
  onDownloadOutputs,
  onCancel,
  runningSimulations = [],
}) {
  const latest = runningSimulations[0];

  // Dismiss control
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissal when a new run starts or when latest returns to an active state
  useEffect(() => { if (isRunning) setDismissed(false); }, [isRunning]);
  useEffect(() => {
    if (latest && ['running', 'pending'].includes(latest.status)) setDismissed(false);
  }, [latest?.id, latest?.status]);

  // Show if running or we have a latest finished state, unless dismissed
  const shouldShowBase = isRunning || (latest && ['completed', 'failed', 'cancelled'].includes(latest?.status));
  const shouldShow = shouldShowBase && !dismissed;
  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-gray-800 text-white border-t border-gray-700 z-50">
      <div className="max-w-5xl mx-auto w-full h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="text-sm">{selectedFile ? `Current: ${selectedFile}` : 'No file loaded'}</div>
        </div>

        <div className="flex items-center gap-4">
          {isRunning && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Progress:</span>
              <div className="w-56 bg-gray-700 h-2">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
              <span className="text-sm">{simulationProgress}%</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {latest && (
            <>
              <button
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600"
                onClick={() => onDownloadOutputs && onDownloadOutputs(latest.id)}
                disabled={!latest}
              >
                Download outputs.zip
              </button>
              <button
                className="px-3 py-1 bg-red-700 hover:bg-red-600"
                onClick={() => setDismissed(true)}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
