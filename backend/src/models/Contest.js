/**
 * Contest.js — Mongoose model for Practice Contests
 *
 * A Contest has:
 *  - title, description, category tag
 *  - difficulty level
 *  - a list of questions (inline, not referencing Problem docs)
 *    so contests are fully self-contained and don't pollute module question banks
 *  - timeLimit in minutes
 */
import { Schema, model } from 'mongoose';

const contestQuestionSchema = new Schema({
  // type: 'mcq' | 'code'
  type:        { type: String, enum: ['mcq', 'code'], required: true },
  // Which module this question tests
  module:      { type: String, enum: ['Aptitude', 'Core', 'DSA'], required: true },
  topic:       { type: String, required: true },
  difficulty:  { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  questionText:{ type: String, required: true },
  // MCQ fields
  options:         { type: [String], default: [] },
  correctAnswerIndex: { type: Number, default: 0 },
  // Explanation shown after contest ends
  explanation: { type: String, default: '' },
}, { _id: true });

const contestSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  company:     { type: String, default: 'General' }, // category/grouping tag, no company branding
  difficulty:  { type: String, enum: ['Easy', 'Medium', 'Hard', 'Mixed'], default: 'Mixed' },
  timeLimit:   { type: Number, default: 90 }, // minutes
  questions:   { type: [contestQuestionSchema], default: [] },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

export const ContestModel = model('Contest', contestSchema);