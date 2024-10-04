import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

// get all env variables
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  smtp_mail: process.env.SMTP_MAIL,
  smtp_password: process.env.SMTP_PASSWORD,
};
