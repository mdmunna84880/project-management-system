import { z } from 'zod';

const createProjectSchema = z.object({
    name: z.string().min(2, 'Project name must be at least 2 characters').trim(),
    description: z.string().optional(),
    status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date({ message: 'Valid due date is required' }),
});

const updateProjectSchema = createProjectSchema.partial();

export {
    createProjectSchema,
    updateProjectSchema,
};