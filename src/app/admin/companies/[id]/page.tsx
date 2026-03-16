import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MandateCard } from "@/components/MandateCard";
import { StatusBadge } from "@/components/StatusBadge";

export default async function CompanyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      users: true,
      mandates: {
        include: { candidates: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) notFound();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/admin/companies" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Companies
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-600 hover:underline mt-0.5 inline-block">
              {company.website}
            </a>
          )}
        </div>
        <Link
          href={`/admin/mandates/new?companyId=${company.id}`}
          className="bg-[#0F2240] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1a3660] transition-colors"
        >
          + New Mandate
        </Link>
      </div>

      {/* Users */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Client Users</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Name</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {company.users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-3 text-sm text-slate-900">{u.name}</td>
                <td className="px-6 py-3 text-sm text-slate-500">{u.email}</td>
              </tr>
            ))}
            {company.users.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-6 text-center text-sm text-slate-400">No users yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mandates */}
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Mandates</h2>
      <div className="grid gap-4">
        {company.mandates.map((m) => (
          <MandateCard key={m.id} mandate={m} href={`/admin/mandates/${m.id}`} />
        ))}
        {company.mandates.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
            No mandates yet for this company.
          </div>
        )}
      </div>
    </div>
  );
}
