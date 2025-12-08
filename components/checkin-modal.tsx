"use client";

import { useState } from "react";
import { checkInProduct } from "@/lib/actions/products";

export default function CheckInModal({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-green-600 hover:text-green-900"
      >
        Check In
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Check In: {name}
            </h2>
            <form action={checkInProduct} onSubmit={() => setOpen(false)}>
              <input type="hidden" name="id" value={id} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  name="condition"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select condition...</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="NEEDS_REPAIR">Needs Repair</option>
                </select>
              </div>
              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
