import * as process from 'node:process';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  frontendUrl: process.env.FRONTEND_URL,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: parseInt(process.env.MAILER_PORT, 10) || 1025,
    secure: process.env.MAILER_SECURE === 'true',
    from: process.env.MAILER_FROM,
    tls: {
      rejectUnauthorized: process.env.MAILER_TLS_REJECT_UNAUTHORIZED === 'true',
    },
  },
});
