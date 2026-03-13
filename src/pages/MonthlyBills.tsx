import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { MonthlyBill } from '../types';
import { formatCurrency, getOrdinalDay, daysUntilDueDate } from '../utils/formatters';
import Modal from '../components/Modal';

const CATEGORIES = ['Housing', 'Utilities', 'Insurance', 'Transportation', 'Groceries', 'Healthcare', 'Childcare', 'Home Services', 'Other'];

const emptyBill: Omit<MonthlyBill, 'id'> = {
  name: '',
  category: CATEGORIES[0],
  amount: 0,
  dueDate: 1,
  isPaid: false,
  isAutoPay: false,
  notes: '',
};

export default function MonthlyBills() {
  const { data, addMonthlyBill, updateMonthlyBill, deleteMonthlyBill } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<MonthlyBill | null>(null);
  const [form, setForm] = useState(emptyBill);

  const totalMonthly = data.monthlyBills.reduce((sum, b) => sum + b.amount, 0);
  const paidCount = data.monthlyBills.filter(b => b.isPaid).length;

  function openAdd() {
    setEditingBill(null);
    setForm(emptyBill);
    setIsModalOpen(true);
  }

  function openEdit(bill: MonthlyBill) {
    setEditingBill(bill);
    setForm(bill);
    setIsModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingBill) {
      updateMonthlyBill({ ...form, id: editingBill.id } as MonthlyBill);
    } else {
      addMonthlyBill(form);
    }
    setIsModalOpen(false);
  }

  function togglePaid(bill: MonthlyBill) {
    updateMonthlyBill({ ...bill, isPaid: !bill.isPaid });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Monthly Bills</h1>
          <p className="subtitle">Track recurring household expenses</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Bill</button>
      </div>

      {data.monthlyBills.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Total Monthly</span>
            <span className="summary-value">{formatCurrency(totalMonthly)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Bills Paid</span>
            <span className="summary-value">{paidCount} / {data.monthlyBills.length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Remaining</span>
            <span className="summary-value danger">
              {formatCurrency(data.monthlyBills.filter(b => !b.isPaid).reduce((s, b) => s + b.amount, 0))}
            </span>
          </div>
        </div>
      )}

      {data.monthlyBills.length === 0 ? (
        <div className="empty-state">
          <p>No monthly bills added yet. Click "Add Bill" to get started.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Paid</th>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Auto Pay</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyBills.sort((a, b) => a.dueDate - b.dueDate).map(bill => {
                const dueDays = daysUntilDueDate(bill.dueDate);
                return (
                  <tr key={bill.id} className={bill.isPaid ? 'row-paid' : ''}>
                    <td>
                      <input type="checkbox" checked={bill.isPaid} onChange={() => togglePaid(bill)} />
                    </td>
                    <td className="name-cell">{bill.name}</td>
                    <td><span className="badge">{bill.category}</span></td>
                    <td>{formatCurrency(bill.amount)}</td>
                    <td className={dueDays <= 5 && !bill.isPaid ? 'danger' : ''}>
                      {getOrdinalDay(bill.dueDate)} {!bill.isPaid && `(${dueDays}d)`}
                    </td>
                    <td><span className={bill.isAutoPay ? 'success' : 'warning'}>{bill.isAutoPay ? 'Yes' : 'No'}</span></td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(bill)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteMonthlyBill(bill.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBill ? 'Edit Bill' : 'Add Bill'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Bill Name<input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Category
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>Amount<input type="number" min="0" step="0.01" value={form.amount || ''} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required /></label>
            <label>Due Date (Day)<input type="number" min="1" max="31" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: parseInt(e.target.value) || 1 })} required /></label>
          </div>
          <div className="form-row">
            <label className="checkbox-label"><input type="checkbox" checked={form.isAutoPay} onChange={e => setForm({ ...form, isAutoPay: e.target.checked })} /> Auto Pay</label>
            <label className="checkbox-label"><input type="checkbox" checked={form.isPaid} onChange={e => setForm({ ...form, isPaid: e.target.checked })} /> Already Paid This Month</label>
          </div>
          <label>Notes<textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} /></label>
          <button type="submit" className="btn btn-primary btn-full">{editingBill ? 'Update Bill' : 'Add Bill'}</button>
        </form>
      </Modal>
    </div>
  );
}
