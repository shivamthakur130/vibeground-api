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
    type: [String],
  },
});

const planModel = model<Plan & Document>('Plan', PlanSchema);

export default planModel;
