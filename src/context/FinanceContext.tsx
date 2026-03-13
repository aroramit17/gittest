import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { FinanceData, CreditCard, MonthlyBill, Subscription, Investment, SavingsAccount, Loan, Trip } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'finance-app-data';

const defaultData: FinanceData = {
  creditCards: [],
  monthlyBills: [],
  subscriptions: [],
  investments: [],
  savingsAccounts: [],
  loans: [],
  trips: [],
};

function loadData(): FinanceData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultData;
}

interface FinanceContextType {
  data: FinanceData;
  // Credit Cards
  addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (card: CreditCard) => void;
  deleteCreditCard: (id: string) => void;
  // Monthly Bills
  addMonthlyBill: (bill: Omit<MonthlyBill, 'id'>) => void;
  updateMonthlyBill: (bill: MonthlyBill) => void;
  deleteMonthlyBill: (id: string) => void;
  // Subscriptions
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (sub: Subscription) => void;
  deleteSubscription: (id: string) => void;
  // Investments
  addInvestment: (inv: Omit<Investment, 'id'>) => void;
  updateInvestment: (inv: Investment) => void;
  deleteInvestment: (id: string) => void;
  // Savings
  addSavingsAccount: (acc: Omit<SavingsAccount, 'id'>) => void;
  updateSavingsAccount: (acc: SavingsAccount) => void;
  deleteSavingsAccount: (id: string) => void;
  // Loans
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  updateLoan: (loan: Loan) => void;
  deleteLoan: (id: string) => void;
  // Trips
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FinanceData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function makeAddFn(key: keyof FinanceData) {
    return (item: any) => {
      setData(prev => ({
        ...prev,
        [key]: [...(prev[key] as any[]), { ...item, id: uuidv4() }],
      }));
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function makeUpdateFn(key: keyof FinanceData) {
    return (item: any) => {
      setData(prev => ({
        ...prev,
        [key]: (prev[key] as any[]).map((i: any) => (i.id === item.id ? item : i)),
      }));
    };
  }

  function makeDeleteFn(key: keyof FinanceData) {
    return (id: string) => {
      setData(prev => ({
        ...prev,
        [key]: (prev[key] as any[]).filter((i: any) => i.id !== id),
      }));
    };
  }

  const value: FinanceContextType = {
    data,
    addCreditCard: makeAddFn('creditCards'),
    updateCreditCard: makeUpdateFn('creditCards'),
    deleteCreditCard: makeDeleteFn('creditCards'),
    addMonthlyBill: makeAddFn('monthlyBills'),
    updateMonthlyBill: makeUpdateFn('monthlyBills'),
    deleteMonthlyBill: makeDeleteFn('monthlyBills'),
    addSubscription: makeAddFn('subscriptions'),
    updateSubscription: makeUpdateFn('subscriptions'),
    deleteSubscription: makeDeleteFn('subscriptions'),
    addInvestment: makeAddFn('investments'),
    updateInvestment: makeUpdateFn('investments'),
    deleteInvestment: makeDeleteFn('investments'),
    addSavingsAccount: makeAddFn('savingsAccounts'),
    updateSavingsAccount: makeUpdateFn('savingsAccounts'),
    deleteSavingsAccount: makeDeleteFn('savingsAccounts'),
    addLoan: makeAddFn('loans'),
    updateLoan: makeUpdateFn('loans'),
    deleteLoan: makeDeleteFn('loans'),
    addTrip: makeAddFn('trips'),
    updateTrip: makeUpdateFn('trips'),
    deleteTrip: makeDeleteFn('trips'),
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
