
export enum Language {
  PERSIAN = 'fa',
  GERMAN = 'de'
}

export enum DebtStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  PAID = 'Paid'
}

export enum DebtCategory {
  CATEGORY_A = 'Category A',
  CATEGORY_B = 'Category B',
  CATEGORY_C = 'Category C',
  CATEGORY_D = 'Category D'
}

export enum PaymentType {
  REGULAR = 'Regular',
  EXTRA = 'Extra',
  FINAL = 'Final'
}

export interface Debt {
  id: string;
  creditor: string;
  originalAmount: number;
  remainingBalance: number;
  monthlyInstallment: number;
  category: DebtCategory;
  status: DebtStatus;
}

export interface FixedExpense {
  id: string;
  name: string;
  nameFa: string;
  nameDe: string;
  amount: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: 'Fixed';
}

export interface PaymentRecord {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  type: PaymentType;
}

export interface UserProfile {
  mainSalary: number;
  miniJob: number;
}
