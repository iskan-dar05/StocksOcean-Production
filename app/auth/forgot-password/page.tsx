'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabaseClient'
import Header from '../../../components/layout/Header'

async function handleForgotPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/auth/reset-password',
  })

  if (error) {
    console.error(error.message)
    return { success: false }
  }

  return { success: true }
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email) return toast.error("Email required")

    setLoading(true)
    const res = await handleForgotPassword(email)
    setLoading(false)

    if (res.success) {
      alert('Check your email for reset link')
    } else {
      alert('Something went wrong')
    }
  }

  return (
   <div className="h-screen flex flex-col bg-gray-50">
  <Header />

  <div className="flex-1 flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      
      <h2 className="text-2xl font-bold text-green-600 mb-2">
        Forgot Password
      </h2>

      <p className="text-gray-500 mb-6 text-sm">
        Enter your email and we’ll send you a reset link
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="space-y-4"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>

    </div>
  </div>
</div>
    
  )
}