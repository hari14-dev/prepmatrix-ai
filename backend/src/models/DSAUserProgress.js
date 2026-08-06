import { Schema, model } from 'mongoose';

const dsaUserProgressSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'DSAProblem', required: true, index: true },
    personalNote: { type: String, default: '' }
  },
  { timestamps: true }
);

dsaUserProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export const DSAUserProgressModel = model('DSAUserProgress', dsaUserProgressSchema);
