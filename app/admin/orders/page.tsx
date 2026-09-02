import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const statusMap: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "در انتظار بررسی", cls: "bg-yellow-500/20 text-yellow-400" },
  IN_PROGRESS: { label: "در حال انجام", cls: "bg-blue-500/20 text-blue-400" },
  DONE: { label: "انجام شده", cls: "bg-green-500/20 text-green-400" },
  CANCELLED: { label: "لغو شده", cls: "bg-white/10 text-white/50" },
};

async function setStatus(id: string, status: string) {
  "use server";
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">سفارش‌های سفارشی</h1>
      <div className="flex flex-col gap-3">
        {orders.map((o: any) => {
          const s = statusMap[o.status] || statusMap.PENDING;
          return (
            <div key={o.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{o.title}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${s.cls}`}>{s.label}</span>
              </div>
              <p className="text-xs text-white/40 mb-2">
                {o.user.name || o.user.email} · {new Date(o.createdAt).toLocaleString("fa-IR")}
              </p>
              <p className="text-white/70 text-sm mb-3">{o.description}</p>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(statusMap).map((key) => (
                  <form key={key} action={setStatus.bind(null, o.id, key)}>
                    <button
                      className={`text-xs px-3 py-1.5 rounded-full border ${
                        o.status === key ? "border-white bg-white/10" : "border-white/20 text-white/50 hover:border-white/50"
                      }`}
                    >
                      {statusMap[key].label}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          );
        })}
        {orders.length === 0 && <p className="text-white/40">سفارشی وجود ندارد.</p>}
      </div>
    </div>
  );
}
