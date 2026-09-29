import mongoose from 'mongoose';

const projectMemberSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            enum: ['OWNER', 'MEMBER'],
            default: 'MEMBER',
        },
    },
    { timestamps: true }
);

// Compound index: A user can only have one membership record per project
projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);
export default ProjectMember;