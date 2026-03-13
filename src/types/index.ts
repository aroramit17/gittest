export interface CreditCard {
  id: string;
  name: string;
  lastFourDigits: string;
  creditLimit: number;
  currentBalance: number;
  dueDate: number; // day of month (1-31)
  minimumPayment: number;
  isMinimumPaymentSet: boolean;
  isAutoPay: boolean;
  apr: number;
  color: string;
}

export interface MonthlyBill {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: number; // day of month
  isPaid: boolean;
  isAutoPay: boolean;
  notes: string;
}

export interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string; // ISO date
  isActive: boolean;
}

export interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'mutual_fund' | 'etf' | '401k' | 'ira' | 'crypto' | 'real_estate' | 'other';
  currentValue: number;
  costBasis: number;
  institution: string;
}

export interface SavingsAccount {
  id: string;
  name: string;
  institution: string;
  balance: number;
  apy: number;
  type: 'checking' | 'savings' | 'money_market' | 'cd' | 'other';
}

export interface Loan {
  id: string;
  name: string;
  type: 'mortgage' | 'auto' | 'student' | 'personal' | 'other';
  originalAmount: number;
  outstandingBalance: number;
  interestRate: number;
  monthlyPayment: number;
  payoffDate: string; // ISO date
  lender: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  estimatedCost: number;
  savedAmount: number;
  savingsPerPaycheck: number;
  payFrequency: 'weekly' | 'biweekly' | 'monthly';
  notes: string;
}

export interface FinanceData {
  creditCards: CreditCard[];
  monthlyBills: MonthlyBill[];
  subscriptions: Subscription[];
  investments: Investment[];
  savingsAccounts: SavingsAccount[];
  loans: Loan[];
  trips: Trip[];
}
