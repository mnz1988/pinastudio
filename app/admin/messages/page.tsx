import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">پیام‌های تماس</h1>
      <div className="flex flex-col gap-3">
        {messages.map((m: any) => (
          <div key={m.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-white/40">{m.createdAt.toLocaleString("fa-IR")}</p>
            </div>
            <p className="text-xs text-white/50 mb-2" dir="ltr">{m.email}</p>
            <p className="text-white/80 text-sm leading-6">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-white/40">پیامی وجود ندارد.</p>}
      </div>
    </div>
  );
}
