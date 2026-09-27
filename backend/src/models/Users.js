import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false, // Do not return password by default in queries
        },
        role: {
            type: String,
            enum: ['ADMIN', 'USER'],
            default: 'USER',
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    // Cost factor of 10 as specified in requirements
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to check password validity
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;