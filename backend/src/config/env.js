import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGIN: z.string(),
    MONGODB_URI: z.string().url('MongoDB URI must be a valid URL'),
    JWT_SECRET: z.string().min(10, 'JWT Secret must be at least 10 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
});


const parseEnv = () => {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error('Invalid environment variables:', parsed.error.format());
        process.exit(1);
    }

    return parsed.data;
};

const env = parseEnv();
export default env;