import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { SavingsAccount } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import Modal from '../components/Modal';

const TYPES: { value: SavingsAccount['type']; label: string }[] = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'money_market', label: 'Money Market' },
  { value: 'cd', label: 'CD' },
  { value: 'other', label: 'Other' },
];

const emptyAccount: Omit<SavingsAccount, 'id'> = {
  name: '',
  institution: '',
  balance: 0,
  apy: 0,
  type: 'savings',
};

export default function SavingsPage() {
  const { data, addSavingsAccount, updateSavingsAccount, deleteSavingsAccount } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState<SavingsAccount | null>(null);
  const [form, setForm] = useState(emptyAccount);

  const totalBalance = data.savingsAccounts.reduce((s, a) => s + a.balance, 0);

  function openAdd() { setEditingAcc(null); setForm(emptyAccount); setIsModalOpen(true); }
  function openEdit(acc: SavingsAccount) { setEditingAcc(acc); setForm(acc); setIsModalOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingAcc) {
      updateSavingsAccount({ ...form, id: editingAcc.id } as SavingsAccount);
    } else {
      addSavingsAccount(form);
    }
    setIsModalOpen(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Savings</h1>
          <p className="subtitle">Track your bank accounts and savings</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Account</button>
      </div>

      {data.savingsAccounts.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Total Balance</span>
            <span className="summary-value success">{formatCurrency(totalBalance)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Accounts</span>
            <span className="summary-value">{data.savingsAccounts.length}</span>
          </div>
        </div>
      )}

      {data.savingsAccounts.length === 0 ? (
        <div className="empty-state"><p>No savings accounts added yet.</p></div>
      ) : (
        <div className="card-grid">
          {data.savingsAccounts.map(acc => (
            <div key={acc.id} className="finance-card">
              <div className="card-top-row">
                <h3>{acc.name}</h3>
                <span className="badge">{TYPES.find(t => t.value === acc.type)?.label}</span>
              </div>
              <div className="card-balance">
                <span className="balance-label">{acc.institution}</span>
                <span className="balance-amount success">{formatCurrency(acc.balance)}</span>
              </div>
              <div className="card-details-grid">
                <div className="detail">
                  <span className="detail-label">APY</span>
                  <span className="detail-value">{formatPercent(acc.apy)}</span>
                </div>
                <div className="detail">
                  <span className="detail-label">Yearly Earnings</span>
                  <span className="detail-value success">{formatCurrency(acc.balance * acc.apy / 100)}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(acc)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteSavingsAccount(acc.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAcc ? 'Edit Account' : 'Add Account'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Account Name<input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Type
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as SavingsAccount['type'] })}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>Institution<input type="text" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} /></label>
            <label>Balance<input type="number" min="0" step="0.01" value={form.balance || ''} onChange={e => setForm({ ...form, balance: parseFloat(e.target.value) || 0 })} required /></label>
          </div>
          <label>APY (%)<input type="number" min="0" step="0.01" value={form.apy || ''} onChange={e => setForm({ ...form, apy: parseFloat(e.target.value) || 0 })} /></label>
          <button type="submit" className="btn btn-primary btn-full">{editingAcc ? 'Update' : 'Add'} Account</button>
        </form>
      </Modal>
    </div>
  );
}
