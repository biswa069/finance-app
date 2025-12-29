import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

const TransactionSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Uncategorized' },
  type: { type: String, enum: ['income', 'expense'], required: true }
});

// Compound Index for Dashboard Queries
TransactionSchema.index({ userId: 1, date: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);