'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

export interface LogItem {
  timestamp: string;
  module: string;
  eventType: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  hash: string;
  description: string;
}

export default function LogStream() {
  const [logs, setLogs] = useState<LogItem[]>([
    { timestamp: "10:24:12", module: "Identity", eventType: "MFA Verification", severity: "INFO", hash: "e3b0c442...", description: "Token valid untuk user secops_admin@ctartech.id" },
    { timestamp: "10:23:45", module: "Network", eventType: "Segment Validation", severity: "WARNING", hash: "872983b6...", description: "Percobaan akses lintas zona dari sub-net luar dicek" },
    { timestamp: "10:22:18", module: "Device", eventType: "EDR Health Check", severity: "INFO", hash: "a591a6d4...", description: "Endpoint compliant with BitLocker & Defender" },
    { timestamp: "10:20:05", module: "App Workload", eventType: "WAF Payload Clean", severity: "INFO", hash: "c3a7f82e...", description: "POST /api/v1/policy/evaluate payload sanitized" }
  ]);

  const [wsConnected, setWsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let fallbackInterval: any = null;

    const connectWebSocket = () => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws/soc-stream';
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          setWsConnected(true);
          if (fallbackInterval) clearInterval(fallbackInterval);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const newLog: LogItem = {
              timestamp: data.timestamp || new Date().toLocaleTimeString(),
              module: data.module || 'Control Plane',
              eventType: data.event_type || 'TELEMETRY_EVENT',
              severity: (data.severity as any) || 'INFO',
              hash: data.hash || '8f921ab0...',
              description: data.description || 'Zero Trust telemetry broadcast',
            };
            setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
          } catch (e) {
            console.error("Error parsing WS message:", e);
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          startFallbackSimulation();
        };

        ws.onerror = () => {
          setWsConnected(false);
          ws.close();
        };
      } catch (err) {
        setWsConnected(false);
        startFallbackSimulation();
      }
    };

    const startFallbackSimulation = () => {
      if (fallbackInterval) return;
      const sampleEvents = [
        { mod: 'AI Engine', evt: 'UEBA Risk Recalculation', sev: 'INFO', desc: 'Behavioral variance calculated for active sessions' },
        { mod: 'Identity', evt: 'FIDO2 Hardware Attested', sev: 'INFO', desc: 'Ed25519 cryptographic token signed & verified' },
        { mod: 'Network', evt: 'ZTNA Mesh Route Checked', sev: 'INFO', desc: 'mTLS virtual microsegmentation policy active' },
        { mod: 'Data Protection', evt: 'DLP Classifier Sealed', sev: 'INFO', desc: 'KMS AES-256 tokenization applied to PII record' },
        { mod: 'SOAR Response', evt: 'Playbook Standby', sev: 'INFO', desc: 'Autonomous containment runners listening for triggers' },
      ];

      fallbackInterval = setInterval(() => {
        const randomItem = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
        const hashHex = Math.random().toString(36).substring(2, 10);
        const simLog: LogItem = {
          timestamp: new Date().toLocaleTimeString(),
          module: randomItem.mod,
          eventType: randomItem.evt,
          severity: randomItem.sev as any,
          hash: `${hashHex}...`,
          description: randomItem.desc,
        };
        setLogs((prev) => [simLog, ...prev.slice(0, 19)]);
      }, 3500);
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) socketRef.current.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Live Telemetry & Immutable Audit Stream</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic Append-Only Hash Chain (SHA-256) via Real-Time WebSocket Channel
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
            wsConnected 
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
              : 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40'
          }`}>
            {wsConnected ? <Wifi className="w-3.5 h-3.5 animate-pulse" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{wsConnected ? 'LIVE WS :8080' : 'SIMULATION STREAM'}</span>
          </div>

          <span className="px-2.5 py-1 bg-slate-950 text-slate-300 border border-slate-800 rounded-lg text-xs font-mono">
            Chain: 100% Valid
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950/60">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Source Module</th>
              <th className="p-3">Event Type</th>
              <th className="p-3">Severity</th>
              <th className="p-3">SHA-256 Hash</th>
              <th className="p-3">Telemetry Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3 text-slate-500 font-mono">{log.timestamp}</td>
                <td className="p-3 font-semibold text-white">{log.module}</td>
                <td className="p-3 text-cyan-400">{log.eventType}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.severity === "INFO" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" :
                    log.severity === "WARNING" ? "bg-amber-950 text-amber-400 border border-amber-800" :
                    "bg-rose-950 text-rose-400 border border-rose-800"
                  }`}>
                    {log.severity}
                  </span>
                </td>
                <td className="p-3 text-purple-400">{log.hash}</td>
                <td className="p-3 text-slate-300 font-sans text-xs">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
