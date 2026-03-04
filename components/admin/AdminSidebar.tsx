'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { 
  ChevronLeftIcon, 
  ChartBarIcon,
  UsersIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  Squares2X2Icon,
  FolderIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/solid'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { href: '/admin/contributors', label: 'Contributors', icon: UsersIcon },
  { href: '/admin/assets', label: 'Assets', icon: PhotoIcon },
  { href: '/admin/assets/upload', label: 'Upload Asset', icon: ArrowUpTrayIcon },
  { href: '/admin/assets/bulk-upload', label: 'Bulk Upload', icon: Squares2X2Icon },
  { href: '/admin/categories', label: 'Categories', icon: FolderIcon },
  { href: '/admin/plans', label: 'Plans', icon: CreditCardIcon },
  { href: '/admin/settings', label: 'Settings', icon: Cog6ToothIcon },
]


export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)


  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  useEffect(()=>{
    if(sidebarRef.current)
    {
      setSidebarWidth(sidebarRef.current.offsetWidth)
    }
    const handleResize = () => {
      if (sidebarRef.current) setSidebarWidth(sidebarRef.current.offsetWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)

  }, [])

  useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1024)
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)

  return () => window.removeEventListener('resize', checkMobile)
}, [])


  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const SWIPE_THRESHOLD = sidebarWidth * 0.25


  return (
    <>
  {/* 👈 EDGE SWIPE ZONE */}
  {!isMobileOpen && isMobile && (
    <div
      className="fixed inset-y-0 left-0 w-5 z-30"
      onTouchStart={() => setIsMobileOpen(true)}
    />
  )}

  {/* Sidebar */}
  <motion.aside
    ref={sidebarRef}
    initial={false}
    animate={{
      x: isMobile ? (isMobileOpen ? 0 : -sidebarWidth) : 0,
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    drag={isMobile ? 'x' : false}
    dragConstraints={{ left: -sidebarWidth, right: 0 }}
    dragElastic={0.1}
    onDragEnd={(_, info) => {
      if (info.offset.x > SWIPE_THRESHOLD) {
        setIsMobileOpen(true)
      } else if (info.offset.x < -SWIPE_THRESHOLD) {
        setIsMobileOpen(false)
      }
    }}
    className="fixed inset-y-0 left-0 z-[40]
               w-64 sm:w-72 bg-white
               border-r border-gray-200"
  >
    <div className="flex md:pt-[20px] flex-col h-full overflow-y-auto">
            {/* Logo */}
            <div className="p-6 border-b">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SO</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">StocksOcean</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 hover:text-primary rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <div className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition-colors">
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </div>
              </button>
            </div>
          </div>
  </motion.aside>

  {/* Toggle Button */}
  <motion.button
    onClick={() => setIsMobileOpen(!isMobileOpen)}
    className="fixed top-0 left-0 md:top-4 md:left-5 z-50 lg:hidden -translate-y-1/2"
    animate={{ x: isMobileOpen ? sidebarWidth : 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  >
    <div className="p-2 bg-blue-600 rounded-full">
      {isMobileOpen ? (
        <ChevronLeftIcon className="w-7 h-7 text-white" />
      ) : (
        <Bars3Icon className="w-7 h-7 text-white" />
      )}
    </div>
  </motion.button>

  {/* Mobile Overlay (ONLY ONE) */}
  {isMobileOpen && (
    <div
      className="fixed inset-0 bg-black/50 z-[35] lg:hidden"
      onClick={() => setIsMobileOpen(false)}
    />
  )}
</>

  )
}
