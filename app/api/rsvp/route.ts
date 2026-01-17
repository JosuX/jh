import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guest from '@/lib/models/Guest';

// GET: Check if a guest code has already RSVP'd
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Guest code is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const guest = await Guest.findOne({
      code: code.toUpperCase().trim(),
    });

    if (!guest) {
      return NextResponse.json({
        success: false,
        message: 'Guest not found',
      });
    }

    return NextResponse.json({
      success: true,
      rsvpConfirmed: guest.rsvpConfirmed,
      guest: {
        name: guest.name,
        code: guest.code,
      },
    });
  } catch (error) {
    console.error('Error checking RSVP status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Confirm RSVP by guest code
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Guest code is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const guest = await Guest.findOne({
      code: code.toUpperCase().trim(),
    });

    if (!guest) {
      return NextResponse.json({
        success: false,
        message: 'Guest not found. Please check your code and try again.',
      });
    }

    // Check if already RSVP'd
    if (guest.rsvpConfirmed) {
      return NextResponse.json({
        success: true,
        message: 'You have already confirmed your attendance!',
        alreadyConfirmed: true,
        guest: {
          name: guest.name,
          code: guest.code,
        },
      });
    }

    // Confirm RSVP
    guest.rsvpConfirmed = true;
    await guest.save();

    return NextResponse.json({
      success: true,
      message: 'Your attendance has been confirmed!',
      alreadyConfirmed: false,
      guest: {
        name: guest.name,
        code: guest.code,
      },
    });
  } catch (error) {
    console.error('Error confirming RSVP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
