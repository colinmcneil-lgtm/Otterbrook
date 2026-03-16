import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      users: true,
      mandates: {
        include: { candidates: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
          <p className="text-slate-500 mt-1 text-sm">{companies.length} client{companies.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/companies/new"
          className="bg-[#0F2240] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1a3660] transition-colors"
        >
          + New Company
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Company</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Website</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Users</th>
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Mandates</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{c.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {c.website ? (
                    <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                      {c.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : "—"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{c.users.length}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{c.mandates.length}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/companies/${c.id}`}
                    className="text-xs text-[#0F2240] font-medium hover:underline"
                  >
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No companies yet. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
