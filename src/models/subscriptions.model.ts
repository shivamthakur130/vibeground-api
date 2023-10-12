import { model, Schema, Document } from 'mongoose';
import { Subscription } from '@interfaces/subscription.interface';

const SubscriptionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: {
    type: String,
    enum: ['active', 'expired', 'suspend', 'inactive'],
    default: 'inactive',
  },
  response: { type: String, default: null },
  purchase_date: { type: Date, default: null },
  expiry_date: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const SubscriptionModel = model<Subscription & Document>('Subscription', SubscriptionSchema);

export default SubscriptionModel;
