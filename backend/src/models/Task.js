import { Schema, model } from 'mongoose'

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        status: {
            type: String,
            enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'],
            default: 'TODO',
        },
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            default: 'MEDIUM',
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, // Ensure virtuals are included in JSON responses
        toObject: { virtuals: true }
    }
);

// Virtual field for overdue detection (computed dynamically, never stored)
taskSchema.virtual('isOverdue').get(function () {
    if (!this.dueDate) return false;
    return this.dueDate < Date.now() && this.status !== 'COMPLETED';
});

// Indexes to speed up filtering and dashboard calculations
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });

const Task = model('Task', taskSchema);
export default Task;