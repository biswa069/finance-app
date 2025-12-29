export interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface Insight {
  budget_suggestion: string;
  tip: string;
}