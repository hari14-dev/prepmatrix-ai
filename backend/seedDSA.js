import mongoose from 'mongoose';
import { env } from './src/config/env.js';
import { DSAProblemModel } from './src/models/DSAProblem.js';
import { ensureDSASeedData } from './src/data/dsaSeed.js';

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  await ensureDSASeedData();

  const count = await DSAProblemModel.countDocuments();
  console.log(`DSA seeding complete. Problems in collection: ${count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
