import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export { registerSchema, loginSchema };