import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Investment } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import Modal from '../components/Modal';

const TYPES: { value: Investment['type']; label: string }[] = [
  { value: 'stocks', label: 'Stocks' },
  { value: 'bonds', label: 'Bonds' },
  { value: 'mutual_fund', label: 'Mutual Fund' },
  { value: 'etf', label: 'ETF' },
  { value: '401k', label: '401(k)' },
  { value: 'ira', label: 'IRA' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
];

const emptyInvestment: Omit<Investment, 'id'> = {
  name: '',
  type: 'stocks',
  currentValue: 0,
  costBasis: 0,
  institution: '',
};

export default function Investments() {
  const { data, addInvestment, updateInvestment, deleteInvestment } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInv, setEditingInv] = useState<Investment | null>(null);
  const [form, setForm] = useState(emptyInvestment);

  const totalValue = data.investments.reduce((s, i) => s + i.currentValue, 0);
  const totalCost = data.investments.reduce((s, i) => s + i.costBasis, 0);
  const totalGain = totalValue - totalCost;

  function openAdd() { setEditingInv(null); setForm(emptyInvestment); setIsModalOpen(true); }
  function openEdit(inv: Investment) { setEditingInv(inv); setForm(inv); setIsModalOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingInv) {
      updateInvestment({ ...form, id: editingInv.id } as Investment);
    } else {
      addInvestment(form);
    }
    setIsModalOpen(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Investments</h1>
          <p className="subtitle">Track your investment portfolio</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Investment</button>
      </div>

      {data.investments.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Total Value</span>
            <span className="summary-value">{formatCurrency(totalValue)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Cost Basis</span>
            <span className="summary-value">{formatCurrency(totalCost)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Gain/Loss</span>
            <span className={`summary-value ${totalGain >= 0 ? 'success' : 'danger'}`}>
              {formatCurrency(totalGain)} ({totalCost > 0 ? formatPercent((totalGain / totalCost) * 100) : '0%'})
            </span>
          </div>
        </div>
      )}

      {data.investments.length === 0 ? (
        <div className="empty-state"><p>No investments added yet.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Institution</th>
                <th>Current Value</th>
                <th>Cost Basis</th>
                <th>Gain/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.investments.map(inv => {
                const gain = inv.currentValue - inv.costBasis;
                const gainPct = inv.costBasis > 0 ? (gain / inv.costBasis) * 100 : 0;
                return (
                  <tr key={inv.id}>
                    <td className="name-cell">{inv.name}</td>
                    <td><span className="badge">{TYPES.find(t => t.value === inv.type)?.label}</span></td>
                    <td>{inv.institution}</td>
                    <td>{formatCurrency(inv.currentValue)}</td>
                    <td>{formatCurrency(inv.costBasis)}</td>
                    <td className={gain >= 0 ? 'success' : 'danger'}>
                      {formatCurrency(gain)} ({formatPercent(gainPct)})
                    </td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(inv)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteInvestment(inv.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingInv ? 'Edit Investment' : 'Add Investment'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Name<input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Type
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Investment['type'] })}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>Current Value<input type="number" min="0" step="0.01" value={form.currentValue || ''} onChange={e => setForm({ ...form, currentValue: parseFloat(e.target.value) || 0 })} required /></label>
            <label>Cost Basis<input type="number" min="0" step="0.01" value={form.costBasis || ''} onChange={e => setForm({ ...form, costBasis: parseFloat(e.target.value) || 0 })} required /></label>
          </div>
          <label>Institution<input type="text" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} /></label>
          <button type="submit" className="btn btn-primary btn-full">{editingInv ? 'Update' : 'Add'} Investment</button>
        </form>
      </Modal>
    </div>
  );
}
