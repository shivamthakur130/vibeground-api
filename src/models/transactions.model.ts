import { model, Schema, Document } from 'mongoose';
import { Transaction } from '@interfaces/transaction.interface';

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
  response: {
    type: String,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    trim: true,
    default: '',
  },
  paymentIntentId: {
    type: String,
    trim: true,
    default: '',
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const TransactionModel = model<Transaction & Document>('Transaction', TransactionSchema);

export default TransactionModel;
