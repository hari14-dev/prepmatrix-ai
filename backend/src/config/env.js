import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../../.env') });
config(); // fallback to current working dir

const rawPort = process.env.PORT;
const parsedPort = Number(rawPort);

const envPort = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 5000;
const envMongoUri = process.env.MONGODB_URI;
const envJwtSecret = process.env.JWT_SECRET;
const envJwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
const envGroqApiKey   = process.env.GROQ_API_KEY   || '';
const envGoogleClientId = process.env.GOOGLE_CLIENT_ID || '';
const envOneCompilerApiUrl = process.env.ONECOMPILER_API_URL || 'https://onecompiler-apis.p.rapidapi.com';
const envOneCompilerRapidApiHost = process.env.ONECOMPILER_RAPIDAPI_HOST || 'onecompiler-apis.p.rapidapi.com';
const envOneCompilerRapidApiKey = process.env.ONECOMPILER_RAPIDAPI_KEY || '';

if (!envMongoUri || envMongoUri.trim() === '') {
  throw new Error('MONGODB_URI is required in backend/.env');
}

if (!envJwtSecret || envJwtSecret.trim().length < 8) {
  throw new Error('JWT_SECRET is required and must be at least 8 characters');
}

export const env = {
  PORT: envPort,
  MONGODB_URI: envMongoUri,
  JWT_SECRET: envJwtSecret,
  JWT_EXPIRES_IN: envJwtExpiresIn,
  GROQ_API_KEY: envGroqApiKey,
  GOOGLE_CLIENT_ID: envGoogleClientId,
  ONECOMPILER_API_URL: envOneCompilerApiUrl,
  ONECOMPILER_RAPIDAPI_HOST: envOneCompilerRapidApiHost,
  ONECOMPILER_RAPIDAPI_KEY: envOneCompilerRapidApiKey
};