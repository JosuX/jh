'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface GuestInfo {
  name: string
  status: string | null
}

const Page = () => {
  const router = useRouter()
  const [guestCode, setGuestCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('guest_session')
      if (!token) return

      try {
        const response = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setGuestInfo(data.guest)
        } else {
          localStorage.removeItem('guest_session')
        }
      } catch (err) {
        console.error('Session check failed', err)
      }
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!guestCode.trim()) {
      setError('Please enter your guest code')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: guestCode.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'An error occurred')
        setIsLoading(false)
        return
      }

      // Store token in localStorage
      localStorage.setItem('guest_session', data.token)
      setGuestInfo(data.guest)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenInvitation = () => {
    router.push('/invitation')
  }

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 video-bg-mobile video-opacity-gradient"
      >
        <source src="/Wedding Video Banner.mp4" type="video/mp4" />
      </video>
      
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        {/* White Card Container */}
        <div className="white-card-container bg-white rounded-[10px] shadow-[0_1px_4px_0_#F9F9F9]">
          {/* Title */}
          <h1 className="card-title text-center mb-4 font-bold">
            FIND MY INVITATION
          </h1>
          
          {/* Instructional Text */}
          <p className="card-instruction text-center mb-6">
            Kindly enter your Guest code to find your invitation.<br/>Remember that the access to your invitation will be saved, and can only be accessed on this device.
          </p>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col items-center">
            {/* Input Field */}
            <input
              type="text"
              value={guestCode}
              onChange={(e) => {
                setGuestCode(e.target.value)
                setError(null)
              }}
              placeholder=""
              className="card-input mb-1"
              disabled={isLoading || !!guestInfo}
            />
            
            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            
            {/* Button */}
            {!guestInfo && (
              <button
                type="submit"
                className="card-button"
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : "Let's Go!"}
              </button>
            )}
          </form>

          {/* Invitation Result Section */}
          {guestInfo && (
            <div className="w-full max-w-xs flex flex-col items-center">
              <div className="invitation-result-box flex flex-col items-center">
                <p className="welcome-text text-center">
                  Welcome, {guestInfo.name}! You have 1 reserved seat in your name.
                </p>
                <button 
                  className="open-invitation-button"
                  onClick={handleOpenInvitation}
                >
                  Open My Invitation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logo Container */}
      <div className="absolute z-20 bottom-6 md:bottom-0 left-0 right-0 md:left-auto md:right-0 flex justify-center md:justify-end">
        <div className="w-[200px] md:w-[300px] lg:w-[310px] transition-all duration-300 pt-2 px-2 md:px-0">
          <Image
            src="/JH WEDDING LOGO - WHITE.png"
            alt="J&H Wedding Logo"
            width={310}
            height={310}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default Page
