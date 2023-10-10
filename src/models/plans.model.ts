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
    type: String,
    trim: true,
  },
  duration: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  features: {
    type: String,
    trim: true,
  },
});

const planModel = model<Plan & Document>('Plan', PlanSchema);

export default planModel;
