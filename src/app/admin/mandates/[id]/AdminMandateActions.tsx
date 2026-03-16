"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: string;
  notes: string;
}

interface UnassignedCandidate {
  id: string;
  name: string;
  email: string;
}

const STAGES = [
  "SOURCED",
  "SCREENING",
  "SUBMITTED",
  "CLIENT_INTERVIEW",
  "OFFER",
  "PLACED",
  "REJECTED",
];

const stageLabels: Record<string, string> = {
  SOURCED: "Sourced",
  SCREENING: "Screening",
  SUBMITTED: "Submitted",
  CLIENT_INTERVIEW: "Client Interview",
  OFFER: "Offer",
  PLACED: "Placed",
  REJECTED: "Rejected",
};

export default function AdminMandateActions({
  mandateId,
  unassignedCandidates,
  candidates,
}: {
  mandateId: string;
  unassignedCandidates: UnassignedCandidate[];
  candidates: Candidate[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [addStage, setAddStage] = useState("SOURCED");
  const [addNotes, setAddNotes] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editStage, setEditStage] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    const res = await fetch(`/api/admin/mandates/${mandateId}/candidates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: selectedId, stage: addStage, notes: addNotes }),
    });
    setAddLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setAddError(d.error ?? "Failed to add candidate.");
    } else {
      setAdding(false);
      setSelectedId("");
      setAddNotes("");
      router.refresh();
    }
  }

  async function handleUpdateStage(entryId: string) {
    setEditLoading(true);
    await fetch(`/api/admin/mandates/${mandateId}/candidates/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: editStage, notes: editNotes }),
    });
    setEditLoading(false);
    setEditId(null);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700">Manage Candidates</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-sm bg-[#0F2240] text-white px-3 py-1.5 rounded-lg hover:bg-[#1a3660] transition-colors"
          >
            + Add Candidate
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="border border-slate-200 rounded-lg p-4 mb-4 space-y-3 bg-slate-50">
          <h3 className="text-sm font-medium text-slate-700">Add to pipeline</h3>
          <select
            required
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Select candidate</option>
            {unassignedCandidates.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
            ))}
          </select>
          <select
            value={addStage}
            onChange={(e) => setAddStage(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {STAGES.map((s) => <option key={s} value={s}>{stageLabels[s]}</option>)}
          </select>
          <textarea
            rows={2}
            value={addNotes}
            onChange={(e) => setAddNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {addError && <p className="text-xs text-red-600">{addError}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={addLoading} className="text-sm bg-[#0F2240] text-white px-3 py-1.5 rounded-lg hover:bg-[#1a3660] disabled:opacity-60">
              {addLoading ? "Adding..." : "Add"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Inline stage editing */}
      <div className="space-y-2">
        {candidates.map((c) => (
          <div key={c.id} className="flex items-center justify-between border border-slate-100 rounded-lg px-4 py-3 hover:bg-slate-50">
            {editId === c.id ? (
              <div className="flex-1 flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.email}</p>
                </div>
                <select
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value)}
                  className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {STAGES.map((s) => <option key={s} value={s}>{stageLabels[s]}</option>)}
                </select>
                <input
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Notes"
                  className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <button
                  onClick={() => handleUpdateStage(c.id)}
                  disabled={editLoading}
                  className="text-xs bg-[#0F2240] text-white px-2.5 py-1 rounded hover:bg-[#1a3660] disabled:opacity-60"
                >
                  Save
                </button>
                <button onClick={() => setEditId(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{stageLabels[c.stage]}</span>
                  <button
                    onClick={() => { setEditId(c.id); setEditStage(c.stage); setEditNotes(c.notes); }}
                    className="text-xs text-amber-600 hover:underline"
                  >
                    Edit stage
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {candidates.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No candidates yet.</p>
        )}
      </div>
    </div>
  );
}
