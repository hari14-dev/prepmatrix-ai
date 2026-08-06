import { Schema, model } from 'mongoose';

const userSubmissionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'DSAProblem', required: true, index: true },
    code: { type: String, required: true },
    language: { type: String, required: true, enum: ['cpp', 'java', 'python', 'javascript'] },
    status: { type: String, required: true, enum: ['Accepted', 'Wrong', 'Runtime'] },
    runtime: { type: Number, required: true, min: 0 },
    memory: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

userSubmissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });

export const UserSubmissionModel = model('UserSubmission', userSubmissionSchema);
