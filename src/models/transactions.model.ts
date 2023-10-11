import { model, Schema, Document } from 'mongoose';
import { Transaction } from '@interfaces/transaction.interface';

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
  response: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  cardname: {
    type: String,
    trim: true,
  },
});

const TransactionModel = model<Transaction & Document>('Transaction', TransactionSchema);

export default TransactionModel;
