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
  min_pics: {
    type: Number,
    trim: true,
  },
  max_pics: {
    type: Number,
    trim: true,
  },
  min_videos: {
    type: Number,
    trim: true,
  },
  max_videos: {
    type: Number,
    trim: true,
  },
  min_links: {
    type: Number,
    trim: true,
  },
  max_links: {
    type: Number,
    trim: true,
  },
  planType: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  description: {
    type: String,
    trim: true,
  },
  features: {
    image: {
      type: String,
      default: 'none',
    },
    video: {
      type: String,
      default: 'none',
    },
    swipeModel: {
      type: String,
      default: 'none',
    },
    newComerOfWeek: {
      type: String,
      default: 'none',
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
