'use client'
import { useState } from 'react'

export default function Page() {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    console.log("Confirmed")
    setOpen(false)
  }

  return (
    <div className="p-10">
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Delete Item
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}