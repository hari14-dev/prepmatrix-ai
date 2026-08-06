import { Schema, model } from 'mongoose';

const topicSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, required: true, enum: ['Quant', 'Logical', 'Verbal', 'OS', 'DBMS', 'CN', 'OOPS'] },
    icon: { type: String, default: '📘' },
    conceptArticle: { type: String, required: true }
  },
  { timestamps: true }
);

export const TopicModel = model('Topic', topicSchema);
