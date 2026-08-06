import { Schema, model } from 'mongoose';

const userProgressSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    isSolved: { type: Boolean, default: false },
    personalNote: { type: String, default: '' }
  },
  { timestamps: true }
);

userProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export const UserProgressModel = model('UserProgress', userProgressSchema);
