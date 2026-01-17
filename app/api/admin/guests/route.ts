import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guest from '@/lib/models/Guest';

// GET: Fetch all guests with their status
export async function GET() {
  try {
    await dbConnect();

    const guests = await Guest.find({})
      .select('name code status rsvpConfirmed createdAt updatedAt')
      .sort({ createdAt: -1 });

    // Calculate stats
    const totalGuests = guests.length;
    const rsvpConfirmed = guests.filter(g => g.rsvpConfirmed).length;
    const inVenue = guests.filter(g => g.status === 'in_venue').length;

    return NextResponse.json({
      success: true,
      guests: guests.map(g => ({
        id: g._id.toString(),
        name: g.name,
        code: g.code,
        status: g.status,
        rsvpConfirmed: g.rsvpConfirmed,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
      })),
      stats: {
        total: totalGuests,
        rsvpConfirmed,
        inVenue,
        pending: totalGuests - rsvpConfirmed,
      },
    });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
