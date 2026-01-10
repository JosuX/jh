'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import InvitationContent from './InvitationContent'

export default function InvitationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [guestName, setGuestName] = useState('')

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

        const data = await response.json()
        setGuestName(data.guest.name)
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
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <Toaster 
          position="top-center" 
          richColors 
          toastOptions={{
            style: {
              fontFamily: 'var(--font-eb-garamond)',
            },
          }}
        />
        <div className="text-white font-oswald text-xl animate-pulse">
          Loading Invitation...
        </div>
      </div>
    )
  }

  return <InvitationContent guestName={guestName} />
}
