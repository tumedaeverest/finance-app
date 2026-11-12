// packages/shared/src/types.ts
/** Shared TypeScript models mirroring Supabase tables */
export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: "bank" | "cash" | "credit" | "investment";
  balance: number;
  currency: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  category_id?: string;
  amount: number;
  description?: string;
  transaction_date: string; // ISO date (YYYY-MM-DD)
  type: "income" | "expense";
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // e.g., "2024-09"
  limit_amount: number;
  created_at: string;
}
