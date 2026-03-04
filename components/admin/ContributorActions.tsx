'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ContributorActionsProps {
  contributor: any
  levelDetails: any
}

export default function ContributorActions({ contributor, levelDetails }: ContributorActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [newLevel, setNewLevel] = useState(contributor.contributor_tier || 'bronze')


  const approveContributor = async () => {
  setLoading(true)

  try {
    const response = await fetch('/api/admin/contributor/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: contributor.id }),
    })

    const data = await response.json()

    if (response.ok) {
      router.refresh()
      toast.success('Contributor approved successfully!')
    } else {
      toast.error(data.error || 'Failed to approve contributor')
    }
  } catch (error: any) {
    toast.error(error.message || 'Network error')
  } finally {
    setLoading(false)
  }
}




  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/contributor/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contributor.id, reason: rejectReason }),
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        const text = await response.text()
        console.error('Response text:', text)
        toast.error(`Server error: ${response.status} ${response.statusText}. Please check the console for details.`)
        return
      }

      if (response.ok) {
        router.refresh()
        setShowRejectModal(false)
        setRejectReason('')
        toast.success('Contributor rejected successfully')
      } else {
        console.error('Error response:', { status: response.status, data })
        const errorMessage = data?.error || `Failed to reject contributor (${response.status})`
        toast.error(errorMessage)
      }
    } catch (error: any) {
      console.error('Error rejecting contributor:', error)
      toast.error(`Error rejecting contributor: ${error.message || 'Network error. Please check your connection and try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLevel = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/contributor/update-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contributor.id, level: newLevel }),
      })

      if (response.ok) {
        router.refresh()
        toast.success('Contributor level updated!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update level')
      }
    } catch (error) {
      toast.error('Error updating level')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actions</h3>

        {/* Show approve/reject buttons for users with role='user' who have applied (have application_date) */}
        {contributor.role === 'user' && contributor.application_date && (
          <div className="space-y-3">
            <button
              onClick={()=>setShowApproveModal(true)}
              disabled={loading}
              className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 touch-manipulation active:scale-95"
            >
              {loading ? 'Processing...' : 'Approve Contributor'}
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={loading}
              className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 touch-manipulation active:scale-95"
            >
              Reject Contributor
            </button>
          </div>
        )}

        {/* Update Level */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contributor Level
          </label>
          <select
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white touch-manipulation"
          >
            <option value="bronze">Bronze (40%)</option>
            <option value="silver">Silver (45%)</option>
            <option value="gold">Gold (50%)</option>
            <option value="platinum">Platinum (55%)</option>
          </select>
          <button
            onClick={handleUpdateLevel}
            disabled={loading || newLevel === contributor.contributor_tier}
            className="w-full mt-3 px-4 py-3 sm:py-2 text-base sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 touch-manipulation active:scale-95"
          >
            Update Level
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Reject Contributor</h3>
            <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rejection Reason
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter reason for rejection..."
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleReject}
                disabled={loading || !rejectReason.trim()}
                className="flex-1 px-4 py-3 sm:py-2 text-base sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 touch-manipulation active:scale-95"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                }}
                className="flex-1 px-4 py-3 sm:py-2 text-base sm:text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors touch-manipulation active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Approve Modal */}
{showApproveModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
        Confirm Approval
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
        Are you sure you want to approve this contributor?
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={async () => {
            setShowApproveModal(false)
            await approveContributor()
          }}
          disabled={loading}
          className="flex-1 px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          Confirm Approve
        </button>

        <button
          onClick={() => setShowApproveModal(false)}
          className="flex-1 px-4 py-3 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}
    </>
  )
}

