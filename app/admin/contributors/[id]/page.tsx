// Auth check is handled by the layout
import { createUserSupabase } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ContributorActions from '@/components/admin/ContributorActions'

export default async function ContributorDetailPage({
  params,
}: {
  params: { id: string }
}) {

  const supabase = await createUserSupabase()

  const { data: contributor } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (!contributor) {
    notFound()
  }

  // Get contributor's assets
  const { data: assets } = await supabase
    .from('assets')
    .select('*')
    .eq('contributor_id', params.id)
    .order('created_at', { ascending: false })

  // Calculate stats from assets and earnings
  const totalAssets = assets?.length || 0
  const { data: earnings } = await supabase
    .from('earnings')
    .select('amount')
    .eq('contributor_id', params.id)
  const totalEarnings = earnings?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0

  // Contributor tier is stored directly in the profile
  const levelDetails = contributor.contributor_tier ? {
    id: contributor.contributor_tier,
    name: contributor.contributor_tier.charAt(0).toUpperCase() + contributor.contributor_tier.slice(1)
  } : null

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      approved: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/contributors" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-2 inline-block">
            ← Back to Contributors
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contributor Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contributor Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-6">
              {contributor.avatar_url ? (
                <img className="h-20 w-20 rounded-full" src={contributor.avatar_url} alt="" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                  {contributor.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contributor.username || 'Unknown User'}
                  </h2>
                  {contributor.role === 'user' && contributor.application_date ? (
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge('pending')}`}>
                      PENDING
                    </span>
                  ) : contributor.role === 'contributor' ? (
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge('approved')}`}>
                      APPROVED
                    </span>
                  ) : (
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(contributor.role || 'user')}`}>
                      {(contributor.role || 'user').toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">ID: {contributor.id}</p>
                {contributor.bio && <p className="text-gray-700 dark:text-gray-300 mt-2">{contributor.bio}</p>}
              </div>
            </div>
          </div>

          {/* Application Info for Pending Users */}
          {contributor.role === 'user' && contributor.application_date && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Pending Contributor Application</h3>
              <p className="text-yellow-800 dark:text-yellow-300 mb-4">
                This user has applied to become a contributor. Review their application and approve or reject it.
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-yellow-900">Application Date:</p>
                  <p className="text-yellow-700">
                    {new Date(contributor.application_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {contributor.application_message && (
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200">Application Message:</p>
                    <p className="text-yellow-700 dark:text-yellow-400 whitespace-pre-wrap bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mt-1">
                      {contributor.application_message}
                    </p>
                  </div>
                )}
                {contributor.portfolio_url && (
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200">Portfolio/Website:</p>
                    <a
                      href={contributor.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {contributor.portfolio_url}
                    </a>
                  </div>
                )}
                {contributor.bio && (
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200">Bio:</p>
                    <p className="text-yellow-700 dark:text-yellow-400">{contributor.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats - Only show for approved contributors */}
          {contributor.role === 'contributor' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Assets</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalAssets}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ${totalEarnings.toFixed(2)}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {contributor.contributor_tier ? contributor.contributor_tier.charAt(0).toUpperCase() + contributor.contributor_tier.slice(1) : 'N/A'}
                </div>
              </div>
            </div>
          )}

          {/* Level Details - Only show for approved contributors */}
          {contributor.role === 'contributor' && levelDetails && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contributor Level</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Level:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{levelDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current Assets:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{totalAssets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Earnings:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${totalEarnings.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Assets List - Only show for approved contributors */}
          {contributor.role === 'contributor' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Uploaded Assets ({assets?.length || 0})</h3>
              {assets && assets.length > 0 ? (
                <div className="space-y-3">
                  {assets.map((asset) => (
                    <Link
                      key={asset.id}
                      href={`/admin/assets/${asset.id}`}
                      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{asset.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {asset.type} • ${asset.price} • {asset.status}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {asset.views || 0} views • {asset.downloads || 0} downloads
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No assets uploaded yet</p>
              )}
            </div>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <ContributorActions contributor={contributor} levelDetails={levelDetails} />
        </div>
      </div>
    </div>
  )
}

