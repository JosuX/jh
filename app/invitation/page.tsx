'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import InvitationContent from './InvitationContent'

export default function InvitationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [guestName, setGuestName] = useState('')

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('guest_session')
      
      if (!token) {
        router.push('/')
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
          router.push('/')
          return
        }

        const data = await response.json()
        setGuestName(data.guest.name)
        setIsLoading(false)
      } catch (err) {
        console.error('Auth check failed', err)
        router.push('/')
      }
    }

    validate()
  }, [router])

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white font-oswald text-xl animate-pulse">
          Loading Invitation...
        </div>
      </div>
    )
  }

  return <InvitationContent guestName={guestName} />
}
