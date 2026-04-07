'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '@/lib/supabaseClient'
import NotificationBell from '@/components/notifications/NotificationBell'
import Image from 'next/image'

export default function Header() {
  const { user, loading: authLoading } = useAuth()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isApprovedContributor, setIsApprovedContributor] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState<string>('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(56)
  const router = useRouter()

  // Track if component is mounted for portal
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get header height for mobile menu positioning
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }
    
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    console.log('Mobile menu state changed:', isMobileMenuOpen)
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

useEffect(() => {
  if (!user) {
    setIsAdmin(false)
      setIsApprovedContributor(false)
      setUsername('')
      setAvatarUrl('')
      setLoading(false)
      return
  }

  const loadProfile = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('role, username, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.log("Header Error:", error)
        return
      }

      if (profileData) {
        setIsAdmin(profileData.role === 'admin')
        console.log("DATA PROFILE ROLE:  ", profileData.role)
        setIsApprovedContributor(profileData.role === 'contributor')
        setUsername(profileData.username || '')
        setAvatarUrl(profileData.avatar_url || '')
      }

    } catch (error) {
      console.log("Header Error:", error)
    }

    setLoading(false)
  }

  loadProfile()
}, [user])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        // Don't close if clicking on notification bell
        const notificationBell = (event.target as HTMLElement).closest('[data-notification-bell]')
        if (!notificationBell) {
          setIsDropdownOpen(false)
        }
      }
    }

    // Use a small delay to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true)
      document.addEventListener('touchstart', handleClickOutside, true)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('touchstart', handleClickOutside, true)
    }
  }, [isDropdownOpen])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement
      
      // Don't close if clicking on menu content, menu button, or backdrop
      const isMenuContent = target.closest('[data-mobile-menu]')
      const isMenuButton = target.closest('[data-mobile-menu-button]') || 
                          menuButtonRef.current?.contains(target) ||
                          target === menuButtonRef.current
      const isBackdrop = target.closest('.mobile-menu-backdrop')
      
      // Also check if the target is inside the button's SVG
      const isButtonSVG = target.closest('button[data-mobile-menu-button]')
      
      if (!isMenuContent && !isMenuButton && !isBackdrop && !isButtonSVG) {
        console.log('Closing mobile menu - clicked outside')
        setIsMobileMenuOpen(false)
      }
    }

    // Add delay to prevent immediate closure when menu opens
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true)
      document.addEventListener('touchend', handleClickOutside, true)
    }, 150)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('touchend', handleClickOutside, true)
    }
  }, [isMobileMenuOpen])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsDropdownOpen(false)
    router.push('/auth/signin')

  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => {
      const newState = !prev
      console.log('Mobile menu toggled:', newState)
      return newState
    })
  }

  const isActive = (path: string) => pathname === path

  // Mobile Menu Component
  const mobileMenuContent = isMobileMenuOpen && isMounted ? (
    <>
      {/* Backdrop */}
      <div 
        className="lg:hidden fixed inset-0 z-[100] mobile-menu-backdrop pointer-events-auto"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsMobileMenuOpen(false)
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsMobileMenuOpen(false)
        }}
      />
      {/* Menu Content */}
      <div 
        className="lg:hidden fixed left-0 right-0 bottom-0 z-[110] overflow-y-auto overscroll-contain" 
        style={{ top: `${headerHeight}px` }}
        data-mobile-menu
        onClick={(e) => {
          e.stopPropagation()
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="w-full max-w-[100vw] bg-white mx-auto px-3 xs:px-4 sm:px-5 md:px-6 py-4 xs:py-5 sm:py-6 md:py-8">
          {/* Mobile Search in Menu */}
          <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full px-4 xs:px-5 sm:px-5 md:px-6 py-3 xs:py-3.5 sm:py-4 pl-10 xs:pl-11 sm:pl-12 md:pl-14 pr-4 text-sm xs:text-base sm:text-lg border-1 border-gray-200 rounded-lg xs:rounded-xl bg-white text-primary placeholder-gray-400 focus:ring-2 focus:ring-header focus:border-header transition-all touch-manipulation min-h-[44px] xs:min-h-[48px]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value
                    setIsMobileMenuOpen(false)
                    window.location.href = `/browse?search=${encodeURIComponent(query)}`
                  }
                }}
              />
              <svg
                className="absolute left-3 xs:left-3.5 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-gray-400 pointer-events-none flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
            <Link
              href="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px] flex items-center ${
                isActive('/browse')
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:text-primary hover:bg-gray-100'
              }`}
            >
              Browse
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px] flex items-center ${
                isActive('/pricing')
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:text-primary hover:bg-gray-100'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px] flex items-center ${
                isActive('/about')
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:text-primary hover:bg-gray-100'
              }`}
            >
              About
            </Link>
            <Link
              href="/help"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px] flex items-center ${
                isActive('/help')
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:text-primary hover:bg-gray-100'
              }`}
            >
              Help
            </Link>
            {!isApprovedContributor && (
              <Link
                href="/become-contributor"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px] flex items-center ${
                  isActive('/become-contributor')
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:text-primary hover:bg-gray-100'
                }`}
              >
                Sell Assets
              </Link>
            )}
          </div>

          {/* Mobile Auth Buttons */}
          {!user && (
            <div className="flex flex-col gap-2.5 xs:gap-3 sm:gap-4 pt-3 xs:pt-4 sm:pt-5 md:pt-6 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/auth/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 xs:px-5 sm:px-5 md:px-6 py-3 xs:py-3.5 sm:py-4 text-center rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px] flex items-center justify-center"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 xs:px-5 sm:px-5 md:px-6 py-3 xs:py-3.5 sm:py-4 text-center rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-md touch-manipulation min-h-[44px] xs:min-h-[48px] flex items-center justify-center"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile User Menu */}
          {user && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 xs:pt-4 sm:pt-5 md:pt-6 mt-3 xs:mt-4 sm:mt-5 md:mt-6">
              <div className="px-3 xs:px-4 sm:px-5 md:px-6 py-3 xs:py-4 sm:py-5 mb-3 xs:mb-4 sm:mb-5 bg-gray-50 dark:bg-gray-800 rounded-lg xs:rounded-xl">
                <div className="flex items-center justify-between gap-2 xs:gap-3 mb-3 xs:mb-4 min-w-0">
                  <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 min-w-0 flex-1">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={username.charAt(0).toUpperCase()}
                        className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-base xs:text-lg sm:text-xl border-2 border-gray-300 dark:border-gray-600 flex-shrink-0">
                        {username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">{username}</p>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <NotificationBell />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3">
                <Link
                  href="/favorites"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px]"
                >
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Favorites</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px]"
                >
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile & Settings</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px]"
                  >
                    <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Admin Panel</span>
                  </Link>
                )}
                {isApprovedContributor && (
                  <Link
                    href="/contributor/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation min-h-[44px] xs:min-h-[48px]"
                  >
                    <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Contributor Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 px-4 xs:px-5 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left mt-2 touch-manipulation min-h-[44px] xs:min-h-[48px]"
                >
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  ) : null

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-[130] backdrop-blur-md border-b border-gray-200 shadow-sm w-full">
        <nav className="hidden lg:flex items-center justify-between w-full max-w-[100vw] bg-background mx-auto px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 lg:py-2 2xl:py-4 relative z-[150]">
          <div>
            <img 
              src="/logo.png" 
              className="w-[170px]" 
              alt="logo" 
            />
          </div>
           {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {loading ? (
              <div className="w-8 h-8 xl:w-9 xl:h-9 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0"></div>
            ) : user ? (
              <>
                <Link href="/favorites" className="p-1">
                  <svg
                    className="w-6 h-6 text-gray-700 hover:text-red-500 transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 0 4.5 4.5 0 010 6.364L12 20.364 4.318 12.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                </Link>
                <div data-notification-bell className="flex-shrink-0 relative z-[140]">
                  <NotificationBell />
                </div>
                <div className="relative flex-shrink-0 z-[140]" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsDropdownOpen(!isDropdownOpen)
                  }}
                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full touch-manipulation min-w-[40px] min-h-[40px] xl:min-w-[44px] xl:min-h-[44px] relative z-[140] pointer-events-auto cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={username.charAt(0).toUpperCase()}
                      className="w-9 h-9 xl:w-10 xl:h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                    />

                  ) : (
                    <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm xl:text-base border-2 border-gray-300 dark:border-gray-600 flex-shrink-0">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute z-[200] right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 "
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Username */}
                    <div className="px-4 py-3 border-b border-gray-200 border-gray-700 max-w-full">
                      <p className="text-sm font-semibold text-gray-900">
                        {username}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/favorites"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsDropdownOpen(false)
                        }}
                        className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-secondary transition-colors ${
                          isActive('/favorites') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        Favorites
                      </Link>
                      <Link
                        href="/profile"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsDropdownOpen(false)
                        }}
                        className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-secondary transition-colors ${
                          isActive('/profile') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile & Settings
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsDropdownOpen(false)
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      {isApprovedContributor && (
                        <Link
                          href="/contributor/dashboard"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsDropdownOpen(false)
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Contributor Dashboard
                        </Link>
                      )}
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSignOut()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  href="/auth/signin"
                  className={`py-2 text-sm xl:text-base font-semibold transition-colors whitespace-nowrap min-h-[36px] xl:min-h-[40px] flex items-center ${
                    pathname === '/auth/signin'
                      ? 'text-header cursor-default pointer-events-none'
                      : 'text-primary hover:text-header'
                  }`}
                  aria-current={pathname === '/auth/signin' ? 'page' : undefined}
                >
                  LOG IN
                </Link>

                <span className="text-primary text-lg font-medium">/</span>

                <Link
                  href="/auth/signup"
                  className={`py-2 text-sm xl:text-base font-semibold transition-colors whitespace-nowrap min-h-[36px] xl:min-h-[40px] flex items-center ${
                    pathname === '/auth/signup'
                      ? 'text-header cursor-default pointer-events-none'
                      : 'text-primary hover:text-header'
                  }`}
                  aria-current={pathname === '/auth/signup' ? 'page' : undefined}
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
          

        </nav>
        <nav className="w-full max-w-[100vw] bg-background mx-auto px-2 xs:px-3 sm:px-4 md:px-5 bg-header lg:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-2 relative z-[100]">
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 sm:justify-between relative w-full min-w-0 z-[130]">
          {/* Mobile Menu Button - Hidden on Desktop */}  
          <div className="flex items-center gap-3">
          <button
            ref={menuButtonRef}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleMobileMenu()
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            onTouchStart={(e) => {
              e.stopPropagation()
            }}
            data-mobile-menu-button
            className="lg:hidden p-1.5 xs:p-2 sm:p-2.5 -ml-0.5 xs:-ml-1 rounded-lg transition-colors active:scale-95 touch-manipulation z-[140] flex-shrink-0 relative cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center pointer-events-auto"
            style={{ zIndex: 140, position: 'relative', pointerEvents: 'auto' }}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            <svg
              className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-white dark:text-white flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>

        

        

          
          {/* Logo - Hidden when search is focused on mobile, always visible on desktop */}
          <div className={`flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 flex-shrink-0 transition-all duration-300 min-w-0 ${
            isSearchFocused 
              ? 'lg:opacity-100 lg:w-auto lg:max-w-none opacity-0 w-0 overflow-hidden max-w-0' 
              : 'opacity-100 max-w-[120px] xs:max-w-[140px] sm:max-w-[160px] md:max-w-none lg:max-w-none'
          }`}>
            <Link
              href="/"
              className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-white text-transparent transition-all whitespace-nowrap truncate"
            >
              StocksOcean
            </Link>
          </div>

          </div>
          

          {/* Mobile/Tablet Search Bar - Always Visible */}

          <div className="lg:hidden flex items-center justify-end gap-3 w-full">
          
          <div className={`lg:hidden relative transition-all duration-300 ease-in-out min-w-0 flex-1 ${
            isSearchFocused 
              ? 'flex-1 min-w-0 max-w-none' 
              : 'max-w-[calc(100%-180px)] xs:max-w-[calc(100%-200px)] sm:max-w-[calc(100%-240px)] md:max-w-[320px]'
          }`}>
            <div ref={searchInputRef} className='relative w-full flex items-center min-w-0'>
              <input
              
              type="text"
              placeholder="Search..."
              className={`w-full min-w-0 px-2.5 xs:px-3 sm:px-4 md:px-5 py-2 xs:py-2.5 sm:py-3 pl-8 xs:pl-9 sm:pl-10 md:pl-11 pr-3 xs:pr-4 text-xs xs:text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg xs:rounded-xl bg-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                ${isSearchFocused
                  ? 'block px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base sm:text-lg md:text-lg shadow-lg border-blue-500 pr-8 xs:pr-10 sm:pr-12'
                  : 'hidden'
                }`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value
                  setIsSearchFocused(false)
                  window.location.href = `/browse?search=${encodeURIComponent(query)}`
                }
              }}
            />

             <svg
              className={`${isSearchFocused ? 'absolute left-[10px] top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-gray-500' : 'absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              onClick={() => {
                setIsSearchFocused(true)
                searchInputRef.current?.focus() // focus input when SVG clicked
              }}
            >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {/* Cancel Button - Only visible when focused */}
              {isSearchFocused && (
                <button
                  onClick={() => {
                    setIsSearchFocused(false)
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement
                    if (input) input.blur()
                  }}
                  className="absolute right-1.5 xs:right-2 sm:right-2.5 md:right-3 top-1/2 -translate-y-1/2 px-1.5 xs:px-2 sm:px-2.5 py-1 text-xs xs:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors touch-manipulation min-h-[32px] flex items-center"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Mobile/Tablet User Avatar/Button */}
          <div className={`lg:hidden flex-shrink-0 transition-all duration-300 min-w-0 relative z-[140] ${
            isSearchFocused ? 'opacity-0 w-0 overflow-hidden max-w-0' : 'opacity-100'
          }`}>
            {loading ? (
              <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0"></div>
            ) : user ? (
              <div className="flex items-center gap-1.5 xs:gap-2 min-w-0">
                <div className="flex-shrink-0">
                  <NotificationBell />
                </div>
                <div className="flex items-center justify-center flex-shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={username.charAt(0).toUpperCase()}
                      className="w-8 h-8 xs:w-9 text-white xs:h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-300 text-center flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs xs:text-sm sm:text-base border-2 border-gray-300 flex-shrink-0">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            ) : (
            <></>
            )}
          </div>
        </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 w-full mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search assets..."
                className="
                w-full px-4 py-2.5 pl-11 pr-4
                border border-gray-200
                rounded-lg
                bg-white
                text-gray-900
                placeholder-gray-400
                text-sm xl:text-base
                transition-all duration-300

                focus:outline-none
                focus:border-none
                focus:ring-1
                focus:ring-header
                focus:shadow-medium"                
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value
                    window.location.href = `/browse?search=${encodeURIComponent(query)}`
                  }
                }}
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-4 flex-shrink-0">
            <Link
              href="/browse"
              className={`px-2.5 xl:px-3 2xl:px-4 py-2 hover:bg-white hover:text-header rounded-lg text-sm xl:text-base text-white font-medium transition-colors whitespace-nowrap touch-manipulation ${
                isActive('/browse')
                  ? '!text-header bg-white'
                  : 'text-primary'
              }`}
            >
              Browse
            </Link>
            <Link
              href="/pricing"
              className={`px-2.5 xl:px-3 2xl:px-4 py-2 hover:bg-white hover:text-header rounded-lg text-sm xl:text-base text-white font-medium transition-colors whitespace-nowrap touch-manipulation ${
                isActive('/pricing')
                  ? '!text-header bg-white'
                  : 'text-primary'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`px-2.5 xl:px-3 2xl:px-4 py-2 hover:bg-white hover:text-header rounded-lg text-sm xl:text-base text-white font-medium transition-colors whitespace-nowrap touch-manipulation ${

                isActive('/about')
                  ? '!text-header bg-white'
                  : 'text-primary'
              }`}
            >
              About
            </Link>
            <Link
              href="/help"
              className={`px-2.5 xl:px-3 2xl:px-4 py-2 hover:bg-white hover:text-header rounded-lg text-sm xl:text-base text-white font-medium transition-colors whitespace-nowrap touch-manipulation ${

                isActive('/help')
                  ? '!text-header bg-white'
                  : 'text-primary'
              }`}
            >
              Help
            </Link>
            {!isApprovedContributor && (
              <Link
                href="/become-contributor"
              className={`px-2.5 xl:px-3 2xl:px-4 py-2 hover:bg-white hover:text-header rounded-lg text-sm xl:text-base text-white font-medium transition-colors whitespace-nowrap touch-manipulation ${
                  isActive('/become-contributor')
                    ? '!text-header bg-white'
                  : 'text-primary'
              }`}
            >
                Sell Assets
              </Link>
            )}
          </div>

          

         
        </div>
      </nav>
    </header>
      {isMounted && mobileMenuContent && createPortal(mobileMenuContent, document.body)}
    </>
  )
}

