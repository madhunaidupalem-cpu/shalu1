/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Activity, ShieldCheck } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] SYSTEM_BOOT_SEQUENCE_COMPLETE`,
    `[${new Date().toLocaleTimeString()}] KERNEL_INIT: Snake_OS v1.2`,
    `[${new Date().toLocaleTimeString()}] AUDIO_DRIVER_ACTIVE: Synth_Engine`,
  ]);

  useEffect(() => {
    if (score > 0) {
      setLogs(prev => [...prev.slice(-7), `[${new Date().toLocaleTimeString()}] DATA_PACKET_CONSUMED: +10pts`]);
    }
  }, [score]);

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] text-[#e0e0e0] font-mono overflow-hidden">
      {/* Header */}
      <header className="w-full h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-black z-20">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_#dc2626]"></div>
          <h1 className="text-xl font-bold tracking-tighter neon-text-blue uppercase">
            NEON SYNTH // SNAKE_OS v1.2
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-widest text-gray-500">
          <span className="flex items-center gap-1"><Activity size={12} /> Latency: 14ms</span>
          <span>Buffer: 100%</span>
          <span className="text-green-500 flex items-center gap-1"><ShieldCheck size={12} /> System: Stable</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex p-6 gap-6 overflow-hidden">
        
        {/* Left Sidebar: Audio Control */}
        <section className="w-72 flex flex-col gap-4 overflow-hidden">
          <div className="panel flex-1 flex flex-col overflow-hidden">
            <h2 className="text-xs uppercase text-gray-500 mb-4 tracking-widest flex items-center gap-2">
              <Terminal size={14} /> Audio Archive
            </h2>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <MusicPlayer simpleMode />
            </div>
          </div>
        </section>

        {/* Center: Game Matrix */}
        <section className="flex-1 flex items-center justify-center relative border border-[#111] bg-[#0a0a0a]/50 rounded-[4px] shadow-inner overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00f3ff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.5 }}
          >
             <SnakeGame onScoreChange={setScore} />
          </motion.div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8 text-[10px] uppercase text-gray-600 tracking-widest z-10">
            <span>ARROWS TO NAVIGATE</span>
            <span className="text-gray-800">|</span>
            <span>SPACE TO RESET</span>
          </div>
        </section>

        {/* Right Sidebar: Telemetry & Logs */}
        <section className="w-64 flex flex-col gap-4 overflow-hidden">
          {/* Telemetry */}
          <div className="panel">
            <h2 className="text-xs uppercase text-gray-500 mb-6 tracking-widest">Session Telemetry</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Current Score</span>
                <span className="text-4xl font-bold neon-text-pink leading-none tabular-nums">
                  {score.toString().padStart(4, '0')}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Peak Value</span>
                <span className="text-xl font-bold text-white leading-none tabular-nums">
                  {(score * 1.5).toFixed(0).padStart(4, '0')}
                </span>
              </div>
              <div className="h-px bg-gray-800 my-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Buffer</span>
                  <span className="text-sm text-blue-400">0.02s</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase tracking-tighter">X-Scale</span>
                  <span className="text-sm text-blue-400">1.25x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Log */}
          <div className="panel flex-1 overflow-hidden flex flex-col">
            <h2 className="text-xs uppercase text-gray-500 mb-4 tracking-widest">Global Log</h2>
            <div className="flex-1 text-[10px] space-y-2 opacity-60 font-mono overflow-y-auto no-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className={i === logs.length - 1 ? "animate-pulse text-[#00f3ff]" : ""}>
                   {log}
                </div>
              ))}
              <div className="animate-pulse text-gray-600 cursor-default">_</div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-gray-900 bg-black flex items-center px-8 justify-between text-[10px] text-gray-600 uppercase tracking-widest z-20">
        <div>Firmware: v1.2.0-stable [SHA-256: 0x8F...]</div>
        <div className="hidden sm:block">© 2026 NEON_SYNTH_OPERATIONS // NODE_01</div>
        <div>UPLINK: ENCRYPTED_AES256</div>
      </footer>
    </div>
  );
}
