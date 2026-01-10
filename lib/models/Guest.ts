import mongoose, { Schema, Document, Model } from 'mongoose'

export enum GuestStatus {
  PENDING = 'pending',
  IN_VENUE = 'in_venue',
}

export interface IGuest extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  code: string
  status: GuestStatus | null
  updatedAt: Date
  createdAt: Date
}

const GuestSchema = new Schema<IGuest>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: Object.values(GuestStatus),
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Delete the model if it exists in development to ensure schema changes are applied
if (process.env.NODE_ENV === 'development' && mongoose.models.Guest) {
  delete mongoose.models.Guest
}

const Guest: Model<IGuest> =
  mongoose.models.Guest || mongoose.model<IGuest>('Guest', GuestSchema)

export default Guest
