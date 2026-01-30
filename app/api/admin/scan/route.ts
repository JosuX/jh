import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guest, { GuestStatus } from '@/lib/models/Guest';

// Wedding day: March 6, 2026 4PM PHT (UTC+8)
const WEDDING_DATE = new Date('2026-03-06T16:00:00+08:00');

function isWeddingDay(): boolean {
  const now = new Date();
  return now >= WEDDING_DATE;
}

export async function POST(request: NextRequest) {
  try {
    const { decodedText } = await request.json();

    if (!decodedText) {
      return NextResponse.json(
        { error: 'Decoded text is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Extract code from decodedText (it might be a URL or just the code)
    let guestCode = decodedText.trim();
    console.log(guestCode);
    if (guestCode.includes('/')) {
      const parts = guestCode.split('/');
      guestCode = parts[parts.length - 1] || guestCode;
    }

    // Find guest by code (assuming the QR code contains the guest code)
    const guest = await Guest.findOne({
      code: guestCode.toUpperCase(),
    });

    if (!guest) {
      return NextResponse.json({
        success: false,
        message: 'Guest not found',
        decodedText
      });
    }

    const isLive = isWeddingDay();
    let message = `Guest found: ${guest.name}`;
    let simulatedStatus = guest.status;

    if (isLive) {
      // LIVE MODE: Actually update the database
      if (guest.status !== GuestStatus.IN_VENUE) {
        guest.status = GuestStatus.IN_VENUE;
        await guest.save();
        message = `${guest.name} is now IN VENUE`;
      } else {
        message = `${guest.name} is already IN VENUE`;
      }
    } else {
      // SIMULATION MODE: Don't update database, just simulate
      if (guest.status !== GuestStatus.IN_VENUE) {
        simulatedStatus = GuestStatus.IN_VENUE;
        message = `[SIMULATION] ${guest.name} would be marked IN VENUE`;
      } else {
        message = `[SIMULATION] ${guest.name} is already IN VENUE`;
      }
    }

    return NextResponse.json({
      success: true,
      message,
      isSimulation: !isLive,
      guest: {
        name: guest.name,
        code: guest.code,
        status: isLive ? guest.status : simulatedStatus,
      },
      decodedText
    });
  } catch (error) {
    console.error('Error processing scan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
