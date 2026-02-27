'use client';

import { useEnhance } from '@/context/EnhanceContext';
import { filterEffects, canAccess } from '@/lib/effects';
import EffectCard from './EffectCard';

const CATEGORY_LABELS = {
  all: 'All Effects',
  text: 'Text Effects',
  button: 'Button Effects',
  card: 'Card / Container Effects',
  image: 'Image Effects',
  section: 'Section / Background Effects',
  animation: 'Animation Effects',
};

const CATEGORY_DESCS = {
  all: 'Select an effect, paste your Zenler block code, and get the AI-enhanced version back.',
  text: 'Gradients, glows, typewriter, and reveal effects for headings and text.',
  button: 'Shimmer, glow, glass, and animated borders for CTA buttons.',
  card: 'Glassmorphism, neumorphism, tilt, and hover effects for containers.',
  image: 'Shadows, zoom, blur-reveal, and float effects for images.',
  section: 'Animated gradients, aurora, mesh, and noise textures for backgrounds.',
  animation: 'Entrance animations — fade, slide, bounce, scale, and rotate.',
};

export default function EffectsGrid({ tier }) {
  const { activeCategory, searchQuery, selectEffect } = useEnhance();
  const filtered = filterEffects(activeCategory, searchQuery);

  function handleSelect(effect) {
    if (!canAccess(effect, tier)) {
      // Could show upgrade prompt here
      return;
    }
    selectEffect(effect);
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="mb-7">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
          {CATEGORY_LABELS[activeCategory] || 'All Effects'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {CATEGORY_DESCS[activeCategory] || ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-sm">No effects match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((effect) => (
            <EffectCard
              key={effect.id}
              effect={effect}
              tier={tier}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </main>
  );
}
