import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

export default async function Home() {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Package className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gear Rental Inventory
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your rental gear, manage checkouts, and never lose track of overdue returns. Built for rental businesses that need a simple way to know what&apos;s available.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-in"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
