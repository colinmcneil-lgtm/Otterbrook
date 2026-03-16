import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCandidatesPage() {
  const candidates = await prisma.candidate.findMany({
    include: {
      mandates: {
        include: { mandate: { include: { company: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
          <p className="text-slate-500 mt-1 text-sm">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/candidates/new"
          className="bg-[#0F2240] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1a3660] transition-colors"
        >
          + New Candidate
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Name</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Email</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Active Roles</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">LinkedIn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{c.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{c.email}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {c.mandates.map((m) => (
                      <Link
                        key={m.id}
                        href={`/admin/mandates/${m.mandateId}`}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded hover:bg-slate-200 transition-colors"
                      >
                        {m.mandate.title} @ {m.mandate.company.name}
                      </Link>
                    ))}
                    {c.mandates.length === 0 && <span className="text-xs text-slate-400">None</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {c.linkedinUrl ? (
                    <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:underline">
                      Profile →
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No candidates yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
