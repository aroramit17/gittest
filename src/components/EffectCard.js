'use client';

import { canAccess } from '@/lib/effects';

export default function EffectCard({ effect, tier, onSelect }) {
  const locked = !canAccess(effect, tier);
  const tierClass = effect.tier === 'free'
    ? 'text-emerald-400 bg-emerald-400/10'
    : 'text-amber-400 bg-amber-400/10';

  return (
    <button
      onClick={() => onSelect(effect)}
      className="group text-left bg-ze-surface border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-purple-500/30 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(124,58,237,0.12)]"
    >
      {/* Preview area */}
      <div className="relative h-40 flex items-center justify-center bg-ze-body border-b border-white/[0.06] overflow-hidden p-5">
        {/* Inject scoped preview CSS + HTML */}
        <style dangerouslySetInnerHTML={{ __html: effect.previewCss }} />
        <div dangerouslySetInnerHTML={{ __html: effect.previewHtml }} />

        {/* Lock icon for pro effects */}
        {locked && (
          <div className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center bg-black/50 rounded-full backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="text-sm font-semibold text-slate-100 mb-1">{effect.name}</div>
        <div className="text-xs text-slate-500 leading-relaxed line-clamp-2">{effect.description}</div>
      </div>

      {/* Meta footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06]">
        <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wide">{effect.category}</span>
        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${tierClass}`}>
          {effect.tier === 'free' ? 'Free' : 'Pro'}
        </span>
      </div>
    </button>
  );
}
