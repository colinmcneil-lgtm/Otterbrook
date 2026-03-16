import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";

export default async function AdminMandatesPage() {
  const mandates = await prisma.mandate.findMany({
    include: {
      company: true,
      candidates: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mandates</h1>
          <p className="text-slate-500 mt-1 text-sm">{mandates.length} mandate{mandates.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/mandates/new"
          className="bg-[#0F2240] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1a3660] transition-colors"
        >
          + New Mandate
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Role</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Company</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Location</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Candidates</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mandates.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{m.title}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{m.company.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{m.location}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{m.candidates.length}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/mandates/${m.id}`} className="text-xs text-[#0F2240] font-medium hover:underline">
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
            {mandates.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No mandates yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
