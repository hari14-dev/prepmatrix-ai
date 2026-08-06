/**
 * ContestAttempt.js — Tracks a user's attempt on a specific contest
 * One attempt per user per contest (upserted on start, updated on submit).
 */
import { Schema, model } from 'mongoose';

const attemptAnswerSchema = new Schema({
  questionId:          { type: Schema.Types.ObjectId, required: true },
  selectedAnswerIndex: { type: Number, default: -1 }, // -1 = unanswered
  isCorrect:           { type: Boolean, default: false },
}, { _id: false });

const contestAttemptSchema = new Schema({
  userId:      { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  contestId:   { type: Schema.Types.ObjectId, required: true, ref: 'Contest' },
  status:      { type: String, enum: ['in-progress', 'submitted', 'timed-out'], default: 'in-progress' },
  startedAt:   { type: Date, default: Date.now },
  submittedAt: { type: Date },
  answers:     { type: [attemptAnswerSchema], default: [] },
  score:       { type: Number, default: 0 },
  totalMarks:  { type: Number, default: 0 },
}, { timestamps: true });

contestAttemptSchema.index({ userId: 1, contestId: 1 }, { unique: true });

export const ContestAttemptModel = model('ContestAttempt', contestAttemptSchema);
