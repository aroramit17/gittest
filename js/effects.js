/* ═══════════════════════════════════════════════════════════════════
   ZenEnhance — Effects Engine
   Each effect: { id, name, description, category, tier,
                  targets, previewHtml, previewCss, apply(doc) }
   apply() mutates a DOMParser document and returns extra <style> CSS.
   ═══════════════════════════════════════════════════════════════════ */

window.ZenEffects = (function () {
  'use strict';

  /* ── Helper: merge inline styles without duplicating properties ── */
  function mergeStyle(el, newProps) {
    var existing = (el.getAttribute('style') || '').replace(/;\s*$/, '');
    var pairs = existing ? existing.split(';').map(function (s) { return s.trim(); }) : [];
    var map = {};
    pairs.forEach(function (p) {
      var idx = p.indexOf(':');
      if (idx > -1) map[p.slice(0, idx).trim().toLowerCase()] = p.slice(idx + 1).trim();
    });
    Object.keys(newProps).forEach(function (k) { map[k] = newProps[k]; });
    var out = Object.keys(map).map(function (k) { return k + ': ' + map[k]; }).join('; ');
    el.setAttribute('style', out);
  }

  /* ── Helper: add class without duplicating ── */
  function addClass(el, cls) {
    var cur = el.getAttribute('class') || '';
    if ((' ' + cur + ' ').indexOf(' ' + cls + ' ') === -1) {
      el.setAttribute('class', (cur + ' ' + cls).trim());
    }
  }

  /* ── Helper: pick the first matching target ── */
  function findTarget(doc, selectors) {
    for (var i = 0; i < selectors.length; i++) {
      var el = doc.querySelector(selectors[i]);
      if (el) return el;
    }
    return null;
  }

  function findAllTargets(doc, selectors) {
    var results = [];
    selectors.forEach(function (sel) {
      doc.querySelectorAll(sel).forEach(function (el) { results.push(el); });
    });
    return results;
  }

  /* ══════════════════════════════════════════════════════════
     EFFECT DEFINITIONS (25 effects)
     ══════════════════════════════════════════════════════════ */

  var effects = [

    /* ───────── TEXT EFFECTS ───────── */

    {
      id: 'gradient-text',
      name: 'Gradient Text',
      description: 'Apply a vibrant gradient color fill to headings or text elements. Uses background-clip for a smooth multi-color text effect.',
      category: 'text',
      tier: 'free',
      targets: 'Headings (h1-h6), paragraphs, spans',
      previewHtml: '<span class="preview-text" style="background:linear-gradient(135deg,#c4b5fd,#818cf8,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Gradient Text</span>',
      previewCss: '',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3','h4','h5','h6','p','span']);
        if (!el) return '';
        mergeStyle(el, {
          'background': 'linear-gradient(135deg, #c4b5fd 0%, #818cf8 50%, #60a5fa 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text'
        });
        return '';
      }
    },

    {
      id: 'neon-glow-text',
      name: 'Neon Glow Text',
      description: 'Give text a glowing neon effect with layered text-shadows in violet and blue tones.',
      category: 'text',
      tier: 'free',
      targets: 'Headings (h1-h6), spans',
      previewHtml: '<span class="preview-text" style="color:#c4b5fd;text-shadow:0 0 7px rgba(124,58,237,0.6),0 0 20px rgba(124,58,237,0.4),0 0 40px rgba(79,70,229,0.3);">Neon Glow</span>',
      previewCss: '',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3','h4','h5','h6','span']);
        if (!el) return '';
        mergeStyle(el, {
          'color': '#c4b5fd',
          'text-shadow': '0 0 7px rgba(124,58,237,0.6), 0 0 20px rgba(124,58,237,0.4), 0 0 40px rgba(79,70,229,0.3)'
        });
        return '';
      }
    },

    {
      id: 'typewriter-text',
      name: 'Typewriter Effect',
      description: 'Animate text as if being typed character-by-character with a blinking cursor. Best on single-line headings.',
      category: 'text',
      tier: 'premium',
      targets: 'Headings (h1-h3)',
      previewHtml: '<span class="ze-typewriter preview-text" style="color:#f1f5f9;">Typewriter_</span>',
      previewCss: '.ze-typewriter{display:inline-block;overflow:hidden;white-space:nowrap;border-right:2px solid #818cf8;animation:ze-tw-type 2.5s steps(11) 1s both,ze-tw-blink .7s step-end infinite}.effect-card-preview .ze-typewriter{font-size:24px}@keyframes ze-tw-type{from{width:0}to{width:11ch}}@keyframes ze-tw-blink{50%{border-color:transparent}}',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3']);
        if (!el) return '';
        var text = el.textContent.trim();
        var charCount = text.length;
        addClass(el, 'ze-typewriter');
        mergeStyle(el, {
          'display': 'inline-block',
          'overflow': 'hidden',
          'white-space': 'nowrap',
          'border-right': '2px solid #818cf8'
        });
        return '.ze-typewriter{animation:ze-tw-type 2.5s steps(' + charCount + ') 0.5s both,ze-tw-blink 0.7s step-end infinite}@keyframes ze-tw-type{from{width:0}to{width:' + charCount + 'ch}}@keyframes ze-tw-blink{50%{border-color:transparent}}';
      }
    },

    {
      id: 'text-reveal',
      name: 'Text Slide Reveal',
      description: 'Text slides up and fades in with a smooth entrance animation. Clean and elegant.',
      category: 'text',
      tier: 'free',
      targets: 'Headings (h1-h6), paragraphs',
      previewHtml: '<span class="ze-text-reveal preview-text" style="color:#f1f5f9;">Slide Reveal</span>',
      previewCss: '.ze-text-reveal{display:inline-block;animation:ze-slide-reveal 0.8s cubic-bezier(0.16,1,0.3,1) both}@keyframes ze-slide-reveal{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3','h4','h5','h6','p']);
        if (!el) return '';
        addClass(el, 'ze-text-reveal');
        return '.ze-text-reveal{animation:ze-slide-reveal 0.8s cubic-bezier(0.16,1,0.3,1) both}@keyframes ze-slide-reveal{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}';
      }
    },

    {
      id: 'animated-underline',
      name: 'Animated Underline',
      description: 'Add a gradient underline that expands on hover. Perfect for navigation links or key text.',
      category: 'text',
      tier: 'free',
      targets: 'Links (a), headings, spans',
      previewHtml: '<span class="ze-animated-underline preview-text" style="color:#f1f5f9;cursor:pointer;">Hover Me</span>',
      previewCss: '.ze-animated-underline{position:relative;display:inline-block}.ze-animated-underline::after{content:"";position:absolute;bottom:-3px;left:0;width:0;height:2.5px;background:linear-gradient(90deg,#7c3aed,#3b82f6);border-radius:2px;transition:width 0.35s cubic-bezier(0.4,0,0.2,1)}.ze-animated-underline:hover::after{width:100%}',
      apply: function (doc) {
        var el = findTarget(doc, ['a','h1','h2','h3','h4','h5','h6','span']);
        if (!el) return '';
        addClass(el, 'ze-animated-underline');
        mergeStyle(el, { 'position': 'relative', 'display': 'inline-block' });
        return '.ze-animated-underline::after{content:"";position:absolute;bottom:-3px;left:0;width:0;height:2.5px;background:linear-gradient(90deg,#7c3aed,#3b82f6);border-radius:2px;transition:width 0.35s cubic-bezier(0.4,0,0.2,1)}.ze-animated-underline:hover::after{width:100%}';
      }
    },

    {
      id: 'text-shadow-layers',
      name: 'Multi-Layer Text Shadow',
      description: 'Stack multiple colored text-shadows to create a deep, dimensional retro-style text effect.',
      category: 'text',
      tier: 'premium',
      targets: 'Headings (h1-h4)',
      previewHtml: '<span class="preview-text" style="color:#f1f5f9;text-shadow:1px 1px 0 #7c3aed,2px 2px 0 #6d28d9,3px 3px 0 #5b21b6,4px 4px 8px rgba(0,0,0,0.3);">Layered</span>',
      previewCss: '',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3','h4']);
        if (!el) return '';
        mergeStyle(el, {
          'text-shadow': '1px 1px 0 #7c3aed, 2px 2px 0 #6d28d9, 3px 3px 0 #5b21b6, 4px 4px 8px rgba(0,0,0,0.3)'
        });
        return '';
      }
    },

    /* ───────── BUTTON EFFECTS ───────── */

    {
      id: 'gradient-border-btn',
      name: 'Gradient Border Button',
      description: 'Wrap a button with an animated gradient border that shifts colors continuously. Eye-catching CTA treatment.',
      category: 'button',
      tier: 'free',
      targets: 'Buttons (a, button)',
      previewHtml: '<span class="ze-grad-border-btn preview-btn" style="color:#f1f5f9;background:#111118;">Enroll Now</span>',
      previewCss: '.ze-grad-border-btn{position:relative;z-index:1;border:none!important}.ze-grad-border-btn::before{content:"";position:absolute;inset:-2px;border-radius:inherit;background:linear-gradient(135deg,#7c3aed,#3b82f6,#7c3aed);background-size:200% 200%;animation:ze-grad-shift 3s linear infinite;z-index:-1;border-radius:14px}.ze-grad-border-btn::after{content:"";position:absolute;inset:0;background:#111118;border-radius:12px;z-index:-1}@keyframes ze-grad-shift{0%{background-position:0% 50%}100%{background-position:200% 50%}}',
      apply: function (doc) {
        var el = findTarget(doc, ['a[data-component="button"]','button[data-component="button"]','a.btn','button.btn','a','button']);
        if (!el) return '';
        addClass(el, 'ze-grad-border-btn');
        mergeStyle(el, { 'position': 'relative', 'z-index': '1' });
        return '.ze-grad-border-btn{border:none!important}.ze-grad-border-btn::before{content:"";position:absolute;inset:-2px;background:linear-gradient(135deg,#7c3aed,#3b82f6,#10b981,#7c3aed);background-size:300% 300%;animation:ze-grad-shift 4s linear infinite;z-index:-1;border-radius:inherit}.ze-grad-border-btn::after{content:"";position:absolute;inset:0;background:inherit;border-radius:inherit;z-index:-1}@keyframes ze-grad-shift{0%{background-position:0% 50%}100%{background-position:300% 50%}}';
      }
    },

    {
      id: 'glass-button',
      name: 'Glass Button',
      description: 'Transform a button into a frosted-glass style with backdrop-filter blur and translucent background.',
      category: 'button',
      tier: 'free',
      targets: 'Buttons (a, button)',
      previewHtml: '<span class="preview-btn" style="color:#e2e8f0;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(12px);border-radius:12px;">Glass CTA</span>',
      previewCss: '',
      apply: function (doc) {
        var el = findTarget(doc, ['a[data-component="button"]','button[data-component="button"]','a.btn','button.btn','a','button']);
        if (!el) return '';
        mergeStyle(el, {
          'background': 'rgba(255,255,255,0.06)',
          'border': '1px solid rgba(255,255,255,0.12)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'color': '#e2e8f0',
          'border-radius': '12px'
        });
        return '';
      }
    },

    {
      id: 'shimmer-button',
      name: 'Shimmer Sweep Button',
      description: 'A diagonal light sweep moves across the button on hover, creating a premium shine effect.',
      category: 'button',
      tier: 'free',
      targets: 'Buttons (a, button)',
      previewHtml: '<span class="ze-shimmer-btn preview-btn" style="color:#fff;background:linear-gradient(135deg,#7c3aed,#4f46e5);border:none;border-radius:12px;">Shimmer</span>',
      previewCss: '.ze-shimmer-btn{position:relative;overflow:hidden}.ze-shimmer-btn::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);animation:ze-shimmer-sweep 2.5s ease-in-out infinite}@keyframes ze-shimmer-sweep{0%{left:-100%}60%,100%{left:100%}}',
      apply: function (doc) {
        var el = findTarget(doc, ['a[data-component="button"]','button[data-component="button"]','a.btn','button.btn','a','button']);
        if (!el) return '';
        addClass(el, 'ze-shimmer-btn');
        mergeStyle(el, { 'position': 'relative', 'overflow': 'hidden' });
        return '.ze-shimmer-btn::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);animation:ze-shimmer-sweep 2.5s ease-in-out infinite}@keyframes ze-shimmer-sweep{0%{left:-100%}60%,100%{left:100%}}';
      }
    },

    {
      id: 'pulse-button',
      name: 'Pulse Glow Button',
      description: 'A rhythmic pulsing glow around the button draws the eye. Great for primary CTAs.',
      category: 'button',
      tier: 'premium',
      targets: 'Buttons (a, button)',
      previewHtml: '<span class="ze-pulse-btn preview-btn" style="color:#fff;background:linear-gradient(135deg,#7c3aed,#3b82f6);border:none;border-radius:12px;">Enroll</span>',
      previewCss: '.ze-pulse-btn{animation:ze-pulse-glow 2.5s ease-in-out infinite}@keyframes ze-pulse-glow{0%,100%{box-shadow:0 4px 16px rgba(124,58,237,0.3)}50%{box-shadow:0 4px 32px rgba(124,58,237,0.6),0 0 60px rgba(124,58,237,0.15)}}',
      apply: function (doc) {
        var el = findTarget(doc, ['a[data-component="button"]','button[data-component="button"]','a.btn','button.btn','a','button']);
        if (!el) return '';
        addClass(el, 'ze-pulse-btn');
        return '.ze-pulse-btn{animation:ze-pulse-glow 2.5s ease-in-out infinite}@keyframes ze-pulse-glow{0%,100%{box-shadow:0 4px 16px rgba(124,58,237,0.3)}50%{box-shadow:0 4px 32px rgba(124,58,237,0.6),0 0 60px rgba(124,58,237,0.15)}}';
      }
    },

    {
      id: 'ripple-button',
      name: 'Ripple Click Button',
      description: 'Material-design-inspired ripple animation that expands outward from the center on hover.',
      category: 'button',
      tier: 'premium',
      targets: 'Buttons (a, button)',
      previewHtml: '<span class="ze-ripple-btn preview-btn" style="color:#fff;background:linear-gradient(135deg,#7c3aed,#4f46e5);border:none;border-radius:12px;">Click Me</span>',
      previewCss: '.ze-ripple-btn{position:relative;overflow:hidden}.ze-ripple-btn::after{content:"";position:absolute;top:50%;left:50%;width:0;height:0;border-radius:50%;background:rgba(255,255,255,0.25);transform:translate(-50%,-50%);transition:width 0.5s ease,height 0.5s ease,opacity 0.5s ease;opacity:0}.ze-ripple-btn:hover::after{width:300px;height:300px;opacity:0}@keyframes ze-ripple-out{to{width:300px;height:300px;opacity:0}}.effect-card-preview .ze-ripple-btn::after{animation:ze-ripple-out 1.5s ease infinite}',
      apply: function (doc) {
        var el = findTarget(doc, ['a[data-component="button"]','button[data-component="button"]','a.btn','button.btn','a','button']);
        if (!el) return '';
        addClass(el, 'ze-ripple-btn');
        mergeStyle(el, { 'position': 'relative', 'overflow': 'hidden' });
        return '.ze-ripple-btn::after{content:"";position:absolute;top:50%;left:50%;width:0;height:0;border-radius:50%;background:rgba(255,255,255,0.25);transform:translate(-50%,-50%);transition:width 0.6s ease,height 0.6s ease,opacity 0.8s ease;opacity:0.6}.ze-ripple-btn:hover::after{width:300px;height:300px;opacity:0}';
      }
    },

    /* ───────── CARD / CONTAINER EFFECTS ───────── */

    {
      id: 'glassmorphism-card',
      name: 'Glassmorphism Card',
      description: 'Frosted-glass aesthetic with translucent background, blur, and subtle border. The defining look of modern UI.',
      category: 'card',
      tier: 'free',
      targets: 'Divs, sections, card elements',
      previewHtml: '<div class="preview-card-box" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(16px);color:#e2e8f0;font-size:13px;font-weight:600;">Frosted Glass</div>',
      previewCss: '',
      apply: function (doc) {
        var el = findTarget(doc, ['[data-component="card"]','div[data-component]','section','div']);
        if (!el) return '';
        mergeStyle(el, {
          'background': 'rgba(255,255,255,0.04)',
          'border': '1px solid rgba(255,255,255,0.08)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border-radius': '16px'
        });
        return '';
      }
    },

    {
      id: 'neumorphism-card',
      name: 'Neumorphism Card',
      description: 'Soft embossed look using inner and outer shadows on a matching background. Subtle, tactile feel.',
      category: 'card',
      tier: 'free',
      targets: 'Divs, sections, card elements',
      previewHtml: '<div class="preview-card-box" style="background:#1a1a24;border-radius:16px;box-shadow:6px 6px 16px rgba(0,0,0,0.5),-6px -6px 16px rgba(255,255,255,0.03);color:#94a3b8;font-size:13px;font-weight:600;border:none;">Neumorphism</div>',
      previewCss: '',
      apply: function (doc) {
        var el = findTarget(doc, ['[data-component="card"]','div[data-component]','section','div']);
        if (!el) return '';
        mergeStyle(el, {
          'background': '#1a1a24',
          'border': 'none',
          'border-radius': '16px',
          'box-shadow': '6px 6px 16px rgba(0,0,0,0.5), -6px -6px 16px rgba(255,255,255,0.03)'
        });
        return '';
      }
    },

    {
      id: 'hover-lift-card',
      name: 'Hover Lift Card',
      description: 'Card elevates smoothly on hover with an expanding shadow. Classic interaction design.',
      category: 'card',
      tier: 'free',
      targets: 'Divs, card elements',
      previewHtml: '<div class="ze-hover-lift preview-card-box" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);color:#94a3b8;font-size:13px;font-weight:600;">Hover to Lift</div>',
      previewCss: '.ze-hover-lift{transition:transform 0.35s cubic-bezier(0.4,0,0.2,1),box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)}.ze-hover-lift:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(124,58,237,0.12)}',
      apply: function (doc) {
        var el = findTarget(doc, ['[data-component="card"]','div[data-component]','div']);
        if (!el) return '';
        addClass(el, 'ze-hover-lift');
        mergeStyle(el, { 'transition': 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)' });
        return '.ze-hover-lift:hover{transform:translateY(-6px)!important;box-shadow:0 20px 50px rgba(124,58,237,0.12)!important}';
      }
    },

    {
      id: 'morphing-border-card',
      name: 'Morphing Border Card',
      description: 'A gradient border that continuously shifts its colors. Premium container treatment.',
      category: 'card',
      tier: 'premium',
      targets: 'Divs, sections, card elements',
      previewHtml: '<div class="ze-morph-border preview-card-box" style="background:#111118;color:#c4b5fd;font-size:13px;font-weight:600;">Morphing</div>',
      previewCss: '.ze-morph-border{position:relative;border:none!important;z-index:1}.ze-morph-border::before{content:"";position:absolute;inset:-2px;border-radius:18px;background:linear-gradient(135deg,#7c3aed,#3b82f6,#10b981,#7c3aed);background-size:300% 300%;animation:ze-morph-shift 5s linear infinite;z-index:-1}.ze-morph-border::after{content:"";position:absolute;inset:0;background:#111118;border-radius:16px;z-index:-1}@keyframes ze-morph-shift{0%{background-position:0% 50%}100%{background-position:300% 50%}}',
      apply: function (doc) {
        var el = findTarget(doc, ['[data-component="card"]','div[data-component]','section','div']);
        if (!el) return '';
        addClass(el, 'ze-morph-border');
        mergeStyle(el, { 'position': 'relative', 'z-index': '1', 'border': 'none' });
        return '.ze-morph-border::before{content:"";position:absolute;inset:-2px;border-radius:inherit;background:linear-gradient(135deg,#7c3aed,#3b82f6,#10b981,#7c3aed);background-size:300% 300%;animation:ze-morph-shift 5s linear infinite;z-index:-1}.ze-morph-border::after{content:"";position:absolute;inset:0;background:inherit;border-radius:inherit;z-index:-1}@keyframes ze-morph-shift{0%{background-position:0% 50%}100%{background-position:300% 50%}}';
      }
    },

    {
      id: '3d-tilt-card',
      name: '3D Hover Tilt',
      description: 'Card tilts in 3D toward the cursor direction on hover using CSS perspective transforms.',
      category: 'card',
      tier: 'premium',
      targets: 'Divs, card elements',
      previewHtml: '<div class="ze-tilt preview-card-box" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#94a3b8;font-size:13px;font-weight:600;">Tilt Me</div>',
      previewCss: '.ze-tilt{transition:transform 0.3s ease;transform-style:preserve-3d;perspective:800px}.ze-tilt:hover{transform:perspective(800px) rotateX(3deg) rotateY(-3deg) scale(1.02)}',
      apply: function (doc) {
        var el = findTarget(doc, ['[data-component="card"]','div[data-component]','div']);
        if (!el) return '';
        addClass(el, 'ze-tilt');
        mergeStyle(el, { 'transition': 'transform 0.3s ease' });
        return '.ze-tilt:hover{transform:perspective(800px) rotateX(3deg) rotateY(-3deg) scale(1.02)!important}';
      }
    },

    /* ───────── IMAGE EFFECTS ───────── */

    {
      id: 'gradient-shadow-img',
      name: 'Gradient Shadow',
      description: 'Add a colorful gradient drop-shadow beneath images for a modern, vibrant look.',
      category: 'image',
      tier: 'free',
      targets: 'Images (img)',
      previewHtml: '<div class="preview-img-box" style="box-shadow:0 12px 40px rgba(124,58,237,0.4),0 4px 12px rgba(59,130,246,0.2);border-radius:12px;"></div>',
      previewCss: '',
      apply: function (doc) {
        var el = findTarget(doc, ['img']);
        if (!el) return '';
        mergeStyle(el, {
          'box-shadow': '0 12px 40px rgba(124,58,237,0.35), 0 4px 12px rgba(59,130,246,0.2)',
          'border-radius': '12px'
        });
        return '';
      }
    },

    {
      id: 'hover-zoom-img',
      name: 'Hover Zoom',
      description: 'Image smoothly scales up inside its container on hover. Clean and engaging.',
      category: 'image',
      tier: 'free',
      targets: 'Images (img)',
      previewHtml: '<div style="overflow:hidden;border-radius:12px;width:100px;height:70px;"><div class="ze-zoom-img preview-img-box" style="width:100%;height:100%;transition:transform 0.5s cubic-bezier(0.4,0,0.2,1);border-radius:0;"></div></div>',
      previewCss: '.ze-zoom-img:hover{transform:scale(1.08)}',
      apply: function (doc) {
        var el = findTarget(doc, ['img']);
        if (!el) return '';
        addClass(el, 'ze-zoom-img');
        mergeStyle(el, { 'transition': 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' });
        /* Ensure parent clips overflow */
        var parent = el.parentElement;
        if (parent) {
          mergeStyle(parent, { 'overflow': 'hidden' });
        }
        return '.ze-zoom-img:hover{transform:scale(1.08)!important}';
      }
    },

    {
      id: 'blur-reveal-img',
      name: 'Blur-to-Focus Reveal',
      description: 'Image starts blurred and gradually comes into focus with a smooth animation.',
      category: 'image',
      tier: 'premium',
      targets: 'Images (img)',
      previewHtml: '<div class="ze-blur-reveal preview-img-box" style="border-radius:12px;"></div>',
      previewCss: '.ze-blur-reveal{animation:ze-blur-in 2s ease-out both}@keyframes ze-blur-in{from{filter:blur(12px);opacity:0.6}to{filter:blur(0);opacity:1}}',
      apply: function (doc) {
        var el = findTarget(doc, ['img']);
        if (!el) return '';
        addClass(el, 'ze-blur-reveal');
        return '.ze-blur-reveal{animation:ze-blur-in 1.5s ease-out both}@keyframes ze-blur-in{from{filter:blur(12px);opacity:0.6}to{filter:blur(0);opacity:1}}';
      }
    },

    {
      id: 'parallax-float-img',
      name: 'Parallax Float',
      description: 'Image gently floats up and down in a continuous looping motion. Adds subtle life to static layouts.',
      category: 'image',
      tier: 'premium',
      targets: 'Images (img)',
      previewHtml: '<div class="ze-float preview-img-box" style="border-radius:12px;"></div>',
      previewCss: '.ze-float{animation:ze-float-anim 4s ease-in-out infinite}@keyframes ze-float-anim{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}',
      apply: function (doc) {
        var el = findTarget(doc, ['img']);
        if (!el) return '';
        addClass(el, 'ze-float');
        return '.ze-float{animation:ze-float-anim 4s ease-in-out infinite}@keyframes ze-float-anim{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}';
      }
    },

    /* ───────── SECTION / BACKGROUND EFFECTS ───────── */

    {
      id: 'animated-gradient-bg',
      name: 'Animated Gradient BG',
      description: 'A slowly shifting multi-color gradient background. Transforms flat sections into dynamic canvases.',
      category: 'section',
      tier: 'free',
      targets: 'Sections, outer divs',
      previewHtml: '<div class="ze-anim-bg preview-section-box" style="border-radius:12px;"></div>',
      previewCss: '.ze-anim-bg{background:linear-gradient(135deg,#0a0a2e,#1a0a3e,#0a1a3e,#0a0a2e);background-size:300% 300%;animation:ze-bg-shift 8s ease infinite}@keyframes ze-bg-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}',
      apply: function (doc) {
        var el = findTarget(doc, ['[data-component="section"]','section','div[data-component]','div']);
        if (!el) return '';
        addClass(el, 'ze-anim-bg');
        mergeStyle(el, {
          'background': 'linear-gradient(135deg, #0a0a2e, #1a0a3e, #0a1a3e, #0a0a2e)',
          'background-size': '300% 300%'
        });
        return '.ze-anim-bg{animation:ze-bg-shift 8s ease infinite}@keyframes ze-bg-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}';
      }
    },

    {
      id: 'mesh-gradient-bg',
      name: 'Mesh Gradient BG',
      description: 'Layered radial gradients create an organic, multi-blob mesh effect. High-end SaaS aesthetic.',
      category: 'section',
      tier: 'premium',
      targets: 'Sections, outer divs',
      previewHtml: '<div class="preview-section-box" style="border-radius:12px;background:#0a0a0f;background-image:radial-gradient(at 20% 30%,rgba(124,58,237,0.15) 0%,transparent 50%),radial-gradient(at 80% 70%,rgba(59,130,246,0.12) 0%,transparent 50%),radial-gradient(at 50% 50%,rgba(16,185,129,0.08) 0%,transparent 60%);"></div>',
      previewCss: '',
      apply: function (doc) {
        var el = findTarget(doc, ['[data-component="section"]','section','div[data-component]','div']);
        if (!el) return '';
        mergeStyle(el, {
          'background-color': '#0a0a0f',
          'background-image': 'radial-gradient(at 20% 30%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(at 80% 70%, rgba(59,130,246,0.12) 0%, transparent 50%), radial-gradient(at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)'
        });
        return '';
      }
    },

    {
      id: 'aurora-bg',
      name: 'Aurora Background',
      description: 'Animated aurora borealis effect with shifting soft color blobs. Stunning hero section backdrop.',
      category: 'section',
      tier: 'premium',
      targets: 'Sections, outer divs',
      previewHtml: '<div class="ze-aurora preview-section-box" style="border-radius:12px;background:#0a0a0f;position:relative;overflow:hidden;"></div>',
      previewCss: '.ze-aurora::before,.ze-aurora::after{content:"";position:absolute;border-radius:50%;filter:blur(40px);opacity:0.4;animation:ze-aurora-move 8s ease-in-out infinite alternate}.ze-aurora::before{width:60%;height:60%;top:-10%;left:-10%;background:rgba(124,58,237,0.3)}.ze-aurora::after{width:50%;height:50%;bottom:-10%;right:-10%;background:rgba(59,130,246,0.25);animation-delay:-4s}@keyframes ze-aurora-move{0%{transform:translate(0,0) scale(1)}100%{transform:translate(20px,15px) scale(1.1)}}',
      apply: function (doc) {
        var el = findTarget(doc, ['[data-component="section"]','section','div[data-component]','div']);
        if (!el) return '';
        addClass(el, 'ze-aurora');
        mergeStyle(el, { 'position': 'relative', 'overflow': 'hidden' });
        return '.ze-aurora::before,.ze-aurora::after{content:"";position:absolute;border-radius:50%;filter:blur(60px);opacity:0.35;pointer-events:none;animation:ze-aurora-move 10s ease-in-out infinite alternate}.ze-aurora::before{width:50%;height:50%;top:-10%;left:-10%;background:rgba(124,58,237,0.35)}.ze-aurora::after{width:40%;height:40%;bottom:-10%;right:-10%;background:rgba(59,130,246,0.3);animation-delay:-5s}@keyframes ze-aurora-move{0%{transform:translate(0,0) scale(1)}100%{transform:translate(30px,20px) scale(1.15)}}';
      }
    },

    {
      id: 'noise-texture-bg',
      name: 'Subtle Noise Texture',
      description: 'Overlay a fine-grain noise texture on sections for depth and tactile quality. Removes the "flat" feel.',
      category: 'section',
      tier: 'free',
      targets: 'Sections, outer divs',
      previewHtml: '<div class="ze-noise preview-section-box" style="border-radius:12px;background:#111118;position:relative;overflow:hidden;"></div>',
      previewCss: '.ze-noise::after{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E");opacity:0.5;pointer-events:none;border-radius:inherit}',
      apply: function (doc) {
        var el = findTarget(doc, ['[data-component="section"]','section','div[data-component]','div']);
        if (!el) return '';
        addClass(el, 'ze-noise');
        mergeStyle(el, { 'position': 'relative' });
        return '.ze-noise::after{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E");opacity:0.5;pointer-events:none;border-radius:inherit;z-index:1}';
      }
    },

    /* ───────── ANIMATION EFFECTS ───────── */

    {
      id: 'fade-in',
      name: 'Fade In',
      description: 'Smooth opacity fade-in entrance animation. Works on any element.',
      category: 'animation',
      tier: 'free',
      targets: 'Any element',
      previewHtml: '<span class="ze-fade-in preview-text" style="color:#f1f5f9;">Fade In</span>',
      previewCss: '.ze-fade-in{animation:ze-fade 1.2s ease both}@keyframes ze-fade{from{opacity:0}to{opacity:1}}',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3','p','div[data-component]','img','a','button','div']);
        if (!el) return '';
        addClass(el, 'ze-fade-in');
        return '.ze-fade-in{animation:ze-fade 1s ease both}@keyframes ze-fade{from{opacity:0}to{opacity:1}}';
      }
    },

    {
      id: 'slide-in-left',
      name: 'Slide In Left',
      description: 'Element slides in from the left with a subtle fade. Directional entrance animation.',
      category: 'animation',
      tier: 'free',
      targets: 'Any element',
      previewHtml: '<span class="ze-slide-left preview-text" style="color:#f1f5f9;">Slide In</span>',
      previewCss: '.ze-slide-left{animation:ze-sl-left 0.8s cubic-bezier(0.16,1,0.3,1) both}@keyframes ze-sl-left{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3','p','div[data-component]','img','a','button','div']);
        if (!el) return '';
        addClass(el, 'ze-slide-left');
        return '.ze-slide-left{animation:ze-sl-left 0.8s cubic-bezier(0.16,1,0.3,1) both}@keyframes ze-sl-left{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}';
      }
    },

    {
      id: 'bounce-entrance',
      name: 'Bounce Entrance',
      description: 'Playful bounce animation as the element enters the viewport. Adds energy and personality.',
      category: 'animation',
      tier: 'premium',
      targets: 'Any element',
      previewHtml: '<span class="ze-bounce preview-text" style="color:#f1f5f9;">Bounce</span>',
      previewCss: '.ze-bounce{animation:ze-bounce-in 0.8s cubic-bezier(0.34,1.56,0.64,1) both}@keyframes ze-bounce-in{0%{opacity:0;transform:scale(0.3)}50%{transform:scale(1.05)}70%{transform:scale(0.95)}100%{opacity:1;transform:scale(1)}}',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3','p','div[data-component]','img','a','button','div']);
        if (!el) return '';
        addClass(el, 'ze-bounce');
        return '.ze-bounce{animation:ze-bounce-in 0.8s cubic-bezier(0.34,1.56,0.64,1) both}@keyframes ze-bounce-in{0%{opacity:0;transform:scale(0.3)}50%{transform:scale(1.05)}70%{transform:scale(0.95)}100%{opacity:1;transform:scale(1)}}';
      }
    },

    {
      id: 'scale-up',
      name: 'Scale Up Entrance',
      description: 'Element grows from a smaller size to full size with a smooth ease. Clean and professional.',
      category: 'animation',
      tier: 'free',
      targets: 'Any element',
      previewHtml: '<span class="ze-scale-up preview-text" style="color:#f1f5f9;">Scale Up</span>',
      previewCss: '.ze-scale-up{animation:ze-scale 0.7s cubic-bezier(0.16,1,0.3,1) both}@keyframes ze-scale{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3','p','div[data-component]','img','a','button','div']);
        if (!el) return '';
        addClass(el, 'ze-scale-up');
        return '.ze-scale-up{animation:ze-scale 0.7s cubic-bezier(0.16,1,0.3,1) both}@keyframes ze-scale{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}';
      }
    },

    {
      id: 'rotate-in',
      name: 'Rotate In',
      description: 'Element rotates and fades in from a slight angle. Unique and attention-grabbing.',
      category: 'animation',
      tier: 'premium',
      targets: 'Any element',
      previewHtml: '<span class="ze-rotate-in preview-text" style="color:#f1f5f9;">Rotate</span>',
      previewCss: '.ze-rotate-in{animation:ze-rot-in 0.8s cubic-bezier(0.16,1,0.3,1) both}@keyframes ze-rot-in{from{opacity:0;transform:rotate(-8deg) scale(0.9)}to{opacity:1;transform:rotate(0) scale(1)}}',
      apply: function (doc) {
        var el = findTarget(doc, ['h1','h2','h3','p','div[data-component]','img','a','button','div']);
        if (!el) return '';
        addClass(el, 'ze-rotate-in');
        return '.ze-rotate-in{animation:ze-rot-in 0.8s cubic-bezier(0.16,1,0.3,1) both}@keyframes ze-rot-in{from{opacity:0;transform:rotate(-8deg) scale(0.9)}to{opacity:1;transform:rotate(0) scale(1)}}';
      }
    }
  ];

  /* ══════════════════════════════════════════════════════════
     PUBLIC API
     ══════════════════════════════════════════════════════════ */

  /**
   * Apply an effect to raw HTML string.
   * Returns { html: string, success: boolean, error?: string }
   */
  function applyEffect(htmlStr, effectId) {
    var effect = effects.find(function (e) { return e.id === effectId; });
    if (!effect) return { html: htmlStr, success: false, error: 'Effect not found.' };

    try {
      var parser = new DOMParser();
      var doc = parser.parseFromString('<div id="ze-root">' + htmlStr + '</div>', 'text/html');
      var root = doc.getElementById('ze-root');
      if (!root || !root.innerHTML.trim()) {
        return { html: htmlStr, success: false, error: 'Could not parse the HTML. Please check your code.' };
      }

      var extraCss = effect.apply(doc);

      var output = root.innerHTML;

      /* Append <style> block if the effect generated extra CSS */
      if (extraCss && extraCss.trim()) {
        output += '\n\n<!-- ZenEnhance: ' + effect.name + ' -->\n<style>\n' + extraCss.trim() + '\n</style>';
      }

      return { html: output, success: true };
    } catch (err) {
      return { html: htmlStr, success: false, error: 'Transform error: ' + err.message };
    }
  }

  return {
    list: effects,
    apply: applyEffect
  };

})();
