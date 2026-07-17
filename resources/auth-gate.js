(function () {
  'use strict';

  // Change PASSWORD to update the passphrase for all users.
  // If you change it, bump STORAGE_KEY (e.g. 'rr_gate_v2') so
  // existing localStorage tokens are invalidated.
  const PASSWORD    = 'ring2026';
  const STORAGE_KEY = 'rr_gate_v1';

  function isRingResourcesPage() {
    // Ring Resources pages have a sidebar link to research_process_home;
    // public pages only reference it in the navbar, outside #quarto-sidebar.
    return !!document.querySelector('#quarto-sidebar a[href*="research_process_home"]');
  }

  function isUnlocked() {
    return localStorage.getItem(STORAGE_KEY) === '1';
  }

  function buildOverlay() {
    const el = document.createElement('div');
    el.id = 'rr-gate-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Team access required');
    el.innerHTML = `
      <div class="rr-gate-card">
        <img class="rr-gate-logo" src="resources/research_ring_logos/research_ring_circle.png" alt="Research Ring">
        <p class="rr-gate-eyebrow">ALERRT Center &middot; Texas State University</p>
        <h2 class="rr-gate-title">Research Ring</h2>
        <p class="rr-gate-subtitle">Team Resources</p>
        <div class="rr-gate-divider"></div>
        <p class="rr-gate-copy">This area contains internal resources for Research Ring team members.</p>
        <div class="rr-gate-field">
          <input
            id="rr-gate-input"
            class="rr-gate-input"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            spellcheck="false"
          >
          <button id="rr-gate-btn" class="rr-gate-btn">Unlock</button>
        </div>
        <p class="rr-gate-error" id="rr-gate-error" aria-live="polite">Incorrect password — try again.</p>
      </div>
    `;
    return el;
  }

  function activate() {
    const overlay = buildOverlay();
    document.body.appendChild(overlay);
    document.body.classList.add('rr-body-gated');

    requestAnimationFrame(() => overlay.classList.add('rr-gate-visible'));

    const input   = document.getElementById('rr-gate-input');
    const btn     = document.getElementById('rr-gate-btn');
    const errorEl = document.getElementById('rr-gate-error');
    const card    = overlay.querySelector('.rr-gate-card');

    function attempt() {
      if (input.value === PASSWORD) {
        localStorage.setItem(STORAGE_KEY, '1');
        overlay.classList.add('rr-gate-exiting');
        setTimeout(() => {
          overlay.remove();
          document.body.classList.remove('rr-body-gated');
        }, 400);
      } else {
        errorEl.classList.add('rr-gate-error-show');
        card.classList.add('rr-gate-shake');
        card.addEventListener('animationend', () => card.classList.remove('rr-gate-shake'), { once: true });
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') attempt();
      errorEl.classList.remove('rr-gate-error-show');
    });

    input.focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!isRingResourcesPage()) return;
    if (isUnlocked()) return;
    activate();
  });
})();
