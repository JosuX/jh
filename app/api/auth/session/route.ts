import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const { valid, guest } = await validateToken(token)

    if (!valid || !guest) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      guest: {
        name: guest.name,
        status: guest.status,
      },
    })
  } catch (error) {
    console.error('Error validating session:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
