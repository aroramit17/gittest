import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Subscription } from '../types';
import { formatCurrency, formatDate, daysUntil } from '../utils/formatters';
import Modal from '../components/Modal';

const CATEGORIES = ['Streaming', 'AI Tools', 'Software', 'Music', 'Gaming', 'News', 'Fitness', 'Cloud Storage', 'Other'];

const emptySubscription: Omit<Subscription, 'id'> = {
  name: '',
  category: CATEGORIES[0],
  amount: 0,
  billingCycle: 'monthly',
  nextBillingDate: new Date().toISOString().split('T')[0],
  isActive: true,
};

export default function Subscriptions() {
  const { data, addSubscription, updateSubscription, deleteSubscription } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [form, setForm] = useState(emptySubscription);

  const activeSubs = data.subscriptions.filter(s => s.isActive);
  const monthlyTotal = activeSubs.reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
  const yearlyTotal = monthlyTotal * 12;

  function openAdd() { setEditingSub(null); setForm(emptySubscription); setIsModalOpen(true); }
  function openEdit(sub: Subscription) { setEditingSub(sub); setForm(sub); setIsModalOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingSub) {
      updateSubscription({ ...form, id: editingSub.id } as Subscription);
    } else {
      addSubscription(form);
    }
    setIsModalOpen(false);
  }

  function toggleActive(sub: Subscription) {
    updateSubscription({ ...sub, isActive: !sub.isActive });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Subscriptions</h1>
          <p className="subtitle">Manage your recurring subscriptions</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Subscription</button>
      </div>

      {data.subscriptions.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Monthly Cost</span>
            <span className="summary-value">{formatCurrency(monthlyTotal)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Yearly Cost</span>
            <span className="summary-value">{formatCurrency(yearlyTotal)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Active</span>
            <span className="summary-value">{activeSubs.length} / {data.subscriptions.length}</span>
          </div>
        </div>
      )}

      {data.subscriptions.length === 0 ? (
        <div className="empty-state"><p>No subscriptions added yet.</p></div>
      ) : (
        <div className="card-grid">
          {data.subscriptions.map(sub => (
            <div key={sub.id} className={`finance-card ${!sub.isActive ? 'card-inactive' : ''}`}>
              <div className="card-top-row">
                <h3>{sub.name}</h3>
                <span className="badge">{sub.category}</span>
              </div>
              <div className="card-balance">
                <span className="balance-amount">{formatCurrency(sub.amount)}<span className="billing-cycle">/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span></span>
              </div>
              <div className="card-details-grid">
                <div className="detail">
                  <span className="detail-label">Next Billing</span>
                  <span className="detail-value">{formatDate(sub.nextBillingDate)}</span>
                </div>
                <div className="detail">
                  <span className="detail-label">Days Until</span>
                  <span className="detail-value">{daysUntil(sub.nextBillingDate)}d</span>
                </div>
              </div>
              <div className="card-actions">
                <button className={`btn btn-sm ${sub.isActive ? 'btn-warning' : 'btn-success'}`} onClick={() => toggleActive(sub)}>
                  {sub.isActive ? 'Pause' : 'Activate'}
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(sub)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteSubscription(sub.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSub ? 'Edit Subscription' : 'Add Subscription'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Name<input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Category
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>Amount<input type="number" min="0" step="0.01" value={form.amount || ''} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required /></label>
            <label>Billing Cycle
              <select value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value as 'monthly' | 'yearly' })}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
          </div>
          <label>Next Billing Date<input type="date" value={form.nextBillingDate} onChange={e => setForm({ ...form, nextBillingDate: e.target.value })} required /></label>
          <label className="checkbox-label"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          <button type="submit" className="btn btn-primary btn-full">{editingSub ? 'Update' : 'Add'} Subscription</button>
        </form>
      </Modal>
    </div>
  );
}
