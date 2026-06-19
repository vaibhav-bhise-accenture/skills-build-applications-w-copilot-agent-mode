import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  team?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', optional: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
