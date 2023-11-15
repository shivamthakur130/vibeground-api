import { model, Schema, Document } from 'mongoose';
import { MeetAndGreet } from '@interfaces/meet-greet.interface';

const MeetAndGreetSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  emailId: { type: String, required: true },
  instagramId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const planModel = model<MeetAndGreet & Document>('meet_and_greets', MeetAndGreetSchema);

export default planModel;
