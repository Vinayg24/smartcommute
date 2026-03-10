import { useState } from 'react';

export default function DemoBadge() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="fixed bottom-4 right-4 z-50 cursor-pointer select-none"
    >
      <div className="bg-purple-900/90 border border-purple-500/50 rounded-full px-3 py-1.5 text-xs text-purple-200 flex items-center gap-2 shadow-lg backdrop-blur-sm">
        <span>🎭</span>
        <span>Demo Mode</span>
      </div>
      {expanded && (
        <div className="absolute bottom-10 right-0 bg-gray-900 border border-purple-500/30 rounded-lg p-3 text-xs text-gray-300 w-64 shadow-xl">
          <p className="font-semibold text-purple-300 mb-2">Demo Credentials</p>
          <p>👑 Admin: admin@smartcommute.com</p>
          <p className="mb-1 ml-4">Password: admin123</p>
          <p>👤 Employee: rahul@smartcommute.com</p>
          <p className="ml-4">Password: user123</p>
        </div>
      )}
    </div>
  );
}

