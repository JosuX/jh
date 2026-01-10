import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guest, { GuestStatus } from '@/lib/models/Guest';

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

    // Example action: Mark as entered if not already
    let message = `Guest found: ${guest.name}`;
    if (guest.status !== GuestStatus.ENTERED) {
      guest.status = GuestStatus.ENTERED;
      await guest.save();
      message = `Guest ${guest.name} marked as ENTERED`;
    } else {
      message = `Guest ${guest.name} was already marked as ENTERED`;
    }

    return NextResponse.json({
      success: true,
      message,
      guest: {
        name: guest.name,
        code: guest.code,
        status: guest.status,
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
