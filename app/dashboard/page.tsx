import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!user) {
    redirect("/");
  }

  const [
    totalProducts,
    allProducts,
    overdueItems,
    upcomingReturns,
    availableGear,
  ] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.findMany({
      where: { userId },
      select: {
        dailyRate: true,
        quantity: true,
        createdAt: true,
        checkedOutTo: true,
        returnDate: true,
      },
    }),
    prisma.product.findMany({
      where: {
        userId,
        checkedOutTo: { not: null },
        returnDate: { lt: new Date() },
      },
      select: { name: true, checkedOutTo: true, returnDate: true },
      take: 5,
    }),
    prisma.product.findMany({
      where: {
        userId,
        checkedOutTo: { not: null },
        returnDate: { gte: new Date() },
      },
      select: { name: true, checkedOutTo: true, returnDate: true },
      orderBy: { returnDate: "asc" },
      take: 5,
    }),
    prisma.product.findMany({
      where: {
        userId,
        checkedOutTo: null,
      },
      select: { name: true, dailyRate: true, condition: true },
      take: 5,
    }),
  ]);

  const availableCount = allProducts.filter(
    (p: (typeof allProducts)[number]) => !p.checkedOutTo
  ).length;
  const checkedOutCount = allProducts.filter(
    (p: (typeof allProducts)[number]) =>
      p.checkedOutTo && p.returnDate && p.returnDate >= new Date()
  ).length;
  const overdueCount = allProducts.filter(
    (p: (typeof allProducts)[number]) =>
      p.checkedOutTo && p.returnDate && p.returnDate < new Date()
  ).length;

  const availablePercentage =
    totalProducts > 0 ? Math.round((availableCount / totalProducts) * 100) : 0;
  const checkedOutPercentage =
    totalProducts > 0 ? Math.round((checkedOutCount / totalProducts) * 100) : 0;
  const overduePercentage =
    totalProducts > 0 ? Math.round((overdueCount / totalProducts) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard" />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back! Here is an overview of your inventory
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics - standalone */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Key Metrics
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {availableCount}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {checkedOutCount}
              </div>
              <div className="text-sm text-gray-600">Checked Out</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {overdueCount}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Available Gear */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Available Gear
              </h2>
              <a
                href="/inventory?status=available"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                View All →
              </a>
            </div>
            <div className="space-y-3">
              {availableGear.length === 0 ? (
                <p className="text-sm text-gray-500">No gear available</p>
              ) : (
                availableGear.map((item, key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-sm text-green-600">
                      ${Number(item.dailyRate).toFixed(0)}/day
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Returns */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Returns
              </h2>
              <a
                href="/inventory?status=checkedout"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                View All →
              </a>
            </div>
            <div className="space-y-3">
              {upcomingReturns.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming returns</p>
              ) : (
                upcomingReturns.map((item, key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg bg-blue-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-sm text-blue-600">
                      {item.checkedOutTo} — due{" "}
                      {item.returnDate?.toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Overdue Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Overdue Items
              </h2>
              <a
                href="/inventory?status=overdue"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                View All →
              </a>
            </div>
            <div className="space-y-3">
              {overdueItems.length === 0 ? (
                <p className="text-sm text-gray-500">No overdue items</p>
              ) : (
                overdueItems.map((item, key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg bg-red-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-sm text-red-600">
                      {item.checkedOutTo} — due{" "}
                      {item.returnDate?.toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Rental Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Rental Status
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #16a34a 0% ${availablePercentage}%,
                      #2563eb ${availablePercentage}% ${
                      availablePercentage + checkedOutPercentage
                    }%,
                      #dc2626 ${availablePercentage + checkedOutPercentage}% ${
                      availablePercentage +
                      checkedOutPercentage +
                      overduePercentage
                    }%,
                      #e5e7eb ${
                        availablePercentage +
                        checkedOutPercentage +
                        overduePercentage
                      }% 100%
                    )`,
                  }}
                />
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {availablePercentage}%
                    </div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-600" />
                  <span>Available ({availablePercentage}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <span>Checked Out ({checkedOutPercentage}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-600" />
                  <span>Overdue ({overduePercentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
