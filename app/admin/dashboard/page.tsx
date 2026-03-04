'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import DashboardCharts from '@/components/admin/DashboardCharts'
import AdminSidebar from '@/components/admin/AdminSidebar'

import {
  PhotoIcon,
  UsersIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  UserGroupIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/solid'


interface PendingContributor {
  id: string
  username: string | null
  avatar_url: string | null
  application_date: string | null
  application_message: string | null
  portfolio_url: string | null
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalUsers: 0,
    totalContributors: 0,
    pendingAssets: 0,
    pendingContributors: 0,
    totalDownloads: 0,
    totalRevenue: 0,
  })
  const [pendingContributors, setPendingContributors] = useState<PendingContributor[]>([])
  const [assetsByDay, setAssetsByDay] = useState<Array<{ date: string; count: number }>>([])
  const [revenueByDay, setRevenueByDay] = useState<Array<{ date: string; revenue: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats - get REAL numbers from database
        const [
          { count: totalAssets },
          { count: totalUsers },
          { count: totalContributors },
          { count: pendingAssets },
          { count: pendingContributors },
          { data: pendingContributorsData },
          { data: allAssetsForDownloads },
          { data: recentAssets },
          { data: allOrders },
        ] = await Promise.all([
          supabase.from('assets').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'contributor'),
          supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user').not('application_date', 'is', null),
          supabase
            .from('profiles')
            .select('id, username, avatar_url, application_date, application_message, portfolio_url')
            .eq('role', 'user')
            .not('application_date', 'is', null)
            .order('application_date', { ascending: false })
            .limit(5),
          supabase
            .from('assets')
            .select('downloads')
            .limit(10000), // Get all assets for accurate download count
          supabase
            .from('assets')
            .select('id, title, created_at, views, downloads')
            .order('created_at', { ascending: false })
            .limit(7),
          supabase
            .from('orders')
            .select('id, price_paid, created_at, status')
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(1000), // Get more orders for accurate revenue
        ])

        // Calculate REAL revenue and downloads from ALL data
        const totalRevenue = allOrders?.reduce((sum, order) => sum + (Number(order.price_paid) || 0), 0) || 0
        const totalDownloads = allAssetsForDownloads?.reduce((sum, asset) => sum + (Number(asset.downloads) || 0), 0) || 0

        // Prepare chart data (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          return date.toISOString().split('T')[0]
        })

        const assetsByDayData = last7Days.map((date) => {
          const count = recentAssets?.filter((asset) => asset.created_at?.startsWith(date)).length || 0
          return { date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count }
        })

        const revenueByDayData = last7Days.map((date) => {
          const revenue =
            allOrders?.filter((order) => order.created_at?.startsWith(date)).reduce((sum, order) => sum + (Number(order.price_paid) || 0), 0) || 0
          return { date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue }
        })

        setStats({
          totalAssets: totalAssets || 0,
          totalUsers: totalUsers || 0,
          totalContributors: totalContributors || 0,
          pendingAssets: pendingAssets || 0,
          pendingContributors: pendingContributors || 0,
          totalDownloads,
          totalRevenue,
        })
        setPendingContributors((pendingContributorsData as PendingContributor[]) || [])
        setAssetsByDay(assetsByDayData)
        setRevenueByDay(revenueByDayData)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const statsCards = [
  {
    title: 'Total Assets',
    value: stats.totalAssets.toLocaleString(),
    change: '+12%',
    icon: PhotoIcon,
    href: '/admin/assets',
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Total Users',
    value: stats.totalUsers.toLocaleString(),
    change: '+8%',
    icon: UsersIcon,
    href: '/admin/contributors',
    color: 'green',
    bgGradient: 'from-green-500 to-green-600',
  },
  {
    title: 'Contributors',
    value: stats.totalContributors.toLocaleString(),
    change: '+5%',
    icon: UserGroupIcon,
    href: '/admin/contributors?status=approved',
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Pending Reviews',
    value: (stats.pendingAssets + stats.pendingContributors).toLocaleString(),
    change:
      stats.pendingAssets || stats.pendingContributors
        ? 'Action Required'
        : 'All Clear',
    icon: ClockIcon,
    href: '/admin/contributors?status=pending',
    color: 'yellow',
    bgGradient: 'from-yellow-500 to-yellow-600',
    urgent: stats.pendingAssets > 0 || stats.pendingContributors > 0,
  },
  {
    title: 'Total Downloads',
    value: stats.totalDownloads.toLocaleString(),
    change: '+23%',
    icon: ArrowDownTrayIcon,
    href: '/admin/assets',
    color: 'indigo',
    bgGradient: 'from-indigo-500 to-indigo-600',
  },
  {
    title: 'Revenue',
    value: `$${stats.totalRevenue.toFixed(2)}`,
    change: '+15%',
    icon: BanknotesIcon,
    href: '/admin/assets',
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-emerald-600',
  },
]


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to the StocksOcean Admin Panel</p>
        </div>
        <div className="gap-2">
          <Link
            href="/admin/assets/upload"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Upload Asset
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statsCards.map(({ title, href, value, change, icon: Icon, bgGradient, urgent }) => (
          <Link
            key={title}
            href={href}
            className={`group relative bg-whitel rounded-xl p-4 lg:p-5 xl:p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 ${
              urgent ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">{value}</p>
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    change.includes('+')
                      ? 'text-green-600'
                      : change.includes('Action')
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}
                >
                  {change}
                </p>
              </div>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                <Icon className="h-8 w-8 opacity-90" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pending Contributor Applications */}
      {pendingContributors.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Contributor Applications</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {pendingContributors.length} application{pendingContributors.length !== 1 ? 's' : ''} awaiting review
                </p>
              </div>
              <Link
                href="/admin/contributors?status=pending"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingContributors.map((contributor) => (
              <Link
                key={contributor.id}
                href={`/admin/contributors/${contributor.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {contributor.avatar_url ? (
                    <img
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      src={contributor.avatar_url}
                      alt={contributor.username || 'User'}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {(contributor.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {contributor.username || 'Unknown User'}
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        PENDING
                      </span>
                    </div>
                    {contributor.application_message && (
                      <p className="text-sm text-gray-600  line-clamp-2 mb-2">
                        {contributor.application_message}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {contributor.application_date && (
                        <span>
                          Applied: {new Date(contributor.application_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                      {contributor.portfolio_url && (
                        <span className="truncate max-w-xs">
                          Portfolio: <span className="text-blue-600">{contributor.portfolio_url}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <DashboardCharts assetsByDay={assetsByDay} revenueByDay={revenueByDay} />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-200">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          <Link
            href="/admin/assets?status=pending"
            className="p-5 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <PhotoIcon className="w-full h-full text-gray-900 group-hover:text-white" />
              </div>
              <div className="font-semibold text-gray-900">Review Pending Assets</div>
            </div>
            <div className="text-sm text-gray-600">
              {stats.pendingAssets} asset{stats.pendingAssets !== 1 ? 's' : ''} pending review
            </div>
          </Link>
          <Link
            href="/admin/contributors?status=pending"
            className="p-5 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                <UserGroupIcon className="w-full h-full text-gray-900 group-hover:text-white" />
              </div>
              <div className="font-semibold text-gray-900">Review Contributors</div>
            </div>
            <div className="text-sm text-gray-600">
              {stats.pendingContributors} application{stats.pendingContributors !== 1 ? 's' : ''} pending review
            </div>
          </Link>
          <Link
            href="/admin/assets/upload"
            className="p-5 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <ArrowUpTrayIcon className="w-full h-full text-gray-900 group-hover:text-white" />
              </div>
              <div className="font-semibold text-gray-900">Upload New Asset</div>
            </div>
            <div className="text-sm text-gray-600">Add demo or featured asset</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
