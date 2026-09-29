import { z } from 'zod';

const createTaskSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').trim(),
    description: z.string().optional(),
    assignedTo: z.string().optional().nullable(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    dueDate: z.coerce.date({ message: 'Valid due date is required' }),
});

const updateTaskSchema = createTaskSchema.partial();

const updateStatusSchema = z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
});

export {
    createTaskSchema,
    updateTaskSchema,
    updateStatusSchema,
};
