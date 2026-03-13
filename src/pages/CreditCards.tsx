import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { CreditCard } from '../types';
import { formatCurrency, formatPercent, getOrdinalDay, daysUntilDueDate } from '../utils/formatters';
import Modal from '../components/Modal';

const CARD_COLORS = ['#1a73e8', '#e8710a', '#0d904f', '#c5221f', '#9334e6', '#185abc', '#e37400', '#137333'];

const emptyCard: Omit<CreditCard, 'id'> = {
  name: '',
  lastFourDigits: '',
  creditLimit: 0,
  currentBalance: 0,
  dueDate: 1,
  minimumPayment: 0,
  isMinimumPaymentSet: false,
  isAutoPay: false,
  apr: 0,
  color: CARD_COLORS[0],
};

export default function CreditCards() {
  const { data, addCreditCard, updateCreditCard, deleteCreditCard } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [form, setForm] = useState(emptyCard);

  const totalDebt = data.creditCards.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalLimit = data.creditCards.reduce((sum, c) => sum + c.creditLimit, 0);

  function openAdd() {
    setEditingCard(null);
    setForm({ ...emptyCard, color: CARD_COLORS[data.creditCards.length % CARD_COLORS.length] });
    setIsModalOpen(true);
  }

  function openEdit(card: CreditCard) {
    setEditingCard(card);
    setForm(card);
    setIsModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingCard) {
      updateCreditCard({ ...form, id: editingCard.id } as CreditCard);
    } else {
      addCreditCard(form);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this credit card?')) {
      deleteCreditCard(id);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Credit Cards</h1>
          <p className="subtitle">Track balances, limits, and payment due dates</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Card</button>
      </div>

      {data.creditCards.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Total Debt</span>
            <span className="summary-value danger">{formatCurrency(totalDebt)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Credit Limit</span>
            <span className="summary-value">{formatCurrency(totalLimit)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Utilization</span>
            <span className={`summary-value ${totalLimit > 0 && (totalDebt / totalLimit) > 0.3 ? 'danger' : 'success'}`}>
              {totalLimit > 0 ? formatPercent((totalDebt / totalLimit) * 100) : '0%'}
            </span>
          </div>
        </div>
      )}

      {data.creditCards.length === 0 ? (
        <div className="empty-state">
          <p>No credit cards added yet. Click "Add Card" to get started.</p>
        </div>
      ) : (
        <div className="card-grid">
          {data.creditCards.map(card => {
            const utilization = card.creditLimit > 0 ? (card.currentBalance / card.creditLimit) * 100 : 0;
            const dueDays = daysUntilDueDate(card.dueDate);
            return (
              <div key={card.id} className="finance-card credit-card-item" style={{ borderTopColor: card.color }}>
                <div className="card-top-row">
                  <h3>{card.name}</h3>
                  <span className="card-digits">**** {card.lastFourDigits}</span>
                </div>
                <div className="card-balance">
                  <span className="balance-label">Current Balance</span>
                  <span className="balance-amount">{formatCurrency(card.currentBalance)}</span>
                </div>
                <div className="card-details-grid">
                  <div className="detail">
                    <span className="detail-label">Credit Limit</span>
                    <span className="detail-value">{formatCurrency(card.creditLimit)}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Utilization</span>
                    <span className={`detail-value ${utilization > 30 ? 'danger' : 'success'}`}>
                      {formatPercent(utilization)}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">APR</span>
                    <span className="detail-value">{formatPercent(card.apr)}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Due Date</span>
                    <span className={`detail-value ${dueDays <= 5 ? 'danger' : ''}`}>
                      {getOrdinalDay(card.dueDate)} ({dueDays}d)
                    </span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Min Payment</span>
                    <span className="detail-value">
                      {card.isMinimumPaymentSet ? formatCurrency(card.minimumPayment) : 'Not Set'}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Auto Pay</span>
                    <span className={`detail-value ${card.isAutoPay ? 'success' : 'warning'}`}>
                      {card.isAutoPay ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <div className="utilization-bar">
                  <div className="utilization-fill" style={{ width: `${Math.min(utilization, 100)}%`, backgroundColor: utilization > 30 ? '#c5221f' : '#0d904f' }} />
                </div>
                <div className="card-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(card)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(card.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCard ? 'Edit Credit Card' : 'Add Credit Card'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Card Name<input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Last 4 Digits<input type="text" maxLength={4} value={form.lastFourDigits} onChange={e => setForm({ ...form, lastFourDigits: e.target.value.replace(/\D/g, '') })} required /></label>
          </div>
          <div className="form-row">
            <label>Credit Limit<input type="number" min="0" step="0.01" value={form.creditLimit || ''} onChange={e => setForm({ ...form, creditLimit: parseFloat(e.target.value) || 0 })} required /></label>
            <label>Current Balance<input type="number" min="0" step="0.01" value={form.currentBalance || ''} onChange={e => setForm({ ...form, currentBalance: parseFloat(e.target.value) || 0 })} required /></label>
          </div>
          <div className="form-row">
            <label>APR (%)<input type="number" min="0" step="0.01" value={form.apr || ''} onChange={e => setForm({ ...form, apr: parseFloat(e.target.value) || 0 })} /></label>
            <label>Due Date (Day of Month)<input type="number" min="1" max="31" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: parseInt(e.target.value) || 1 })} required /></label>
          </div>
          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isMinimumPaymentSet} onChange={e => setForm({ ...form, isMinimumPaymentSet: e.target.checked })} />
              Minimum Payment Set
            </label>
            {form.isMinimumPaymentSet && (
              <label>Minimum Payment<input type="number" min="0" step="0.01" value={form.minimumPayment || ''} onChange={e => setForm({ ...form, minimumPayment: parseFloat(e.target.value) || 0 })} /></label>
            )}
          </div>
          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isAutoPay} onChange={e => setForm({ ...form, isAutoPay: e.target.checked })} />
              Auto Pay Enabled
            </label>
          </div>
          <div className="form-row">
            <label>Card Color
              <div className="color-picker">
                {CARD_COLORS.map(c => (
                  <button key={c} type="button" className={`color-swatch ${form.color === c ? 'selected' : ''}`} style={{ backgroundColor: c }} onClick={() => setForm({ ...form, color: c })} />
                ))}
              </div>
            </label>
          </div>
          <button type="submit" className="btn btn-primary btn-full">{editingCard ? 'Update Card' : 'Add Card'}</button>
        </form>
      </Modal>
    </div>
  );
}
