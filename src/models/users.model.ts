import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  // 1st Step
  type: {
    type: String,
    enum: ['fan', 'model'],
    default: 'fan',
  },
  //2nd Step
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  // 3rd Step
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  userName: {
    type: String,
    trim: true,
  },

  // 4th step
  password: {
    type: String,
    trim: true,
    minlength: 8,
  },

  // 5th step
  date_of_birth: {
    type: Date,
  },
  // 6th Step
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  // 7th Step
  city: {
    type: String,
  },
  country: {
    type: String,
  },

  about: {
    type: String,
    maxLength: 1024,
  },

  passport_front: {
    type: String,
  },
  passport_back: {
    type: String,
  },
  photos: {
    type: [String],
  },
  videos: {
    type: [String],
  },
  links: {
    type: [String],
  },
  categories: {
    type: [String],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
