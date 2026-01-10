import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Guest from '@/lib/models/Guest'
import {
  getActiveSessionForGuest,
  createSession,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Guest code is required' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Find guest by code (case-insensitive)
    const guest = await Guest.findOne({
      code: code.trim().toUpperCase(),
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'Invalid guest code. Please check and try again.' },
        { status: 404 }
      )
    }

    // Check if there's an active session for this guest
    const existingSession = await getActiveSessionForGuest(
      guest._id.toString()
    )

    if (existingSession) {
      return NextResponse.json(
        {
          error:
            'This code is already in use on another device. Please contact the groom for assistance.',
        },
        { status: 409 }
      )
    }

    // Create new session
    const session = await createSession(guest._id.toString())

    return NextResponse.json({
      success: true,
      token: session.token, // Return token to be stored in localStorage
      guest: {
        name: guest.name,
        status: guest.status,
      },
    })
  } catch (error) {
    console.error('Error verifying guest code:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
