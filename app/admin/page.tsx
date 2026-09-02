import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [projects, messages, orders, members] = await Promise.all([
    prisma.project.count().catch(() => 0),
    prisma.contactMessage.count().catch(() => 0),
    prisma.order.count().catch(() => 0),
    prisma.user.count({ where: { role: "MEMBER" } }).catch(() => 0),
  ]);

  const stats = [
    { label: "پروژه‌ها", value: projects },
    { label: "پیام‌های تماس", value: messages },
    { label: "سفارش‌ها", value: orders },
    { label: "اعضا", value: members },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">داشبورد</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-white/50 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
