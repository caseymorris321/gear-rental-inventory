import { Product } from "@prisma/client";

export function getRentalStatus(product: Product) {
  if (!product.checkedOutTo) return "Available";
  if (product.returnDate && product.returnDate < new Date()) return "Overdue";
  return "Checked Out";
}
