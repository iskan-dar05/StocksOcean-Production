import { createUserSupabase } from '@/lib/supabaseServer'
import Link from 'next/link'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function AssetsList({ status, type, category }: { status?: string; type?: string; category?: string }) {

  const supabase = createUserSupabase()

  let query = supabase.from('assets').select('*, profiles(username, avatar_url)').order('created_at', { ascending: false })

  

  if (status) {
    query = query.eq('status', status)
  }
  if (type) {
    query = query.eq('type', type)
  }
  if (category) {
    query = query.eq('category', category)
  }

  const { data: assets } = await query

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      approved: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="">
        <div className="w-full align-middle">
          <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Type
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Price
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Contributor
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Stats
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {assets && assets.length > 0 ? (
              assets.map((asset: any) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {asset.preview_path ? (
                        <img className="h-10 w-10 sm:h-12 sm:w-12 rounded object-cover flex-shrink-0" src={asset.preview_path} alt={asset.title} />
                      ) : (
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs sm:text-sm">{asset.type?.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{asset.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate hidden sm:block">
                          {asset.description?.substring(0, 50)}...
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                          {asset.type?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                    {asset.type?.toUpperCase()}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(asset.status)}`}>
                      {asset.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    ${asset.price?.toFixed(2)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell truncate">
                    {asset.profiles?.username || 'N/A'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {asset.views || 0} views • {asset.downloads || 0} downloads
                  </td>
                  <td className="px-3 text-end sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <Link
                      href={`/admin/assets/${asset.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No assets found
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

export default function AssetsPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string; category?: string }
}) {
  // Auth check is handled by the layout

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Assets</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Manage all assets in the marketplace</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/admin/assets/upload"
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Asset
          </Link>
          <Link
            href="/admin/assets/bulk-upload"
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Bulk Upload
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/assets"
          className={`px-3 sm:px-4 py-2 hover:text-white hover:bg-blue-600 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            !searchParams.status
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/assets?status=pending"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            searchParams.status === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Pending
        </Link>
        <Link
          href="/admin/assets?status=approved"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            searchParams.status === 'approved'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Approved
        </Link>
        <Link
          href="/admin/assets?type=image"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            searchParams.type === 'image'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Images
        </Link>
        <Link
          href="/admin/assets?type=video"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            searchParams.type === 'video'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          Videos
        </Link>
        <Link
          href="/admin/assets?type=3d"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            searchParams.type === '3d'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          3D Models
        </Link>
      </div>

      {/* Assets List */}
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <div className="w-full overflow-hidden">
          <AssetsList
            status={searchParams.status}
            type={searchParams.type}
            category={searchParams.category}
          />
        </div>
      </Suspense>

    </div>
  )
}

