import { Schema, model } from 'mongoose';

const aiQuestionSchema = new Schema(
  {
    index: { type: Number, required: true },
    text: { type: String, required: true },
    expectedSignals: { type: [String], default: [] }
  },
  { _id: false }
);

const aiAnswerSchema = new Schema(
  {
    questionIndex: { type: Number, required: true },
    questionText: { type: String, required: true },
    answerText: { type: String, required: true },
    durationSeconds: { type: Number, default: 0 },
    score: { type: Number, required: true },
    technicalScore: { type: Number, required: true },
    communicationScore: { type: Number, required: true },
    confidenceScore: { type: Number, required: true },
    feedback: { type: String, required: true },
    followUpQuestion: { type: String, default: '' }
  },
  { _id: false }
);

const aiTurnSchema = new Schema(
  {
    role: { type: String, enum: ['interviewer', 'candidate', 'system'], required: true },
    text: { type: String, required: true },
    questionIndex: { type: Number, default: null },
    score: { type: Number, default: null },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const aiSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['resume-audit', 'mock-interview'], required: true },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    targetRole: { type: String, trim: true, default: '' },
    focusArea: { type: String, trim: true, default: '' },
    difficulty: { type: String, trim: true, default: '' },
    resumeSnapshot: { type: String, default: '' },
    jobDescriptionSnapshot: { type: String, default: '' },
    auditResult: { type: Schema.Types.Mixed, default: null },
    questions: { type: [aiQuestionSchema], default: [] },
    answers: { type: [aiAnswerSchema], default: [] },
    conversationTurns: { type: [aiTurnSchema], default: [] },
    currentQuestionIndex: { type: Number, default: 0 },
    report: { type: Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
);

export const AISessionModel = model('AISession', aiSessionSchema);
