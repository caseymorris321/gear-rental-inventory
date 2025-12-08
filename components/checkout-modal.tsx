  "use client";

  import { useState } from "react";
  import { checkOutProduct } from "@/lib/actions/products";

  export default function CheckOutModal({ id, name }: { id: string; name: string }) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button onClick={() => setOpen(true)} className="text-blue-600 hover:text-blue-900">
          Check Out
        </button>

        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Check Out: {name}</h2>
              <form action={checkOutProduct} onSubmit={() => setOpen(false)}>
                <input type="hidden" name="id" value={id} />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Renter Name</label>
                    <input
                      name="checkedOutTo"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Who is renting?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <input
                      type="date"
                      name="returnDate"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-2 justify-end">
                  <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-800">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Check Out
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }
