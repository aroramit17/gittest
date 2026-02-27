/* ═══════════════════════════════════════════════════════════════════
   ZenEnhance — Dashboard Application Logic
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var effects = window.ZenEffects.list;
  var applyEffect = window.ZenEffects.apply;

  /* ── State ──────────────────────────────────────────── */
  var state = {
    user: null,          // { email, tier: 'free'|'premium' }
    activeCategory: 'all',
    searchQuery: '',
    selectedEffect: null // effect object
  };

  /* ── DOM refs ──────────────────────────────────────── */
  var dom = {
    loginOverlay: document.getElementById('login-overlay'),
    loginForm: document.getElementById('login-form'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    app: document.getElementById('app'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebar: document.getElementById('sidebar'),
    sidebarItems: document.querySelectorAll('.sidebar-item'),
    sidebarUpgrade: document.getElementById('sidebar-upgrade'),
    upgradeBtn: document.getElementById('upgrade-btn'),
    searchInput: document.getElementById('search-input'),
    userTier: document.getElementById('user-tier'),
    userEmailDisplay: document.getElementById('user-email-display'),
    logoutBtn: document.getElementById('logout-btn'),
    contentTitle: document.getElementById('content-title'),
    contentSubtitle: document.getElementById('content-subtitle'),
    effectsGrid: document.getElementById('effects-grid'),
    modal: document.getElementById('effect-modal'),
    modalClose: document.getElementById('modal-close'),
    modalPreview: document.getElementById('modal-preview'),
    modalName: document.getElementById('modal-effect-name'),
    modalDesc: document.getElementById('modal-effect-desc'),
    modalTargets: document.getElementById('modal-targets-info'),
    codeInput: document.getElementById('code-input'),
    codeOutput: document.getElementById('code-output'),
    clearInputBtn: document.getElementById('clear-input-btn'),
    applyBtn: document.getElementById('apply-effect-btn'),
    copyBtn: document.getElementById('copy-output-btn'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
  };

  /* ══════════════════════════════════════════════════════
     AUTH (localStorage-backed for MVP)
     ══════════════════════════════════════════════════════ */

  function getUsers() {
    try { return JSON.parse(localStorage.getItem('ze_users') || '{}'); }
    catch (e) { return {}; }
  }

  function saveUsers(users) {
    localStorage.setItem('ze_users', JSON.stringify(users));
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem('ze_session')); }
    catch (e) { return null; }
  }

  function saveSession(user) {
    localStorage.setItem('ze_session', JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem('ze_session');
  }

  function loginUser(email, password) {
    var users = getUsers();
    var u = users[email];
    if (!u) return { ok: false, msg: 'No account found. Click "Create Free Account" first.' };
    if (u.password !== password) return { ok: false, msg: 'Incorrect password.' };
    var session = { email: email, tier: u.tier || 'free' };
    saveSession(session);
    return { ok: true, user: session };
  }

  function registerUser(email, password) {
    if (!email || !password) return { ok: false, msg: 'Email and password are required.' };
    if (password.length < 4) return { ok: false, msg: 'Password must be at least 4 characters.' };
    var users = getUsers();
    if (users[email]) return { ok: false, msg: 'Account already exists. Sign in instead.' };
    users[email] = { password: password, tier: 'free' };
    saveUsers(users);
    var session = { email: email, tier: 'free' };
    saveSession(session);
    return { ok: true, user: session };
  }

  function upgradeToPremium() {
    if (!state.user) return;
    state.user.tier = 'premium';
    saveSession(state.user);
    var users = getUsers();
    if (users[state.user.email]) {
      users[state.user.email].tier = 'premium';
      saveUsers(users);
    }
    renderUserInfo();
    renderGrid();
    showToast('Upgraded to Premium! All effects unlocked.');
  }

  /* ══════════════════════════════════════════════════════
     RENDERING
     ══════════════════════════════════════════════════════ */

  function showApp() {
    dom.loginOverlay.classList.add('hidden');
    dom.app.classList.remove('hidden');
    renderUserInfo();
    updateSidebarCounts();
    renderGrid();
  }

  function showLogin() {
    dom.loginOverlay.classList.remove('hidden');
    dom.app.classList.add('hidden');
  }

  function renderUserInfo() {
    if (!state.user) return;
    dom.userEmailDisplay.textContent = state.user.email;
    dom.userTier.textContent = state.user.tier === 'premium' ? 'Pro' : 'Free';
    dom.userTier.className = 'tier-badge ' + (state.user.tier === 'premium' ? 'tier-premium' : 'tier-free');
    dom.sidebarUpgrade.style.display = state.user.tier === 'premium' ? 'none' : '';
  }

  /* ── Category titles ── */
  var categoryLabels = {
    all: 'All Effects',
    text: 'Text Effects',
    button: 'Button Effects',
    card: 'Card / Container Effects',
    image: 'Image Effects',
    section: 'Section / Background Effects',
    animation: 'Animation Effects'
  };

  var categoryDescs = {
    all: 'Select an effect, paste your Zenler block code, and get the enhanced version back.',
    text: 'Gradients, glows, typewriter, and reveal effects for headings and text.',
    button: 'Shimmer, glow, glass, and animated borders for CTA buttons.',
    card: 'Glassmorphism, neumorphism, tilt, and hover effects for containers.',
    image: 'Shadows, zoom, blur-reveal, and float effects for images.',
    section: 'Animated gradients, aurora, mesh, and noise textures for backgrounds.',
    animation: 'Entrance animations — fade, slide, bounce, scale, and rotate.'
  };

  function updateSidebarCounts() {
    var counts = { all: effects.length };
    effects.forEach(function (e) {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    Object.keys(counts).forEach(function (k) {
      var el = document.getElementById('count-' + k);
      if (el) el.textContent = counts[k];
    });
  }

  /* ── Grid ── */
  function getFilteredEffects() {
    return effects.filter(function (e) {
      var catMatch = state.activeCategory === 'all' || e.category === state.activeCategory;
      var searchMatch = !state.searchQuery ||
        e.name.toLowerCase().indexOf(state.searchQuery) !== -1 ||
        e.description.toLowerCase().indexOf(state.searchQuery) !== -1;
      return catMatch && searchMatch;
    });
  }

  function renderGrid() {
    var filtered = getFilteredEffects();
    dom.contentTitle.textContent = categoryLabels[state.activeCategory] || 'All Effects';
    dom.contentSubtitle.textContent = categoryDescs[state.activeCategory] || '';

    if (filtered.length === 0) {
      dom.effectsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);"><p style="font-size:15px;">No effects match your search.</p></div>';
      return;
    }

    var html = '';
    filtered.forEach(function (e) {
      var isLocked = e.tier === 'premium' && state.user && state.user.tier !== 'premium';
      var tierClass = e.tier === 'free' ? 'badge-free' : 'badge-premium';
      var tierLabel = e.tier === 'free' ? 'Free' : 'Pro';

      html += '<div class="effect-card" data-effect-id="' + e.id + '"' + (isLocked ? ' data-locked="true"' : '') + '>';
      html += '<div class="effect-card-preview">';

      /* Inject preview CSS scoped to this card */
      if (e.previewCss) {
        html += '<style>' + e.previewCss + '</style>';
      }
      html += e.previewHtml;

      if (isLocked) {
        html += '<div class="effect-card-lock"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>';
      }

      html += '</div>';
      html += '<div class="effect-card-body">';
      html += '<div class="effect-card-name">' + e.name + '</div>';
      html += '<div class="effect-card-desc">' + e.description + '</div>';
      html += '</div>';
      html += '<div class="effect-card-meta">';
      html += '<span class="effect-card-category">' + e.category + '</span>';
      html += '<span class="effect-card-tier ' + tierClass + '">' + tierLabel + '</span>';
      html += '</div>';
      html += '</div>';
    });

    dom.effectsGrid.innerHTML = html;

    /* Bind click handlers */
    dom.effectsGrid.querySelectorAll('.effect-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var id = card.getAttribute('data-effect-id');
        var locked = card.getAttribute('data-locked') === 'true';
        if (locked) {
          showToast('This is a Pro effect. Upgrade to unlock it.');
          return;
        }
        openModal(id);
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     MODAL
     ══════════════════════════════════════════════════════ */

  function openModal(effectId) {
    var effect = effects.find(function (e) { return e.id === effectId; });
    if (!effect) return;

    state.selectedEffect = effect;

    /* Preview */
    dom.modalPreview.innerHTML = '';
    if (effect.previewCss) {
      dom.modalPreview.innerHTML += '<style>' + effect.previewCss + '</style>';
    }
    dom.modalPreview.innerHTML += effect.previewHtml;

    dom.modalName.textContent = effect.name;
    dom.modalDesc.textContent = effect.description;
    dom.modalTargets.innerHTML = '<strong>Works on:</strong> ' + effect.targets;

    /* Reset code areas */
    dom.codeInput.value = '';
    dom.codeOutput.value = '';
    dom.applyBtn.disabled = true;
    dom.copyBtn.disabled = true;
    dom.copyBtn.classList.remove('copied');
    dom.copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';

    dom.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    /* Focus input */
    setTimeout(function () { dom.codeInput.focus(); }, 200);
  }

  function closeModal() {
    dom.modal.classList.add('hidden');
    document.body.style.overflow = '';
    state.selectedEffect = null;
  }

  /* ══════════════════════════════════════════════════════
     EFFECT APPLICATION
     ══════════════════════════════════════════════════════ */

  function handleApply() {
    if (!state.selectedEffect) return;
    var input = dom.codeInput.value.trim();
    if (!input) {
      showToast('Please paste your Zenler HTML code first.');
      return;
    }

    var result = applyEffect(input, state.selectedEffect.id);

    if (result.success) {
      dom.codeOutput.value = result.html;
      dom.copyBtn.disabled = false;
      showToast('Effect applied! Copy the enhanced code below.');
    } else {
      dom.codeOutput.value = '';
      dom.copyBtn.disabled = true;
      showToast(result.error || 'Could not apply effect.');
    }
  }

  function handleCopy() {
    var text = dom.codeOutput.value;
    if (!text) return;

    navigator.clipboard.writeText(text).then(function () {
      dom.copyBtn.classList.add('copied');
      dom.copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      showToast('Code copied to clipboard!');

      setTimeout(function () {
        dom.copyBtn.classList.remove('copied');
        dom.copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
      }, 2000);
    }).catch(function () {
      /* Fallback for older browsers */
      dom.codeOutput.select();
      document.execCommand('copy');
      showToast('Code copied!');
    });
  }

  /* ══════════════════════════════════════════════════════
     TOAST
     ══════════════════════════════════════════════════════ */

  var toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    dom.toastMessage.textContent = msg;
    dom.toast.classList.remove('hidden');
    /* Force reflow for animation */
    void dom.toast.offsetWidth;
    dom.toast.classList.add('visible');

    toastTimer = setTimeout(function () {
      dom.toast.classList.remove('visible');
      setTimeout(function () { dom.toast.classList.add('hidden'); }, 300);
    }, 3000);
  }

  /* ══════════════════════════════════════════════════════
     EVENT BINDING
     ══════════════════════════════════════════════════════ */

  function bindEvents() {
    /* Auth */
    dom.loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var res = loginUser(dom.loginEmail.value.trim(), dom.loginPassword.value);
      if (res.ok) {
        state.user = res.user;
        showApp();
      } else {
        showToast(res.msg);
      }
    });

    dom.registerBtn.addEventListener('click', function () {
      var res = registerUser(dom.loginEmail.value.trim(), dom.loginPassword.value);
      if (res.ok) {
        state.user = res.user;
        showApp();
        showToast('Account created! Welcome to ZenEnhance.');
      } else {
        showToast(res.msg);
      }
    });

    dom.logoutBtn.addEventListener('click', function () {
      clearSession();
      state.user = null;
      showLogin();
    });

    /* Upgrade */
    dom.upgradeBtn.addEventListener('click', function () {
      upgradeToPremium();
    });

    /* Sidebar category */
    dom.sidebarItems.forEach(function (item) {
      item.addEventListener('click', function () {
        dom.sidebarItems.forEach(function (i) { i.classList.remove('active'); });
        item.classList.add('active');
        state.activeCategory = item.getAttribute('data-category');
        renderGrid();

        /* Close sidebar on mobile */
        if (window.innerWidth <= 768) {
          dom.sidebar.classList.remove('open');
        }
      });
    });

    /* Mobile sidebar toggle */
    dom.sidebarToggle.addEventListener('click', function () {
      dom.sidebar.classList.toggle('open');
    });

    /* Close sidebar when clicking outside on mobile */
    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 768 &&
          dom.sidebar.classList.contains('open') &&
          !dom.sidebar.contains(e.target) &&
          !dom.sidebarToggle.contains(e.target)) {
        dom.sidebar.classList.remove('open');
      }
    });

    /* Search */
    dom.searchInput.addEventListener('input', function () {
      state.searchQuery = dom.searchInput.value.trim().toLowerCase();
      renderGrid();
    });

    /* Modal */
    dom.modalClose.addEventListener('click', closeModal);
    dom.modal.addEventListener('click', function (e) {
      if (e.target === dom.modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !dom.modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    /* Code input — enable Apply button when there's content */
    dom.codeInput.addEventListener('input', function () {
      dom.applyBtn.disabled = !dom.codeInput.value.trim();
    });

    dom.clearInputBtn.addEventListener('click', function () {
      dom.codeInput.value = '';
      dom.codeOutput.value = '';
      dom.applyBtn.disabled = true;
      dom.copyBtn.disabled = true;
    });

    dom.applyBtn.addEventListener('click', handleApply);
    dom.copyBtn.addEventListener('click', handleCopy);
  }

  /* ══════════════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════════════ */

  function init() {
    bindEvents();

    /* Check for existing session */
    var session = getSession();
    if (session && session.email) {
      state.user = session;
      showApp();
    } else {
      showLogin();
    }
  }

  /* Boot */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
