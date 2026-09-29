import { z } from 'zod';

const addMemberSchema = z.object({
    email: z.email('Invalid email format').toLowerCase().trim(),
});

export { addMemberSchema };