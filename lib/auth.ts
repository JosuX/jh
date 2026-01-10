import crypto from 'crypto'
import dbConnect from './db'
import Session, { ISession } from './models/Session'
import Guest, { IGuest } from './models/Guest'

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export interface SessionValidationResult {
  valid: boolean
  guest: IGuest | null
  session: ISession | null
}

/**
 * Validates a session token directly. 
 * Used for localStorage/Header based auth.
 */
export async function validateToken(token: string): Promise<SessionValidationResult> {
  if (!token) {
    return { valid: false, guest: null, session: null }
  }

  await dbConnect()

  const session = await Session.findOne({
    token: token,
  })

  if (!session) {
    return { valid: false, guest: null, session: null }
  }

  const guest = await Guest.findById(session.guestId)

  if (!guest) {
    return { valid: false, guest: null, session: null }
  }

  return { valid: true, guest, session }
}

export async function getActiveSessionForGuest(
  guestId: string
): Promise<ISession | null> {
  await dbConnect()

  const session = await Session.findOne({
    guestId,
  })

  return session
}

export async function createSession(guestId: string): Promise<ISession> {
  await dbConnect()

  const token = generateSessionToken()

  const session = await Session.create({
    guestId,
    token,
  })

  return session
}

export async function deleteSession(token: string): Promise<void> {
  await dbConnect()
  await Session.deleteOne({ token })
}
