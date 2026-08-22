import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  ScrollText,
  Search,
  Filter,
  ShieldCheck,
  Stethoscope,
  Activity,
  AlertTriangle,
  Clock,
  User,
  Download
} from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');

  const filteredLogs = auditLogs.filter(log => {
    const matchRole = filterRole === 'All' || log.userRole === filterRole;
    const matchSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchRole && matchSearch;
  });

  const exportLogsAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Audit Trail & Log Aktivitas Sistem
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pencatatan real-time seluruh tindakan staf medis, persetujuan janji temu, dan perubahan data
          </p>
        </div>

        <button
          onClick={exportLogsAsJSON}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export JSON Log</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari aksi, user, target..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'ADMIN', 'DOCTOR'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterRole === role
                  ? 'bg-medical-600 text-white shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {role === 'All' ? 'Semua Role' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-navy-950 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Aksi / Event</th>
                <th className="px-6 py-4">Target Entitas</th>
                <th className="px-6 py-4">Keterangan / Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {log.userName}
                    </div>
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase mt-0.5 ${
                        log.userRole === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {log.userRole}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-mono font-semibold text-medical-600 dark:text-medical-400">
                    {log.action}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                    {log.target}
                  </td>

                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-sm">
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
