/**
 * ZenEnhance — Effect Catalog
 *
 * Each effect is a declarative descriptor. The actual HTML transformation is
 * handled server-side by GPT-4o via /api/enhance. These definitions drive:
 *   1. Dashboard card rendering (name, description, preview)
 *   2. The API route (effectId + effectName → system prompt context)
 *   3. Tier gating (free vs pro)
 */

export const CATEGORIES = [
  { id: 'all', label: 'All Effects', icon: 'grid' },
  { id: 'text', label: 'Text Effects', icon: 'type' },
  { id: 'button', label: 'Button Effects', icon: 'pointer' },
  { id: 'card', label: 'Card / Container', icon: 'layers' },
  { id: 'image', label: 'Image Effects', icon: 'image' },
  { id: 'section', label: 'Section / BG', icon: 'layout' },
  { id: 'animation', label: 'Animations', icon: 'play' },
];

export const effects = [
  // ───── TEXT ─────
  {
    id: 'gradient-text',
    name: 'Gradient Text',
    description: 'Apply a vibrant multi-color gradient fill to any heading or text element using background-clip.',
    category: 'text',
    tier: 'free',
    targets: 'Headings (h1-h6), paragraphs, spans',
    previewCss: `
      .prev-gradient-text {
        font-size: 26px; font-weight: 700;
        background: linear-gradient(135deg, #c4b5fd, #818cf8, #60a5fa);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
      }`,
    previewHtml: '<span class="prev-gradient-text">Gradient Text</span>',
  },
  {
    id: 'neon-glow-text',
    name: 'Neon Glow Text',
    description: 'Layered text-shadows in violet and blue tones create a vivid glowing neon effect.',
    category: 'text',
    tier: 'free',
    targets: 'Headings (h1-h6), spans',
    previewCss: `
      .prev-neon { font-size: 26px; font-weight: 700; color: #c4b5fd;
        text-shadow: 0 0 7px rgba(124,58,237,.6), 0 0 20px rgba(124,58,237,.4), 0 0 40px rgba(79,70,229,.3); }`,
    previewHtml: '<span class="prev-neon">Neon Glow</span>',
  },
  {
    id: 'typewriter-text',
    name: 'Typewriter Effect',
    description: 'Animate text character-by-character with a blinking cursor. Best on single-line headings.',
    category: 'text',
    tier: 'pro',
    targets: 'Headings (h1-h3)',
    previewCss: `
      .prev-tw { font-size: 24px; font-weight: 700; color: #f1f5f9; display: inline-block;
        overflow: hidden; white-space: nowrap; border-right: 2px solid #818cf8;
        animation: tw-type 2.5s steps(11) 1s both, tw-blink .7s step-end infinite; }
      @keyframes tw-type { from { width: 0 } to { width: 11ch } }
      @keyframes tw-blink { 50% { border-color: transparent } }`,
    previewHtml: '<span class="prev-tw">Typewriter_</span>',
  },
  {
    id: 'text-reveal',
    name: 'Text Slide Reveal',
    description: 'Text slides up and fades in with a smooth entrance animation.',
    category: 'text',
    tier: 'free',
    targets: 'Headings (h1-h6), paragraphs',
    previewCss: `
      .prev-reveal { font-size: 26px; font-weight: 700; color: #f1f5f9;
        animation: prev-slide 1s cubic-bezier(.16,1,.3,1) both; }
      @keyframes prev-slide { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }`,
    previewHtml: '<span class="prev-reveal">Slide Reveal</span>',
  },
  {
    id: 'animated-underline',
    name: 'Animated Underline',
    description: 'Gradient underline expands from left on hover. Perfect for links and nav items.',
    category: 'text',
    tier: 'free',
    targets: 'Links, headings, spans',
    previewCss: `
      .prev-underline { font-size: 24px; font-weight: 700; color: #f1f5f9; position: relative; display: inline-block; cursor: pointer; }
      .prev-underline::after { content: ""; position: absolute; bottom: -3px; left: 0; width: 0; height: 2.5px;
        background: linear-gradient(90deg, #7c3aed, #3b82f6); border-radius: 2px; transition: width .35s cubic-bezier(.4,0,.2,1); }
      .prev-underline:hover::after { width: 100%; }`,
    previewHtml: '<span class="prev-underline">Hover Me</span>',
  },
  {
    id: 'text-shadow-layers',
    name: 'Multi-Layer Text Shadow',
    description: 'Stacked colored text-shadows create a deep, dimensional retro-style text look.',
    category: 'text',
    tier: 'pro',
    targets: 'Headings (h1-h4)',
    previewCss: `
      .prev-layers { font-size: 28px; font-weight: 800; color: #f1f5f9;
        text-shadow: 1px 1px 0 #7c3aed, 2px 2px 0 #6d28d9, 3px 3px 0 #5b21b6, 4px 4px 8px rgba(0,0,0,.3); }`,
    previewHtml: '<span class="prev-layers">Layered</span>',
  },

  // ───── BUTTON ─────
  {
    id: 'gradient-border-btn',
    name: 'Gradient Border Button',
    description: 'Animated gradient border that shifts colors continuously around the button.',
    category: 'button',
    tier: 'free',
    targets: 'Buttons, link buttons',
    previewCss: `
      .prev-gbtn { display: inline-block; padding: 10px 24px; font-size: 14px; font-weight: 600; color: #f1f5f9;
        background: #111118; border: none; border-radius: 12px; position: relative; z-index: 1; }
      .prev-gbtn::before { content: ""; position: absolute; inset: -2px; border-radius: 14px;
        background: linear-gradient(135deg, #7c3aed, #3b82f6, #7c3aed); background-size: 200% 200%;
        animation: prev-gshift 3s linear infinite; z-index: -1; }
      .prev-gbtn::after { content: ""; position: absolute; inset: 0; background: #111118; border-radius: 12px; z-index: -1; }
      @keyframes prev-gshift { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }`,
    previewHtml: '<span class="prev-gbtn">Enroll Now</span>',
  },
  {
    id: 'glass-button',
    name: 'Glass Button',
    description: 'Frosted-glass style with backdrop-filter blur and translucent background.',
    category: 'button',
    tier: 'free',
    targets: 'Buttons, link buttons',
    previewCss: `
      .prev-glass { display: inline-block; padding: 10px 24px; font-size: 14px; font-weight: 600; color: #e2e8f0;
        background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
        backdrop-filter: blur(12px); border-radius: 12px; }`,
    previewHtml: '<span class="prev-glass">Glass CTA</span>',
  },
  {
    id: 'shimmer-button',
    name: 'Shimmer Sweep Button',
    description: 'Diagonal light sweep moves across the button continuously, creating a premium shine.',
    category: 'button',
    tier: 'free',
    targets: 'Buttons, link buttons',
    previewCss: `
      .prev-shimmer { display: inline-block; padding: 10px 24px; font-size: 14px; font-weight: 600; color: #fff;
        background: linear-gradient(135deg, #7c3aed, #4f46e5); border: none; border-radius: 12px;
        position: relative; overflow: hidden; }
      .prev-shimmer::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
        animation: prev-shm 2.5s ease-in-out infinite; }
      @keyframes prev-shm { 0% { left: -100% } 60%,100% { left: 100% } }`,
    previewHtml: '<span class="prev-shimmer">Shimmer</span>',
  },
  {
    id: 'pulse-button',
    name: 'Pulse Glow Button',
    description: 'Rhythmic pulsing glow radiates from the button. Draws the eye to primary CTAs.',
    category: 'button',
    tier: 'pro',
    targets: 'Buttons, link buttons',
    previewCss: `
      .prev-pulse { display: inline-block; padding: 10px 24px; font-size: 14px; font-weight: 600; color: #fff;
        background: linear-gradient(135deg, #7c3aed, #3b82f6); border: none; border-radius: 12px;
        animation: prev-pg 2.5s ease-in-out infinite; }
      @keyframes prev-pg { 0%,100% { box-shadow: 0 4px 16px rgba(124,58,237,.3) }
        50% { box-shadow: 0 4px 32px rgba(124,58,237,.6), 0 0 60px rgba(124,58,237,.15) } }`,
    previewHtml: '<span class="prev-pulse">Enroll</span>',
  },
  {
    id: 'ripple-button',
    name: 'Ripple Click Button',
    description: 'Material-design ripple that expands outward from center on hover.',
    category: 'button',
    tier: 'pro',
    targets: 'Buttons, link buttons',
    previewCss: `
      .prev-ripple { display: inline-block; padding: 10px 24px; font-size: 14px; font-weight: 600; color: #fff;
        background: linear-gradient(135deg, #7c3aed, #4f46e5); border: none; border-radius: 12px;
        position: relative; overflow: hidden; }
      .prev-ripple::after { content: ""; position: absolute; top: 50%; left: 50%; width: 0; height: 0;
        border-radius: 50%; background: rgba(255,255,255,.25); transform: translate(-50%,-50%);
        animation: prev-rip 1.5s ease infinite; }
      @keyframes prev-rip { to { width: 200px; height: 200px; opacity: 0 } }`,
    previewHtml: '<span class="prev-ripple">Click Me</span>',
  },

  // ───── CARD / CONTAINER ─────
  {
    id: 'glassmorphism-card',
    name: 'Glassmorphism Card',
    description: 'Frosted-glass aesthetic with translucent bg, blur, and subtle border. The defining modern UI look.',
    category: 'card',
    tier: 'free',
    targets: 'Divs, sections, card elements',
    previewCss: `
      .prev-glasscard { width: 180px; padding: 20px; border-radius: 16px; text-align: center;
        background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
        backdrop-filter: blur(16px); color: #e2e8f0; font-size: 13px; font-weight: 600; }`,
    previewHtml: '<div class="prev-glasscard">Frosted Glass</div>',
  },
  {
    id: 'neumorphism-card',
    name: 'Neumorphism Card',
    description: 'Soft embossed look with inner and outer shadows on a matching background.',
    category: 'card',
    tier: 'free',
    targets: 'Divs, sections, card elements',
    previewCss: `
      .prev-neucard { width: 180px; padding: 20px; border-radius: 16px; text-align: center;
        background: #1a1a24; border: none; color: #94a3b8; font-size: 13px; font-weight: 600;
        box-shadow: 6px 6px 16px rgba(0,0,0,.5), -6px -6px 16px rgba(255,255,255,.03); }`,
    previewHtml: '<div class="prev-neucard">Neumorphism</div>',
  },
  {
    id: 'hover-lift-card',
    name: 'Hover Lift Card',
    description: 'Card elevates smoothly on hover with an expanding violet shadow.',
    category: 'card',
    tier: 'free',
    targets: 'Divs, card elements',
    previewCss: `
      .prev-lift { width: 180px; padding: 20px; border-radius: 16px; text-align: center;
        background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
        color: #94a3b8; font-size: 13px; font-weight: 600;
        transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s cubic-bezier(.4,0,.2,1); }
      .prev-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(124,58,237,.12); }`,
    previewHtml: '<div class="prev-lift">Hover to Lift</div>',
  },
  {
    id: 'morphing-border-card',
    name: 'Morphing Border Card',
    description: 'Continuously shifting gradient border wraps the container. Premium treatment.',
    category: 'card',
    tier: 'pro',
    targets: 'Divs, sections, card elements',
    previewCss: `
      .prev-morph { width: 180px; padding: 20px; border-radius: 16px; text-align: center;
        background: #111118; color: #c4b5fd; font-size: 13px; font-weight: 600;
        position: relative; z-index: 1; border: none; }
      .prev-morph::before { content: ""; position: absolute; inset: -2px; border-radius: 18px;
        background: linear-gradient(135deg, #7c3aed, #3b82f6, #10b981, #7c3aed); background-size: 300% 300%;
        animation: prev-mshift 5s linear infinite; z-index: -1; }
      .prev-morph::after { content: ""; position: absolute; inset: 0; background: #111118; border-radius: 16px; z-index: -1; }
      @keyframes prev-mshift { 0% { background-position: 0% 50% } 100% { background-position: 300% 50% } }`,
    previewHtml: '<div class="prev-morph">Morphing</div>',
  },
  {
    id: '3d-tilt-card',
    name: '3D Hover Tilt',
    description: 'Card tilts toward the cursor on hover using CSS perspective transforms.',
    category: 'card',
    tier: 'pro',
    targets: 'Divs, card elements',
    previewCss: `
      .prev-tilt { width: 180px; padding: 20px; border-radius: 16px; text-align: center;
        background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
        color: #94a3b8; font-size: 13px; font-weight: 600; transition: transform .3s ease; }
      .prev-tilt:hover { transform: perspective(800px) rotateX(3deg) rotateY(-3deg) scale(1.02); }`,
    previewHtml: '<div class="prev-tilt">Tilt Me</div>',
  },

  // ───── IMAGE ─────
  {
    id: 'gradient-shadow-img',
    name: 'Gradient Shadow',
    description: 'Colorful gradient drop-shadow beneath images for a modern, vibrant presentation.',
    category: 'image',
    tier: 'free',
    targets: 'Images (img)',
    previewCss: `
      .prev-gshadow { width: 120px; height: 80px; border-radius: 12px;
        background: linear-gradient(135deg, #334155, #1e293b);
        box-shadow: 0 12px 40px rgba(124,58,237,.4), 0 4px 12px rgba(59,130,246,.2); }`,
    previewHtml: '<div class="prev-gshadow"></div>',
  },
  {
    id: 'hover-zoom-img',
    name: 'Hover Zoom',
    description: 'Image scales up smoothly inside its container on hover.',
    category: 'image',
    tier: 'free',
    targets: 'Images (img)',
    previewCss: `
      .prev-zoom-wrap { overflow: hidden; border-radius: 12px; width: 120px; height: 80px; }
      .prev-zoom { width: 100%; height: 100%; background: linear-gradient(135deg, #334155, #1e293b);
        transition: transform .5s cubic-bezier(.4,0,.2,1); }
      .prev-zoom-wrap:hover .prev-zoom { transform: scale(1.08); }`,
    previewHtml: '<div class="prev-zoom-wrap"><div class="prev-zoom"></div></div>',
  },
  {
    id: 'blur-reveal-img',
    name: 'Blur-to-Focus Reveal',
    description: 'Image starts blurred and gradually comes into sharp focus with a smooth animation.',
    category: 'image',
    tier: 'pro',
    targets: 'Images (img)',
    previewCss: `
      .prev-blur { width: 120px; height: 80px; border-radius: 12px;
        background: linear-gradient(135deg, #334155, #1e293b);
        animation: prev-blurin 2s ease-out both; }
      @keyframes prev-blurin { from { filter: blur(12px); opacity: .6 } to { filter: blur(0); opacity: 1 } }`,
    previewHtml: '<div class="prev-blur"></div>',
  },
  {
    id: 'parallax-float-img',
    name: 'Parallax Float',
    description: 'Gentle continuous floating motion adds subtle life to static images.',
    category: 'image',
    tier: 'pro',
    targets: 'Images (img)',
    previewCss: `
      .prev-float { width: 120px; height: 80px; border-radius: 12px;
        background: linear-gradient(135deg, #334155, #1e293b);
        animation: prev-fl 4s ease-in-out infinite; }
      @keyframes prev-fl { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }`,
    previewHtml: '<div class="prev-float"></div>',
  },

  // ───── SECTION / BG ─────
  {
    id: 'animated-gradient-bg',
    name: 'Animated Gradient BG',
    description: 'Slowly shifting multi-color gradient background transforms flat sections.',
    category: 'section',
    tier: 'free',
    targets: 'Sections, outer divs',
    previewCss: `
      .prev-agbg { width: 200px; height: 80px; border-radius: 12px;
        background: linear-gradient(135deg, #0a0a2e, #1a0a3e, #0a1a3e, #0a0a2e); background-size: 300% 300%;
        animation: prev-bgshift 8s ease infinite; }
      @keyframes prev-bgshift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }`,
    previewHtml: '<div class="prev-agbg"></div>',
  },
  {
    id: 'mesh-gradient-bg',
    name: 'Mesh Gradient BG',
    description: 'Layered radial gradients create an organic multi-blob mesh effect.',
    category: 'section',
    tier: 'pro',
    targets: 'Sections, outer divs',
    previewCss: `
      .prev-mesh { width: 200px; height: 80px; border-radius: 12px; background: #0a0a0f;
        background-image: radial-gradient(at 20% 30%, rgba(124,58,237,.15) 0%, transparent 50%),
          radial-gradient(at 80% 70%, rgba(59,130,246,.12) 0%, transparent 50%),
          radial-gradient(at 50% 50%, rgba(16,185,129,.08) 0%, transparent 60%); }`,
    previewHtml: '<div class="prev-mesh"></div>',
  },
  {
    id: 'aurora-bg',
    name: 'Aurora Background',
    description: 'Animated aurora borealis effect with shifting soft color blobs.',
    category: 'section',
    tier: 'pro',
    targets: 'Sections, outer divs',
    previewCss: `
      .prev-aurora { width: 200px; height: 80px; border-radius: 12px; background: #0a0a0f;
        position: relative; overflow: hidden; }
      .prev-aurora::before, .prev-aurora::after { content: ""; position: absolute; border-radius: 50%;
        filter: blur(20px); opacity: .4; animation: prev-aur 8s ease-in-out infinite alternate; }
      .prev-aurora::before { width: 60%; height: 60%; top: -10%; left: -10%; background: rgba(124,58,237,.3); }
      .prev-aurora::after { width: 50%; height: 50%; bottom: -10%; right: -10%; background: rgba(59,130,246,.25); animation-delay: -4s; }
      @keyframes prev-aur { 0% { transform: translate(0,0) scale(1) } 100% { transform: translate(10px,8px) scale(1.1) } }`,
    previewHtml: '<div class="prev-aurora"></div>',
  },
  {
    id: 'noise-texture-bg',
    name: 'Subtle Noise Texture',
    description: 'Fine-grain noise overlay adds depth and removes the "flat" feel from sections.',
    category: 'section',
    tier: 'free',
    targets: 'Sections, outer divs',
    previewCss: `
      .prev-noise { width: 200px; height: 80px; border-radius: 12px; background: #111118;
        position: relative; overflow: hidden; }
      .prev-noise::after { content: ""; position: absolute; inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
        opacity: .5; pointer-events: none; }`,
    previewHtml: '<div class="prev-noise"></div>',
  },

  // ───── ANIMATION ─────
  {
    id: 'fade-in',
    name: 'Fade In',
    description: 'Smooth opacity fade-in entrance. Works on any element.',
    category: 'animation',
    tier: 'free',
    targets: 'Any element',
    previewCss: `
      .prev-fade { font-size: 26px; font-weight: 700; color: #f1f5f9;
        animation: prev-fi 1.5s ease both; }
      @keyframes prev-fi { from { opacity: 0 } to { opacity: 1 } }`,
    previewHtml: '<span class="prev-fade">Fade In</span>',
  },
  {
    id: 'slide-in-left',
    name: 'Slide In Left',
    description: 'Element slides in from the left with a subtle fade.',
    category: 'animation',
    tier: 'free',
    targets: 'Any element',
    previewCss: `
      .prev-slideleft { font-size: 26px; font-weight: 700; color: #f1f5f9;
        animation: prev-sll .8s cubic-bezier(.16,1,.3,1) both; }
      @keyframes prev-sll { from { opacity: 0; transform: translateX(-40px) } to { opacity: 1; transform: translateX(0) } }`,
    previewHtml: '<span class="prev-slideleft">Slide In</span>',
  },
  {
    id: 'bounce-entrance',
    name: 'Bounce Entrance',
    description: 'Playful bounce animation as the element enters the viewport.',
    category: 'animation',
    tier: 'pro',
    targets: 'Any element',
    previewCss: `
      .prev-bounce { font-size: 26px; font-weight: 700; color: #f1f5f9;
        animation: prev-bi .8s cubic-bezier(.34,1.56,.64,1) both; }
      @keyframes prev-bi { 0% { opacity: 0; transform: scale(.3) } 50% { transform: scale(1.05) }
        70% { transform: scale(.95) } 100% { opacity: 1; transform: scale(1) } }`,
    previewHtml: '<span class="prev-bounce">Bounce</span>',
  },
  {
    id: 'scale-up',
    name: 'Scale Up Entrance',
    description: 'Element grows from smaller size to full size with smooth ease.',
    category: 'animation',
    tier: 'free',
    targets: 'Any element',
    previewCss: `
      .prev-scaleup { font-size: 26px; font-weight: 700; color: #f1f5f9;
        animation: prev-su .7s cubic-bezier(.16,1,.3,1) both; }
      @keyframes prev-su { from { opacity: 0; transform: scale(.85) } to { opacity: 1; transform: scale(1) } }`,
    previewHtml: '<span class="prev-scaleup">Scale Up</span>',
  },
  {
    id: 'rotate-in',
    name: 'Rotate In',
    description: 'Element rotates and fades in from a slight angle. Unique and attention-grabbing.',
    category: 'animation',
    tier: 'pro',
    targets: 'Any element',
    previewCss: `
      .prev-rotin { font-size: 26px; font-weight: 700; color: #f1f5f9;
        animation: prev-ri .8s cubic-bezier(.16,1,.3,1) both; }
      @keyframes prev-ri { from { opacity: 0; transform: rotate(-8deg) scale(.9) } to { opacity: 1; transform: rotate(0) scale(1) } }`,
    previewHtml: '<span class="prev-rotin">Rotate</span>',
  },
];

/** Get effects filtered by category and search query */
export function filterEffects(category = 'all', query = '') {
  return effects.filter((e) => {
    const catMatch = category === 'all' || e.category === category;
    const q = query.toLowerCase();
    const searchMatch = !q
      || e.name.toLowerCase().includes(q)
      || e.description.toLowerCase().includes(q)
      || e.category.toLowerCase().includes(q);
    return catMatch && searchMatch;
  });
}

/** Count effects per category */
export function countByCategory() {
  const counts = { all: effects.length };
  effects.forEach((e) => {
    counts[e.category] = (counts[e.category] || 0) + 1;
  });
  return counts;
}

/** Check if effect is accessible for user tier */
export function canAccess(effect, tier) {
  if (effect.tier === 'free') return true;
  return tier === 'pro';
}
