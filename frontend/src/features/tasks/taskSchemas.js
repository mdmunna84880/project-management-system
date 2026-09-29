import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  dueDate: z.string().date('Please enter a valid due date'),
  assignedTo: z.string().optional().nullable(),
}).transform(data => {
  if (data.assignedTo === '') data.assignedTo = null;
  return data;
});
