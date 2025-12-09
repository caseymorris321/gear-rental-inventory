import DeleteButton from "@/components/delete-button";
import Pagination from "@/components/pagination";
import Sidebar from "@/components/sidebar";
import { deleteProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRentalStatus } from "@/lib/rental-status";
import CheckOutModal from "@/components/checkout-modal";
import CheckInModal from "@/components/checkin-modal";
import EditModal from "@/components/edit-modal";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  const user = await getCurrentUser();
  const userId = user?.id;

  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 5;
  const status = params.status ?? "";
  const now = new Date();

  const where = {
    userId,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    ...(status === "available" ? { checkedOutTo: null } : {}),
    ...(status === "checkedout"
      ? { checkedOutTo: { not: null }, returnDate: { gte: now } }
      : {}),
    ...(status === "overdue"
      ? { checkedOutTo: { not: null }, returnDate: { lt: now } }
      : {}),
  };

  const [totalCount, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/inventory" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Inventory
              </h1>
              <p className="text-sm text-gray-500">
                Manage your products and track invetory levels
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className="flex gap-2" action="/inventory" method="GET">
              <input
                name="q"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
              />
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Search
              </button>
            </form>
          </div>

          <div className="flex gap-2 mt-4">
            <a
              href="/inventory"
              className={`px-3 py-1 rounded-full text-sm ${
                !status
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </a>
            <a
              href="/inventory?status=available"
              className={`px-3 py-1 rounded-full text-sm ${
                status === "available"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Available
            </a>
            <a
              href="/inventory?status=checkedout"
              className={`px-3 py-1 rounded-full text-sm ${
                status === "checkedout"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Checked Out
            </a>
            <a
              href="/inventory?status=overdue"
              className={`px-3 py-1 rounded-full text-sm ${
                status === "overdue"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Overdue
            </a>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sku
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Daily Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((product: (typeof items)[number], key: number) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.sku || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      ${Number(product.dailyRate).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getRentalStatus(product) === "Available"
                            ? "bg-green-100 text-green-800"
                            : getRentalStatus(product) === "Overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {getRentalStatus(product) === "Available"
                          ? "Available"
                          : `${getRentalStatus(product)} - ${
                              product.checkedOutTo
                            }`}
                      </span>
                    </td>
                    <td>
                      {product.condition === "NEEDS_REPAIR"
                        ? "Needs Repair"
                        : product.condition === "GOOD"
                        ? "Good"
                        : product.condition === "FAIR"
                        ? "Fair"
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 space-y-1 flex flex-col items-start">
                      {getRentalStatus(product) === "Available" ? (
                        <CheckOutModal id={product.id} name={product.name} />
                      ) : (
                        <CheckInModal id={product.id} name={product.name} />
                      )}
                      <EditModal
                        product={{
                          ...product,
                          dailyRate: Number(product.dailyRate),
                        }}
                      />
                      <DeleteButton id={product.id} name={product.name} action={deleteProduct} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/inventory"
                searchParams={{ q, status, pageSize: String(pageSize) }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
