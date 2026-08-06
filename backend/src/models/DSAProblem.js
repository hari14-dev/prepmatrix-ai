import { Schema, model } from 'mongoose';

const starterCodeSchema = new Schema(
  {
    cpp: { type: String, required: true },
    java: { type: String, required: true },
    python: { type: String, required: true },
    javascript: { type: String, required: true }
  },
  { _id: false }
);

const testCaseSchema = new Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    explanation: { type: String, default: '' },
    isPublic: { type: Boolean, default: undefined },
    isHidden: { type: Boolean, default: undefined }
  },
  { _id: false }
);

testCaseSchema.pre('validate', function syncVisibilityFlags(next) {
  if (typeof this.isPublic !== 'boolean' && typeof this.isHidden !== 'boolean') {
    this.isPublic = true;
    this.isHidden = false;
    return next();
  }

  if (typeof this.isPublic !== 'boolean') {
    this.isPublic = !this.isHidden;
  }
  if (typeof this.isHidden !== 'boolean') {
    this.isHidden = !this.isPublic;
  }
  next();
});

const dsaProblemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Med', 'Medium', 'Hard'],
      set: (value) => (String(value).trim() === 'Med' ? 'Medium' : String(value).trim())
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    pattern: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: [
        'Arrays',
        'Sliding Window',
        'Two Pointers',
        'Recursion',
        'Backtracking',
        'Dynamic Programming',
        'Binary Search',
        'Graph',
        'Tree',
        'Greedy',
        'Prefix Sum',
        'Stack',
        'Queue',
        'Heap',
        'Bit Manipulation'
      ]
    },
    description: { type: String, required: true },
    constraints: { type: [String], default: [] },
    inputFormat: { type: String, required: true },
    outputFormat: { type: String, required: true },
    sampleInput: { type: String, default: '' },
    sampleOutput: { type: String, default: '' },
    hintText: { type: String, required: true },
    starterCode: { type: starterCodeSchema, required: true },
    testCases: { type: [testCaseSchema], default: [] }
  },
  { timestamps: true }
);

dsaProblemSchema.index({ pattern: 1, difficulty: 1 });

export const DSAProblemModel = model('DSAProblem', dsaProblemSchema);
