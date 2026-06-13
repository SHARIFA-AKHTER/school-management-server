import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.join(process.cwd(), '.env') });

export const env = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,

  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};