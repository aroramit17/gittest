import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Trip } from '../types';
import { formatCurrency, formatDate, daysUntil } from '../utils/formatters';
import Modal from '../components/Modal';

const emptyTrip: Omit<Trip, 'id'> = {
  name: '',
  destination: '',
  startDate: '',
  endDate: '',
  estimatedCost: 0,
  savedAmount: 0,
  savingsPerPaycheck: 0,
  payFrequency: 'biweekly',
  notes: '',
};

export default function TripsPage() {
  const { data, addTrip, updateTrip, deleteTrip } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [form, setForm] = useState(emptyTrip);

  const totalNeeded = data.trips.reduce((s, t) => s + t.estimatedCost, 0);
  const totalSaved = data.trips.reduce((s, t) => s + t.savedAmount, 0);

  function openAdd() { setEditingTrip(null); setForm(emptyTrip); setIsModalOpen(true); }
  function openEdit(trip: Trip) { setEditingTrip(trip); setForm(trip); setIsModalOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingTrip) {
      updateTrip({ ...form, id: editingTrip.id } as Trip);
    } else {
      addTrip(form);
    }
    setIsModalOpen(false);
  }

  function getPaychecksRemaining(trip: Trip): number {
    if (!trip.startDate || trip.savingsPerPaycheck <= 0) return 0;
    const remaining = trip.estimatedCost - trip.savedAmount;
    if (remaining <= 0) return 0;
    return Math.ceil(remaining / trip.savingsPerPaycheck);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Upcoming Trips</h1>
          <p className="subtitle">Plan and save for your trips</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Trip</button>
      </div>

      {data.trips.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Total Budget</span>
            <span className="summary-value">{formatCurrency(totalNeeded)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Saved</span>
            <span className="summary-value success">{formatCurrency(totalSaved)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Still Needed</span>
            <span className="summary-value danger">{formatCurrency(Math.max(0, totalNeeded - totalSaved))}</span>
          </div>
        </div>
      )}

      {data.trips.length === 0 ? (
        <div className="empty-state"><p>No trips planned yet.</p></div>
      ) : (
        <div className="card-grid">
          {data.trips.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map(trip => {
            const remaining = Math.max(0, trip.estimatedCost - trip.savedAmount);
            const progress = trip.estimatedCost > 0 ? (trip.savedAmount / trip.estimatedCost) * 100 : 0;
            const daysLeft = trip.startDate ? daysUntil(trip.startDate) : 0;
            const paychecksLeft = getPaychecksRemaining(trip);
            const freqLabel = trip.payFrequency === 'weekly' ? 'week' : trip.payFrequency === 'biweekly' ? '2 weeks' : 'month';

            return (
              <div key={trip.id} className="finance-card trip-card">
                <div className="card-top-row">
                  <h3>{trip.name}</h3>
                  <span className={`badge ${daysLeft <= 30 ? 'badge-warning' : ''}`}>
                    {daysLeft > 0 ? `${daysLeft} days away` : 'Past'}
                  </span>
                </div>
                <p className="trip-destination">{trip.destination}</p>
                <p className="trip-dates">
                  {trip.startDate && formatDate(trip.startDate)} - {trip.endDate && formatDate(trip.endDate)}
                </p>
                <div className="card-details-grid">
                  <div className="detail">
                    <span className="detail-label">Estimated Cost</span>
                    <span className="detail-value">{formatCurrency(trip.estimatedCost)}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Saved</span>
                    <span className="detail-value success">{formatCurrency(trip.savedAmount)}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Still Needed</span>
                    <span className="detail-value danger">{formatCurrency(remaining)}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Per Paycheck</span>
                    <span className="detail-value">{formatCurrency(trip.savingsPerPaycheck)}/{freqLabel}</span>
                  </div>
                </div>
                {paychecksLeft > 0 && (
                  <p className="paychecks-note">{paychecksLeft} paycheck{paychecksLeft > 1 ? 's' : ''} to reach your goal</p>
                )}
                <div className="progress-section">
                  <div className="progress-label">
                    <span>Savings Progress</span>
                    <span>{Math.min(100, progress).toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill success-bg" style={{ width: `${Math.min(100, progress)}%` }} />
                  </div>
                </div>
                {trip.notes && <p className="trip-notes">{trip.notes}</p>}
                <div className="card-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(trip)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteTrip(trip.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTrip ? 'Edit Trip' : 'Add Trip'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Trip Name<input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Destination<input type="text" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required /></label>
          </div>
          <div className="form-row">
            <label>Start Date<input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required /></label>
            <label>End Date<input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required /></label>
          </div>
          <div className="form-row">
            <label>Estimated Cost<input type="number" min="0" step="0.01" value={form.estimatedCost || ''} onChange={e => setForm({ ...form, estimatedCost: parseFloat(e.target.value) || 0 })} required /></label>
            <label>Amount Saved So Far<input type="number" min="0" step="0.01" value={form.savedAmount || ''} onChange={e => setForm({ ...form, savedAmount: parseFloat(e.target.value) || 0 })} /></label>
          </div>
          <div className="form-row">
            <label>Savings Per Paycheck<input type="number" min="0" step="0.01" value={form.savingsPerPaycheck || ''} onChange={e => setForm({ ...form, savingsPerPaycheck: parseFloat(e.target.value) || 0 })} /></label>
            <label>Pay Frequency
              <select value={form.payFrequency} onChange={e => setForm({ ...form, payFrequency: e.target.value as Trip['payFrequency'] })}>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
          <label>Notes<textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} /></label>
          <button type="submit" className="btn btn-primary btn-full">{editingTrip ? 'Update' : 'Add'} Trip</button>
        </form>
      </Modal>
    </div>
  );
}
