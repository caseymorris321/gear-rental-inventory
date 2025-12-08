"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dailyRate: z.coerce.number().nonnegative("Daily rate must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().optional(),
  condition: z.enum(["GOOD", "FAIR", "NEEDS_REPAIR"]),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    dailyRate: formData.get("dailyRate"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    condition: formData.get("condition"),
    lowStockAt: formData.get("lowStockAt") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Failed to create product.");
  }

  await prisma.product.create({
    data: {
      ...parsed.data,
      userId: user.id,
    },
  });

  redirect("/inventory");
}

export async function updateProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const id = String(formData.get("id") || "");

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    dailyRate: formData.get("dailyRate"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    condition: formData.get("condition"),
    lowStockAt: formData.get("lowStockAt") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Failed to update product.");
  }

  await prisma.product.updateMany({
    where: { id, userId: user.id },
    data: parsed.data,
  });

  redirect("/inventory");
}

export async function checkOutProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const id = String(formData.get("id") || "");
  const checkedOutTo = String(formData.get("checkedOutTo") || "");
  const returnDate = new Date(String(formData.get("returnDate")));

  if (!checkedOutTo || isNaN(returnDate.getTime())) {
    throw new Error("Name and return date required.");
  }

  await prisma.product.updateMany({
    where: { id, userId: user.id },
    data: { checkedOutTo, returnDate },
  });

  redirect("/inventory");
}

export async function checkInProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const id = String(formData.get("id") || "");
  const condition = formData.get("condition") as
    | "GOOD"
    | "FAIR"
    | "NEEDS_REPAIR"
    | null;

  await prisma.product.updateMany({
    where: { id, userId: user.id },
    data: {
      checkedOutTo: null,
      returnDate: null,
      ...(condition && { condition }),
    },
  });

  redirect("/inventory");
}
