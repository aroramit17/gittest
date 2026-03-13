import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreditCards from './pages/CreditCards';
import MonthlyBills from './pages/MonthlyBills';
import Subscriptions from './pages/Subscriptions';
import Investments from './pages/Investments';
import SavingsPage from './pages/Savings';
import LoansPage from './pages/Loans';
import TripsPage from './pages/Trips';

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/credit-cards" element={<CreditCards />} />
            <Route path="/bills" element={<MonthlyBills />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/trips" element={<TripsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}
