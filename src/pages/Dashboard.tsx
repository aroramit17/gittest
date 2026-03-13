import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatPercent, getOrdinalDay, daysUntilDueDate, daysUntil, formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data } = useFinance();

  const totalCreditDebt = data.creditCards.reduce((s, c) => s + c.currentBalance, 0);
  const totalCreditLimit = data.creditCards.reduce((s, c) => s + c.creditLimit, 0);
  const totalMonthlyBills = data.monthlyBills.reduce((s, b) => s + b.amount, 0);
  const unpaidBills = data.monthlyBills.filter(b => !b.isPaid);
  const activeSubs = data.subscriptions.filter(s => s.isActive);
  const monthlySubCost = activeSubs.reduce((s, sub) => s + (sub.billingCycle === 'yearly' ? sub.amount / 12 : sub.amount), 0);
  const totalInvestments = data.investments.reduce((s, i) => s + i.currentValue, 0);
  const totalSavings = data.savingsAccounts.reduce((s, a) => s + a.balance, 0);
  const totalLoanDebt = data.loans.reduce((s, l) => s + l.outstandingBalance, 0);
  const totalLoanPayments = data.loans.reduce((s, l) => s + l.monthlyPayment, 0);

  const netWorth = totalSavings + totalInvestments - totalCreditDebt - totalLoanDebt;
  const totalMonthlyOutflow = totalMonthlyBills + monthlySubCost + totalLoanPayments;

  // Upcoming due dates for credit cards (next 7 days)
  const upcomingCards = data.creditCards
    .filter(c => daysUntilDueDate(c.dueDate) <= 7)
    .sort((a, b) => daysUntilDueDate(a.dueDate) - daysUntilDueDate(b.dueDate));

  // Upcoming trips
  const upcomingTrips = data.trips
    .filter(t => t.startDate && daysUntil(t.startDate) > 0)
    .sort((a, b) => daysUntil(a.startDate) - daysUntil(b.startDate))
    .slice(0, 3);

  const isEmpty = data.creditCards.length === 0 && data.monthlyBills.length === 0 && data.subscriptions.length === 0 &&
    data.investments.length === 0 && data.savingsAccounts.length === 0 && data.loans.length === 0 && data.trips.length === 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Your financial overview at a glance</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="empty-state">
          <h2>Welcome to FinanceTracker!</h2>
          <p>Get started by adding your financial information:</p>
          <div className="quick-links">
            <Link to="/credit-cards" className="btn btn-primary">Add Credit Cards</Link>
            <Link to="/bills" className="btn btn-secondary">Add Monthly Bills</Link>
            <Link to="/subscriptions" className="btn btn-secondary">Add Subscriptions</Link>
            <Link to="/savings" className="btn btn-secondary">Add Savings</Link>
            <Link to="/investments" className="btn btn-secondary">Add Investments</Link>
            <Link to="/loans" className="btn btn-secondary">Add Loans</Link>
            <Link to="/trips" className="btn btn-secondary">Plan a Trip</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Net Worth */}
          <div className="dashboard-net-worth">
            <span className="net-worth-label">Estimated Net Worth</span>
            <span className={`net-worth-value ${netWorth >= 0 ? 'success' : 'danger'}`}>
              {formatCurrency(netWorth)}
            </span>
          </div>

          {/* Summary Grid */}
          <div className="dashboard-grid">
            {data.creditCards.length > 0 && (
              <Link to="/credit-cards" className="dashboard-card">
                <h3>Credit Cards</h3>
                <div className="dash-stat">
                  <span className="dash-stat-value danger">{formatCurrency(totalCreditDebt)}</span>
                  <span className="dash-stat-label">Total Debt</span>
                </div>
                <div className="dash-stat-row">
                  <span>Utilization: <strong className={totalCreditLimit > 0 && (totalCreditDebt / totalCreditLimit) > 0.3 ? 'danger' : 'success'}>
                    {totalCreditLimit > 0 ? formatPercent((totalCreditDebt / totalCreditLimit) * 100) : '0%'}
                  </strong></span>
                  <span>{data.creditCards.length} card{data.creditCards.length > 1 ? 's' : ''}</span>
                </div>
              </Link>
            )}

            {data.monthlyBills.length > 0 && (
              <Link to="/bills" className="dashboard-card">
                <h3>Monthly Bills</h3>
                <div className="dash-stat">
                  <span className="dash-stat-value">{formatCurrency(totalMonthlyBills)}</span>
                  <span className="dash-stat-label">Total Monthly</span>
                </div>
                <div className="dash-stat-row">
                  <span>{unpaidBills.length} unpaid</span>
                  <span>Remaining: <strong className="danger">{formatCurrency(unpaidBills.reduce((s, b) => s + b.amount, 0))}</strong></span>
                </div>
              </Link>
            )}

            {data.subscriptions.length > 0 && (
              <Link to="/subscriptions" className="dashboard-card">
                <h3>Subscriptions</h3>
                <div className="dash-stat">
                  <span className="dash-stat-value">{formatCurrency(monthlySubCost)}</span>
                  <span className="dash-stat-label">Monthly Cost</span>
                </div>
                <div className="dash-stat-row">
                  <span>{activeSubs.length} active</span>
                  <span>Yearly: {formatCurrency(monthlySubCost * 12)}</span>
                </div>
              </Link>
            )}

            {data.investments.length > 0 && (
              <Link to="/investments" className="dashboard-card">
                <h3>Investments</h3>
                <div className="dash-stat">
                  <span className="dash-stat-value success">{formatCurrency(totalInvestments)}</span>
                  <span className="dash-stat-label">Total Value</span>
                </div>
                <div className="dash-stat-row">
                  <span>{data.investments.length} holding{data.investments.length > 1 ? 's' : ''}</span>
                </div>
              </Link>
            )}

            {data.savingsAccounts.length > 0 && (
              <Link to="/savings" className="dashboard-card">
                <h3>Savings</h3>
                <div className="dash-stat">
                  <span className="dash-stat-value success">{formatCurrency(totalSavings)}</span>
                  <span className="dash-stat-label">Total Balance</span>
                </div>
                <div className="dash-stat-row">
                  <span>{data.savingsAccounts.length} account{data.savingsAccounts.length > 1 ? 's' : ''}</span>
                </div>
              </Link>
            )}

            {data.loans.length > 0 && (
              <Link to="/loans" className="dashboard-card">
                <h3>Loans</h3>
                <div className="dash-stat">
                  <span className="dash-stat-value danger">{formatCurrency(totalLoanDebt)}</span>
                  <span className="dash-stat-label">Outstanding</span>
                </div>
                <div className="dash-stat-row">
                  <span>Monthly: {formatCurrency(totalLoanPayments)}</span>
                  <span>{data.loans.length} loan{data.loans.length > 1 ? 's' : ''}</span>
                </div>
              </Link>
            )}
          </div>

          {/* Monthly Outflow Summary */}
          <div className="dashboard-section">
            <h2>Monthly Outflow</h2>
            <div className="outflow-total">{formatCurrency(totalMonthlyOutflow)}</div>
            <div className="outflow-breakdown">
              {totalMonthlyBills > 0 && <div className="outflow-item"><span>Bills</span><span>{formatCurrency(totalMonthlyBills)}</span></div>}
              {monthlySubCost > 0 && <div className="outflow-item"><span>Subscriptions</span><span>{formatCurrency(monthlySubCost)}</span></div>}
              {totalLoanPayments > 0 && <div className="outflow-item"><span>Loan Payments</span><span>{formatCurrency(totalLoanPayments)}</span></div>}
            </div>
          </div>

          {/* Alerts */}
          {upcomingCards.length > 0 && (
            <div className="dashboard-section">
              <h2>Upcoming Credit Card Due Dates</h2>
              {upcomingCards.map(card => (
                <div key={card.id} className="alert-item">
                  <span><strong>{card.name}</strong> (*{card.lastFourDigits})</span>
                  <span>Due: {getOrdinalDay(card.dueDate)} ({daysUntilDueDate(card.dueDate)} days)</span>
                  <span className="danger">{formatCurrency(card.currentBalance)}</span>
                  <span>{card.isAutoPay ? 'Auto Pay' : 'Manual'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Trips */}
          {upcomingTrips.length > 0 && (
            <div className="dashboard-section">
              <h2>Upcoming Trips</h2>
              {upcomingTrips.map(trip => (
                <div key={trip.id} className="alert-item">
                  <span><strong>{trip.name}</strong> - {trip.destination}</span>
                  <span>{formatDate(trip.startDate)} ({daysUntil(trip.startDate)} days)</span>
                  <span>Saved: {formatCurrency(trip.savedAmount)} / {formatCurrency(trip.estimatedCost)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
