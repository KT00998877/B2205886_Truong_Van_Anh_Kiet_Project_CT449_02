import momongoose from 'mongoose';
const { Schema, model } = momongoose;

const userSchema = new Schema(
       {
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            role: { type: String, enum: ['admin', 'user'], default: 'user' },
       },
       { collection: 'users' }
);
const User = model('User', userSchema);
export default User;