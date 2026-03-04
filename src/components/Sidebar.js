'use client';

import { useEnhance } from '@/context/EnhanceContext';
import { CATEGORIES, countByCategory } from '@/lib/effects';

const ICONS = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  type: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  ),
  pointer: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="10" rx="3" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  layers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="3" /><line x1="3" y1="9" x2="21" y2="9" />
    </svg>
  ),
  image: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  layout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
  play: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
};

export default function Sidebar({ open, onClose, tier }) {
  const { activeCategory, setCategory } = useEnhance();
  const counts = countByCategory();

  function handleCategoryClick(catId) {
    setCategory(catId);
    if (onClose) onClose();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:sticky top-14 left-0 bottom-0 w-60 z-40
        flex flex-col justify-between
        bg-ze-surface border-r border-white/[0.06]
        overflow-y-auto
        transition-transform duration-200
        md:translate-x-0
        ${open ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
      `} style={{ height: 'calc(100vh - 3.5rem)' }}>
        <nav className="flex flex-col gap-0.5 p-2 pt-4">
          <span className="px-3 pb-2 text-[11px] font-semibold tracking-widest uppercase text-slate-600">
            Categories
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-lg transition-all text-left w-full ${
                activeCategory === cat.id
                  ? 'bg-purple-500/10 text-purple-300'
                  : 'text-slate-400 hover:bg-ze-hover hover:text-slate-200'
              }`}
            >
              <span className={`shrink-0 ${activeCategory === cat.id ? 'opacity-100' : 'opacity-50'}`}>
                {ICONS[cat.icon]}
              </span>
              {cat.label}
              <span className="ml-auto text-[11px] font-semibold text-slate-600">
                {counts[cat.id] || 0}
              </span>
            </button>
          ))}
        </nav>

        {/* Upgrade CTA — only for free tier */}
        {tier !== 'pro' && (
          <div className="p-3">
            <div className="p-4 rounded-xl text-center bg-gradient-to-br from-purple-500/[0.08] to-blue-500/[0.06] border border-purple-500/[0.15]">
              <span className="text-xl block mb-1">&#9889;</span>
              <strong className="block text-sm text-slate-100 mb-1">Go Premium</strong>
              <p className="text-[12px] text-slate-500 leading-relaxed mb-3">
                Unlock all 25+ effects, unlimited usage, and priority support.
              </p>
              <button className="w-full py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-lg hover:opacity-90 transition">
                Upgrade — $29/mo
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
