import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        status: {
            type: String,
            enum: ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'],
            default: 'PLANNING',
        },
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            default: 'MEDIUM',
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Indexes for faster dashboard aggregations and sorting
projectSchema.index({ owner: 1 });
projectSchema.index({ status: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;