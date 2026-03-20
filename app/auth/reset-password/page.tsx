'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Header from '../../../components/layout/Header'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validSession, setValidSession] = useState<boolean | null>(null)


  useEffect(()=>{
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if(error || !data.session){
        setValidSession(false)
        toast.error("invalid or expired reset link")
      }else{
        setValidSession(true)
      }
    }
    checkSession()
  }, [])


  const handleReset = async () => {
    if (!password || !confirmPassword) {
      return toast.error('Fill all fields')
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated successfully!')
      router.push('/auth/signin')
    }
  }


  // ✅ 3. Loading / invalid states
  if (validSession === null) return <p>Checking reset link...</p>
  if (validSession === false) return <p>Invalid or expired reset link</p>


  return (
    <div className="h-screen flex flex-col bg-gray-50">
  <Header />

  <div className="flex-1 flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      
      <h2 className="text-2xl font-bold text-green-600 mb-2">
        Reset Password
      </h2>

      <p className="text-gray-500 mb-6 text-sm">
        Enter your new password below
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleReset()
        }}
        className="space-y-4"
      >

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

      <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
        >
          {loading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>

    </div>
  </div>
</div>
  )
}
