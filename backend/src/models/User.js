import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Only required for accounts created with email+password. Google-only
    // accounts have no password at all, so this can't be a blanket `required: true`.
    passwordHash: {
      type: String,
      required: function () { return this.authProvider === 'local'; }
    },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, unique: true, sparse: true }, // sparse: only enforced unique among docs that have it
    avatarUrl: { type: String },
    readinessScore: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    targetRole: { type: String, trim: true, default: '' },
    graduationYear: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

export const UserModel = model('User', userSchema);
