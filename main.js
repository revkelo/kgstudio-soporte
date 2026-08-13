/* ============================================================
   Reinicia — landing
   ============================================================ */

// ── Único dato que hay que cambiar: número en formato internacional,
//    sin +, sin espacios ni guiones. Colombia = 57 + celular.
const WHATSAPP = '57XXXXXXXXXX';

const GENERIC = 'Hola Kevin, quiero agendar un mantenimiento de mi computador.';

function waLink(message) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('[data-wa]').forEach((el) => {
  el.href = waLink(el.dataset.msg || GENERIC);
  el.target = '_blank';
  el.rel = 'noopener';
});

/* ── Tarjeta de diagnóstico ───────────────────────────────────
 *
 * Cifras de ejemplo de un equipo típico, no medidas de un cliente:
 * la nota al pie de la tarjeta lo dice para no vender un dato falso.
 * El valor está en dejar ver el contraste antes/después.
 */

const STATE = {
  despues: {
    temp: ['54°C', 30], boot: ['24 s', 18], disk: ['18.3 GB', 82],
    tone: 'cool', sub: 'Después del mantenimiento',
    title: 'Fresco y veloz', note: 'Listo para usar',
  },
  antes: {
    temp: ['87°C', 94], boot: ['2 m 14 s', 96], disk: ['0.4 GB', 6],
    tone: 'hot', sub: 'Antes del mantenimiento',
    title: 'Lento y caliente', note: 'Necesita mantenimiento',
  },
};

const ICONS = {
  cool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  hot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
};

const el = (id) => document.getElementById(id);

function render(key) {
  const s = STATE[key];
  const ok = s.tone === 'cool';
  const color = ok ? 'var(--teal)' : 'var(--amber)';

  [['vTemp', 'mTemp', s.temp], ['vBoot', 'mBoot', s.boot], ['vDisk', 'mDisk', s.disk]]
    .forEach(([valueId, meterId, [text, pct]]) => {
      const value = el(valueId);
      const meter = el(meterId);
      value.textContent = text;
      value.className = `row-val ${s.tone}`;
      meter.style.background = color;
      meter.style.width = `${pct}%`;
    });

  el('diagSub').textContent = s.sub;
  el('status').className = `diag-status${ok ? '' : ' hot'}`;
  el('statusIco').innerHTML = ICONS[s.tone];
  el('statusTitle').textContent = s.title;
  el('statusSub').textContent = s.note;

  el('btnDespues').classList.toggle('on', ok);
  el('btnAntes').classList.toggle('on', !ok);
  el('btnDespues').setAttribute('aria-pressed', String(ok));
  el('btnAntes').setAttribute('aria-pressed', String(!ok));
}

if (el('diag')) {
  el('btnAntes').addEventListener('click', () => render('antes'));
  el('btnDespues').addEventListener('click', () => render('despues'));

  // Las barras arrancan vacías y se llenan: el primer gesto de la página
  // es el propio equipo reportándose sano.
  ['mTemp', 'mBoot', 'mDisk'].forEach((id) => { el(id).style.width = '0'; });
  setTimeout(() => render('despues'), 250);
}

/* ── Aparición al hacer scroll ────────────────────────────── */

const reveals = document.querySelectorAll('.reveal');

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  reveals.forEach((n) => n.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  reveals.forEach((n) => io.observe(n));
}
