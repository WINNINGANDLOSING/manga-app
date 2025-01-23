import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
// remember to include it in auth.module.ts with ConfigModule.forFeature
export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET, // no signOptions here
    expiresIn: process.env.REFRESH_JWT_EXPIRE_IN,
  }),
);
