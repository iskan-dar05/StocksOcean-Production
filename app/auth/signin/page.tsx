'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'
import Header from '@/components/layout/Header'
import Image from 'next/image'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')




  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    setError(error.message)
    return
  }

  if (data.user) {
    if (!data.user.email_confirmed_at) {
      setError('Please verify your email before logging in.')

      await supabase.auth.signOut()
      return
    }

    router.push('/')
  }
}

  const handleOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    if (error) setError(error.message)
  }

   return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen flex items-center flex-col lg:flex-row justify-around px-4">
        <div className="relative w-[240px] sm:w-[300px] md:w-[400px] aspect-square">
          <Image
            src="/signup.png"
            alt="signup image"
            fill
            className="object-contain"
          />
        </div>
      <div className="max-w-md w-full rounded-2xl p-8">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-header block mb-1"
          >
            Log in
          </h1>
          <span className="text-secondary">Join Us</span>

        </div>


        {/* Email / Password Form */}
        <form onSubmit={handleSignIn} className="space-y-4 mb-4">
          <div>
            <label for="email">Email</label>
          <input
            type="email"
            placeholder="jhon@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-primary placeholder-gray-400 focus:border-header"
            required
          />
          </div>

          <div>
            <label for="password">Password</label>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-primary placeholder-gray-400 focus:border-header"
            required
          />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="py-3 px-6 bg-header hover:bg-secondary hover:text-white rounded-sm text-white font-bold transition"
          >
            Log in
          </button>
        </form>

        {/* OAuth */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleOAuth('google')}
            className="w-12 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
          >
            <FcGoogle className="w-8 h-8" />
          </button>

          <button
            onClick={() => handleOAuth('github')}
            className="w-12 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
          >
            <BsGithub className="w-8 h-8" />
          </button>
        </div>

        <div className="mt-4 text-center text-gray-400">
          
          <p className="text-sm text-gray-400">
            I don’t have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-header font-semibold hover:text-header hover:underline"
            >
              Register
            </Link>
          </p>          
        </div>
      </div>
      </div>
      
    </div>
  )
}
