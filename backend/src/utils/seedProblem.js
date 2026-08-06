/**
 * Sample script demonstrating how to use inputSanitizer.js to seed problems
 * with properly formatted test cases for competitive programming.
 *
 * Usage:
 *   node src/utils/seedProblem.js
 *
 * This script:
 * 1. Takes LeetCode-style test cases (with brackets/commas)
 * 2. Cleans them using formatForCP utility
 * 3. Saves formatted problems to MongoDB via ProblemModel
 */

import { config } from 'dotenv';
import mongoose from 'mongoose';
import { ProblemModel } from '../models/Problem.js';
import { TopicModel } from '../models/Topic.js';
import { formatForCP } from './inputSanitizer.js';

config();

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required in .env');
  }
  await mongoose.connect(mongoUri);
  console.log('✓ Connected to MongoDB');
}

async function seedSampleProblems() {
  console.log('📝 Seeding sample problems with formatted test cases...\n');

  // Example 1: Array-based problem
  const arrayTestCase1 = {
    input: formatForCP('[1,2,3], 10', 'ARRAY'),
    expectedOutput: '6'
  };

  const arrayTestCase2 = {
    input: formatForCP('[5,10,15], 20', 'ARRAY'),
    expectedOutput: '50'
  };

  console.log('Array Mode Example:');
  console.log(`  Raw: [1,2,3], 10`);
  console.log(`  Formatted: ${arrayTestCase1.input}\n`);

  // Example 2: Matrix-based problem
  const matrixTestCase1 = {
    input: formatForCP('[[1,2],[3,4]]', 'MATRIX'),
    expectedOutput: '10'
  };

  const matrixTestCase2 = {
    input: formatForCP('[[1,0,1],[1,1,0]]', 'MATRIX'),
    expectedOutput: '4'
  };

  console.log('Matrix Mode Example:');
  console.log(`  Raw: [[1,2],[3,4]]`);
  console.log(`  Formatted: ${matrixTestCase1.input}\n`);

  // Example 3: Raw mode (already clean)
  const rawTestCase1 = {
    input: formatForCP('5 3', 'RAW'),
    expectedOutput: '12'
  };

  console.log('Raw Mode Example:');
  console.log(`  Raw: 5 3`);
  console.log(`  Formatted: ${rawTestCase1.input}\n`);

  // Find a sample topic (or use any existing one)
  let topic = await TopicModel.findOne().lean();

  if (!topic) {
    console.log('⚠️  No topics found in database. Creating a sample topic...');
    topic = await TopicModel.create({
      title: 'Arrays',
      slug: 'arrays',
      category: 'Quant',
      icon: '📊',
      conceptArticle: 'Basic array operations and manipulation'
    });
    console.log(`  ✓ Created topic: ${topic.title}\n`);
  }

  // Create a sample problem with formatted test cases
  const sampleProblem = {
    topicId: topic._id,
    title: 'Sum of Array Elements',
    description: 'Given an array and a target sum, find pairs that add up to the target.',
    inputFormat: 'First line: array elements separated by spaces. Second line: target sum.',
    outputFormat: 'Single integer: the number of valid pairs.',
    difficulty: 'Medium',
    questionText: 'Find the sum of all array elements.',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswerIndex: 0,
    hintText: 'Use a two-pointer approach or hash map.',
    detailedSolution: 'Iterate through the array and sum all elements.',
    testCases: [arrayTestCase1, arrayTestCase2, matrixTestCase1, matrixTestCase2, rawTestCase1]
  };

  try {
    const created = await ProblemModel.create(sampleProblem);
    console.log('✓ Sample problem created successfully!');
    console.log(`  Problem ID: ${created._id}`);
    console.log(`  Title: ${created.title}`);
    console.log(`  Test Cases:`);
    created.testCases.forEach((tc, idx) => {
      console.log(`    Case ${idx + 1}:`);
      console.log(`      Input: ${tc.input}`);
      console.log(`      Expected: ${tc.expectedOutput}`);
    });
  } catch (error) {
    console.error('✗ Error creating problem:', error.message);
  }
}

async function main() {
  try {
    await connectDB();
    await seedSampleProblems();
    console.log('\n✓ Seeding complete!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  }
}

main();
