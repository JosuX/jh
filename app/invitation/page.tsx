'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import InvitationContent from './InvitationContent'

export default function InvitationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('guest_session')
      
      if (!token) {
        toast.error('Session not found', {
          description: 'Please enter your guest code first',
        })
        setTimeout(() => router.push('/'), 1500)
        return
      }

      try {
        const response = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          localStorage.removeItem('guest_session')
          toast.error('Session expired', {
            description: 'Please enter your guest code again',
          })
          setTimeout(() => router.push('/'), 1500)
          return
        }

        await response.json()
        setIsLoading(false)
      } catch (err) {
        console.error('Auth check failed', err)
        toast.error('Connection error', {
          description: 'Unable to verify your session',
        })
        setTimeout(() => router.push('/'), 1500)
      }
    }

    validate()
  }, [router])

  if (isLoading) {
    return (
      <main className="w-screen h-screen bg-black flex flex-col items-center justify-center">
        <Toaster 
          position="top-center" 
          richColors 
          toastOptions={{
            style: {
              fontFamily: 'var(--font-eb-garamond)',
            },
          }}
        />
        <p className="text-white font-italianno text-5xl tracking-wide animate-pulse" aria-live="polite">
          Loading Invitation...
        </p>
        <p className="text-white/60 font-oswald text-xs tracking-[0.3em] mt-4 uppercase">
          Please wait
        </p>
      </main>
    )
  }

  return <InvitationContent />
}
