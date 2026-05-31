import React from 'react';
import { LogEntry } from '../types';

interface AdventureLogProps {
  logs: LogEntry[];
}

export default function AdventureLog({ logs }: AdventureLogProps) {
  return (
    <div className="bg-[#fffcf5] rounded-3xl border-4 border-[#8b5e34] p-5 shadow-[4px_4px_0_0_#8b5e34] relative block overflow-hidden" id="adventure-log-scroll">
      <p className="text-[10px] uppercase font-mono tracking-wider text-[#8b5e34] mb-3 font-bold select-none">
        📜 ADVENTURE FEATS LOG (TIMELINE PETUALANGAN KERAJAAN)
      </p>
      <div 
        className="bg-[#fcf8f2] border-2 border-[#e2d6c3] rounded-xl p-4 h-[180px] overflow-y-auto space-y-2.5 font-mono text-xs text-[#5d4037] scrolling-touch" 
        id="logs-container"
      >
        {logs.length === 0 ? (
          <p className="text-[#8b5e34] text-center italic py-8 opacity-60">Belum ada aktivitas tercatat hari ini.</p>
        ) : (
          logs.map((log) => {
            let textAccent = 'text-[#5d4037]';
            if (log.type === 'quest_complete') textAccent = 'text-green-700 font-bold';
            if (log.type === 'level_up') textAccent = 'text-purple-800 font-black';
            if (log.type === 'quest_create') textAccent = 'text-amber-800 font-bold';
            if (log.type === 'quest_deleted') textAccent = 'text-stone-500';

            return (
              <div 
                key={log.id} 
                className="flex items-start gap-2 border-b border-[#e2d6c3]/40 pb-1.5 last:border-0"
              >
                <span className="text-[#8b5e34]/70 select-none text-[10px] font-medium shrink-0 pt-0.5">
                  [{log.time}]
                </span>
                <p className={`${textAccent} break-words`}>{log.message}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
