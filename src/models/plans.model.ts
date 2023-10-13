import { model, Schema, Document } from 'mongoose';
import { Plan } from '@interfaces/plan.interface';

const PlanSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['fan', 'model'],
    default: 'fan',
  },
  name: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    trim: true,
  },
  duration: {
    type: Number,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  features: {
    image: {
      type: String,
      default: false,
    },
    video: {
      type: String,
      default: false,
    },
    swipeModel: {
      type: String,
      default: false,
    },
  },
  recommended: {
    type: Boolean,
    default: false,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const planModel = model<Plan & Document>('Plan', PlanSchema);

export default planModel;
