import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId
  guestId: mongoose.Types.ObjectId
  token: string
  createdAt: Date
}

const SessionSchema = new Schema<ISession>(
  {
    guestId: {
      type: Schema.Types.ObjectId,
      ref: 'Guest',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes for faster lookups (token already indexed via unique: true)
SessionSchema.index({ guestId: 1 })

// Delete the model if it exists in development to ensure schema changes are applied
if (process.env.NODE_ENV === 'development' && mongoose.models.Session) {
  delete mongoose.models.Session
}

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema)

export default Session
