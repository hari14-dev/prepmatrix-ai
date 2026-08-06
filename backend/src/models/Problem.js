import { Schema, model } from 'mongoose';

const testCaseSchema = new Schema(
  {
    input: { type: String, required: true, trim: true },
    expectedOutput: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const problemSchema = new Schema(
  {
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    inputFormat: { type: String, default: '', trim: true },
    outputFormat: { type: String, default: '', trim: true },
    testCases: { type: [testCaseSchema], default: [] },
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswerIndex: { type: Number, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard', 'Med'],
      set: (value) => (String(value).trim() === 'Med' ? 'Medium' : String(value).trim())
    },
    pattern: { type: String, default: '' },
    hintText: { type: String, required: true },
    detailedSolution: { type: String, required: true }
  },
  { timestamps: true }
);

export const ProblemModel = model('Problem', problemSchema);
