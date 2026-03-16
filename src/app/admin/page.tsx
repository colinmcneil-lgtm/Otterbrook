import { prisma } from "@/lib/prisma";
import Link from "next/link";


export default async function AdminPage() {
  const [companies, mandates, candidates] = await Promise.all([
    prisma.company.count(),
    prisma.mandate.findMany({ include: { candidates: true } }),
    prisma.candidate.count(),
  ]);

  const openMandates = mandates.filter((m) => m.status === "OPEN").length;
  const activeCandidates = mandates.reduce(
    (sum, m) =>
      sum +
      m.candidates.filter((c) =>
        ["SOURCED", "SCREENING", "SUBMITTED", "CLIENT_INTERVIEW", "OFFER"].includes(c.stage)
      ).length,
    0
  );

  const recentMandates = await prisma.mandate.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { company: true, candidates: true },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage all clients, mandates and candidates.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Companies</p>
          <p className="text-3xl font-bold text-[#0F2240] mt-1">{companies}</p>
          <Link href="/admin/companies" className="text-xs text-amber-600 hover:underline mt-2 inline-block">View all →</Link>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Open Mandates</p>
          <p className="text-3xl font-bold text-[#0F2240] mt-1">{openMandates}</p>
          <Link href="/admin/mandates" className="text-xs text-amber-600 hover:underline mt-2 inline-block">View all →</Link>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Candidates</p>
          <p className="text-3xl font-bold text-[#0F2240] mt-1">{candidates}</p>
          <Link href="/admin/candidates" className="text-xs text-amber-600 hover:underline mt-2 inline-block">View all →</Link>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Active in Pipeline</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{activeCandidates}</p>
        </div>
      </div>

      {/* Recent Mandates */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Recent Mandates</h2>
          <Link href="/admin/mandates/new" className="text-xs bg-[#0F2240] text-white px-3 py-1.5 rounded-lg hover:bg-[#1a3660] transition-colors">
            + New Mandate
          </Link>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Role</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Company</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Candidates</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentMandates.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3">
                  <Link href={`/admin/mandates/${m.id}`} className="text-sm font-medium text-[#0F2240] hover:underline">
                    {m.title}
                  </Link>
                </td>
                <td className="px-6 py-3 text-sm text-slate-600">{m.company.name}</td>
                <td className="px-6 py-3 text-sm text-slate-600">{m.candidates.length}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                    m.status === "OPEN" ? "bg-green-50 text-green-700 border-green-200" :
                    m.status === "ON_HOLD" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-gray-100 text-gray-600 border-gray-200"
                  }`}>
                    {m.status === "ON_HOLD" ? "On Hold" : m.status.charAt(0) + m.status.slice(1).toLowerCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
