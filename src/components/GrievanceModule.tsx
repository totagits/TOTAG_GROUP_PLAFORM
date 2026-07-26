import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { GrievanceTicket } from '../types';

interface GrievanceModuleProps {
  grievances: GrievanceTicket[];
  onSubmitGrievance: (ticket: GrievanceTicket) => void;
  onUpdateStatus: (ticketId: string, status: GrievanceTicket['status'], notes: string) => void;
}

export const GrievanceModule: React.FC<GrievanceModuleProps> = ({
  grievances,
  onSubmitGrievance,
  onUpdateStatus
}) => {
  const [selectedTicket, setSelectedTicket] = useState<GrievanceTicket | null>(grievances[0] || null);
  const [searchCode, setSearchCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Ticket Form State
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [county, setCounty] = useState('Grand Bassa');
  const [category, setCategory] = useState<GrievanceTicket['category']>('REGISTRATION_ISSUE');
  const [description, setDescription] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    const found = grievances.find((g) => g.trackingCode.toLowerCase() === searchCode.trim().toLowerCase());
    if (found) {
      setSelectedTicket(found);
    } else {
      alert(`No ticket found with Tracking Code [${searchCode}].`);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !farmerPhone || !description) {
      alert('Please complete required fields.');
      return;
    }

    const newTicket: GrievanceTicket = {
      id: `grv-${Date.now()}`,
      trackingCode: `LDFR-GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerName,
      farmerPhone,
      county,
      category,
      priority: 'HIGH',
      status: 'OPEN',
      description,
      assignedOfficer: 'Helpdesk Officer Mulbah',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmitGrievance(newTicket);
    setSelectedTicket(newTicket);
    setShowCreateModal(false);
    alert(`Grievance Ticket created with Tracking Reference: [${newTicket.trackingCode}]! SLA response target: 48 Hours.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-emerald-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            National Registry Grievance &amp; Appeals Desk
          </div>
          <h2 className="text-2xl font-extrabold text-white">Helpdesk Case Management Engine</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Handles data corrections, missing mobile money payouts, voucher redemption disputes, and eligibility appeals across all 15 Liberian counties.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" /> Submit New Grievance Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Tickets Queue */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-3">
          {/* Tracking Code Search */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Reference (e.g. LDFR-GRV-2026-8832)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs font-mono"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3 py-2 rounded cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          <div className="divide-y divide-slate-200 max-h-[450px] overflow-y-auto">
            {grievances.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-emerald-50 border-l-4 border-emerald-700' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-extrabold text-slate-900 text-xs">{ticket.farmerName}</div>
                  <span
                    className={`font-extrabold text-[10px] px-2 py-0.5 rounded ${
                      ticket.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-600 mt-1">{ticket.trackingCode}</div>
                <div className="text-[11px] text-slate-500">{ticket.category} • {ticket.county}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Ticket Inspector & Case Notes */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          {selectedTicket ? (
            <>
              <div className="border-b pb-4 flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Grievance Ticket Inspector
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedTicket.trackingCode}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Complainant: <b className="text-slate-800">{selectedTicket.farmerName}</b> ({selectedTicket.farmerPhone})
                  </div>
                </div>

                <span className="bg-slate-900 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg">
                  {selectedTicket.status}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 uppercase">Grievance Description</div>
                <p className="text-slate-700 leading-relaxed">{selectedTicket.description}</p>
                <div className="text-[10px] text-slate-400 pt-1">
                  County: {selectedTicket.county} • Assigned Officer: {selectedTicket.assignedOfficer}
                </div>
              </div>

              {/* Resolution Controls */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">Helpdesk Officer Resolution Notes</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record case findings and resolution actions..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedTicket.id, 'RESOLVED', resolutionNotes || 'Case investigated and resolved.');
                      alert(`Ticket [${selectedTicket.trackingCode}] updated to RESOLVED!`);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Mark Case RESOLVED
                  </button>

                  <button
                    onClick={() => {
                      onUpdateStatus(selectedTicket.id, 'IN_PROGRESS', resolutionNotes || 'Case under active review.');
                      alert(`Ticket [${selectedTicket.trackingCode}] set to IN_PROGRESS.`);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Set IN_PROGRESS
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a grievance ticket to inspect details and record case resolutions.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creating Grievance */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-300">
            <div className="font-extrabold text-slate-900 text-base border-b pb-2">
              Submit Grievance or Appeal Ticket
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Moses Tiah Weah"
                  className="w-full border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="e.g. +231775554321"
                    className="w-full border border-slate-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">County *</label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                  >
                    <option value="Grand Bassa">Grand Bassa</option>
                    <option value="Lofa">Lofa</option>
                    <option value="Nimba">Nimba</option>
                    <option value="Montserrado">Montserrado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-semibold"
                >
                  <option value="REGISTRATION_ISSUE">Registration / Boundary Data Issue</option>
                  <option value="ELIGIBILITY_APPEAL">Program Eligibility Appeal</option>
                  <option value="MISSING_PAYMENT">Missing Mobile Money Payment</option>
                  <option value="VOUCHER_REDEMPTION">Voucher Redemption Problem</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe issue or grievance details..."
                  className="w-full border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 text-white font-bold px-5 py-2 rounded cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
