import React, { useState } from 'react';
import { Lock, Search } from 'lucide-react';
import type { AuditEvent } from '../types';

interface AuditTrailModuleProps {
  auditLogs: AuditEvent[];
}

export const AuditTrailModule: React.FC<AuditTrailModuleProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-emerald-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Immutable Append-Only Audit Trail
          </div>
          <h2 className="text-2xl font-extrabold text-white">System Security &amp; Transparency Log</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Records all platform events (Logins, Edits, Verifications, Eligibility Checks, Payment Disbursements, Voucher Redemptions, Exports) with user roles, IP addresses, and timestamps.
          </p>
        </div>

        <div className="bg-emerald-950 border border-emerald-700/60 px-4 py-2 rounded-xl text-center">
          <div className="text-2xl font-extrabold text-emerald-400">{auditLogs.length}</div>
          <div className="text-[10px] text-emerald-200 font-bold uppercase">Audited Events</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex justify-between items-center text-xs">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search audit actions, actors, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-xs pl-8"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
        </div>

        <div className="text-slate-500 font-semibold">
          Showing {filteredLogs.length} of {auditLogs.length} Security Audit Records
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor &amp; Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity Ref</th>
                <th className="p-3">Event Details</th>
                <th className="p-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 font-mono">
                  <td className="p-3 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 font-sans font-bold text-slate-900">
                    {log.actorName}
                    <span className="block text-[10px] font-mono text-emerald-800">{log.actorRole}</span>
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded border border-slate-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{log.entityId}</td>
                  <td className="p-3 font-sans text-slate-700 max-w-xs leading-relaxed">{log.details}</td>
                  <td className="p-3 text-right text-slate-400 text-[10px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
