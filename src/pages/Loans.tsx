import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Loan } from '../types';
import { formatCurrency, formatPercent, formatDate, daysUntil } from '../utils/formatters';
import Modal from '../components/Modal';

const TYPES: { value: Loan['type']; label: string }[] = [
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'auto', label: 'Auto' },
  { value: 'student', label: 'Student' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' },
];

const emptyLoan: Omit<Loan, 'id'> = {
  name: '',
  type: 'personal',
  originalAmount: 0,
  outstandingBalance: 0,
  interestRate: 0,
  monthlyPayment: 0,
  payoffDate: '',
  lender: '',
};

export default function LoansPage() {
  const { data, addLoan, updateLoan, deleteLoan } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [form, setForm] = useState(emptyLoan);

  const totalOutstanding = data.loans.reduce((s, l) => s + l.outstandingBalance, 0);
  const totalMonthlyPayments = data.loans.reduce((s, l) => s + l.monthlyPayment, 0);

  function openAdd() { setEditingLoan(null); setForm(emptyLoan); setIsModalOpen(true); }
  function openEdit(loan: Loan) { setEditingLoan(loan); setForm(loan); setIsModalOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingLoan) {
      updateLoan({ ...form, id: editingLoan.id } as Loan);
    } else {
      addLoan(form);
    }
    setIsModalOpen(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Loans</h1>
          <p className="subtitle">Track outstanding loans and payoff dates</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Loan</button>
      </div>

      {data.loans.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Total Outstanding</span>
            <span className="summary-value danger">{formatCurrency(totalOutstanding)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Monthly Payments</span>
            <span className="summary-value">{formatCurrency(totalMonthlyPayments)}</span>
          </div>
        </div>
      )}

      {data.loans.length === 0 ? (
        <div className="empty-state"><p>No loans added yet.</p></div>
      ) : (
        <div className="card-grid">
          {data.loans.map(loan => {
            const paidOff = loan.originalAmount > 0 ? ((loan.originalAmount - loan.outstandingBalance) / loan.originalAmount) * 100 : 0;
            const daysLeft = loan.payoffDate ? daysUntil(loan.payoffDate) : 0;
            return (
              <div key={loan.id} className="finance-card">
                <div className="card-top-row">
                  <h3>{loan.name}</h3>
                  <span className="badge">{TYPES.find(t => t.value === loan.type)?.label}</span>
                </div>
                <div className="card-balance">
                  <span className="balance-label">{loan.lender}</span>
                  <span className="balance-amount danger">{formatCurrency(loan.outstandingBalance)}</span>
                </div>
                <div className="card-details-grid">
                  <div className="detail">
                    <span className="detail-label">Original Amount</span>
                    <span className="detail-value">{formatCurrency(loan.originalAmount)}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Interest Rate</span>
                    <span className="detail-value">{formatPercent(loan.interestRate)}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Monthly Payment</span>
                    <span className="detail-value">{formatCurrency(loan.monthlyPayment)}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Payoff Date</span>
                    <span className="detail-value">
                      {loan.payoffDate ? `${formatDate(loan.payoffDate)} (${Math.max(0, Math.ceil(daysLeft / 30))} mo)` : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="progress-section">
                  <div className="progress-label">
                    <span>Paid Off</span>
                    <span>{paidOff.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${paidOff}%` }} />
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(loan)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteLoan(loan.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLoan ? 'Edit Loan' : 'Add Loan'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Loan Name<input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Type
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Loan['type'] })}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>Original Amount<input type="number" min="0" step="0.01" value={form.originalAmount || ''} onChange={e => setForm({ ...form, originalAmount: parseFloat(e.target.value) || 0 })} required /></label>
            <label>Outstanding Balance<input type="number" min="0" step="0.01" value={form.outstandingBalance || ''} onChange={e => setForm({ ...form, outstandingBalance: parseFloat(e.target.value) || 0 })} required /></label>
          </div>
          <div className="form-row">
            <label>Interest Rate (%)<input type="number" min="0" step="0.01" value={form.interestRate || ''} onChange={e => setForm({ ...form, interestRate: parseFloat(e.target.value) || 0 })} /></label>
            <label>Monthly Payment<input type="number" min="0" step="0.01" value={form.monthlyPayment || ''} onChange={e => setForm({ ...form, monthlyPayment: parseFloat(e.target.value) || 0 })} /></label>
          </div>
          <div className="form-row">
            <label>Payoff Date<input type="date" value={form.payoffDate} onChange={e => setForm({ ...form, payoffDate: e.target.value })} /></label>
            <label>Lender<input type="text" value={form.lender} onChange={e => setForm({ ...form, lender: e.target.value })} /></label>
          </div>
          <button type="submit" className="btn btn-primary btn-full">{editingLoan ? 'Update' : 'Add'} Loan</button>
        </form>
      </Modal>
    </div>
  );
}
