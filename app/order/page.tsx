import Link from "next/link";
import { auth } from "@/auth";
import OrderForm from "@/components/OrderForm";

export default async function OrderPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-dvh pt-32 pb-24 px-6 max-w-md mx-auto flex flex-col gap-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Request a Custom Order</h1>
        <p className="text-white/60">Please sign up first to place an order.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/register" className="px-5 py-2.5 rounded-full bg-white text-black font-medium">Sign Up</Link>
          <Link href="/login" className="px-5 py-2.5 rounded-full border border-white/30">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pt-32 pb-24 px-6 max-w-xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl md:text-5xl font-bold">Request a Custom Order</h1>
      <p className="text-white/60">
        Describe your request below; after review, you'll be contacted to work out the details and price.
      </p>
      <OrderForm />
    </div>
  );
}
