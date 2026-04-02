import { createUserSupabase } from '@/lib/supabaseServer'
import Link from 'next/link'
import { Suspense } from 'react'

async function ContributorsList({ status }: { status?: string }) {
  const supabase = await createUserSupabase()
  let query = supabase.from('profiles').select('*').neq('role', 'admin').order('created_at', { ascending: false })

  if (status === 'pending') {
    query = query.eq('role', 'user').not('application_date', 'is', null)
  }
  if (status === 'approved') {
    query = query.eq('role', 'contributor')
  }
  if (status === 'rejected') {
    query = query.eq('role', 'rejected')
  }

  const { data: contributors } = await query

  let filteredContributors = contributors || []
  if (!status && contributors) {
    filteredContributors = contributors.filter((c) => c.application_date || c.role === 'contributor')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Application Message
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Level
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Assets
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Earnings
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredContributors && filteredContributors.length > 0 ? (
              filteredContributors.map((contributor) => (
                <tr key={contributor.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                        {contributor.avatar_url ? (
                          <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" src={contributor.avatar_url} alt="" />
                        ) : (
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                            {contributor.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="ml-2 sm:ml-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          {contributor.username || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500 hidden sm:block">{contributor.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {contributor.role === 'user' && contributor.application_date ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        PENDING
                      </span>
                    ) : contributor.role === 'contributor' ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        APPROVED
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {(contributor.role || 'user').toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    {contributor.application_message ? (
                      <div className="max-w-xs">
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 truncate">
                          {contributor.application_message}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {contributor.contributor_tier ? (
                      <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                        contributor.contributor_tier === 'bronze' ? 'bg-amber-600' :
                        contributor.contributor_tier === 'silver' ? 'bg-gray-400' :
                        contributor.contributor_tier === 'gold' ? 'bg-yellow-500' :
                        contributor.contributor_tier === 'platinum' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {contributor.contributor_tier.charAt(0).toUpperCase() + contributor.contributor_tier.slice(1)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    N/A
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    N/A
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <Link
                      href={`/admin/contributors/${contributor.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No contributors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default async function ContributorsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const status = searchParams.status

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Contributors</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Manage contributors and their applications</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/contributors"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            !status
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/contributors?status=pending"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            status === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Pending
        </Link>
        <Link
          href="/admin/contributors?status=approved"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            status === 'approved'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Approved
        </Link>
        <Link
          href="/admin/contributors?status=rejected"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            status === 'rejected'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Rejected
        </Link>
      </div>

      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <ContributorsList status={status} />
      </Suspense>
    </div>
  )
}