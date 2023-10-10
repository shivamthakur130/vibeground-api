import { model, Schema, Document } from 'mongoose';
import { Transaction } from '@interfaces/transaction.interface';

const TransactionSchema: Schema = new Schema({
  userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planid: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  response: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['init', 'error', 'success'],
    default: 'init',
  },
});

const TransactionModel = model<Transaction & Document>('Transaction', TransactionSchema);

export default TransactionModel;
