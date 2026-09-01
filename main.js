/* ============================================================
   Reinicia - landing
   ============================================================ */

// Los datos viven en datos.js, que también carga la hoja de tarjetas.
const D = window.REINICIA;

/* ── Estado editable ──────────────────────────────────────────
 *
 * Con `?editar` puedo cambiar número y torre desde el navegador para
 * imprimir tarjetas ya mismo. Se guarda en este equipo, NO en el sitio:
 * lo publicado sigue siendo lo que diga datos.js. El aviso del formulario
 * lo dice, y por eso muestra la línea exacta que hay que pegar.
 */
const GUARDADO = 'reinicia:tarjeta';

function leerEstado() {
  const base = { whatsapp: D.whatsapp, torre: D.torre };
  try {
    return Object.assign(base, JSON.parse(localStorage.getItem(GUARDADO) || '{}'));
  } catch {
    return base;
  }
}

let estado = leerEstado();

const hayNumero = () => D.numeroValido(estado.whatsapp);

function enlaceContacto(mensaje) {
  const texto = mensaje || D.mensajeGenerico;
  if (hayNumero()) {
    return `https://wa.me/${estado.whatsapp}?text=${encodeURIComponent(texto)}`;
  }
  const asunto = encodeURIComponent('Mantenimiento de computador');
  return `mailto:${D.correo}?subject=${asunto}&body=${encodeURIComponent(texto)}`;
}

/* ── Botones de contacto ──────────────────────────────────────
 *
 * Sin número válido no se manda a nadie a un wa.me inexistente: el botón
 * pasa al correo y dice que va al correo. Un CTA que promete WhatsApp y
 * abre una pantalla de error de WhatsApp es peor que no tenerlo.
 */
function pintarContacto() {
  const wa = hayNumero();

  document.querySelectorAll('[data-wa]').forEach((el) => {
    el.href = enlaceContacto(el.dataset.msg);
    if (wa) {
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      el.removeAttribute('target');
      el.removeAttribute('rel');
    }

    // La etiqueta alterna se declara en el HTML, junto al texto que
    // reemplaza, para que el cambio sea legible sin leer este archivo.
    const alterna = el.dataset.alt;
    if (!alterna) return;
    const rotulo = el.querySelector('[data-rotulo]') || el;
    if (!rotulo.dataset.original) rotulo.dataset.original = rotulo.textContent.trim();
    rotulo.textContent = wa ? rotulo.dataset.original : alterna;
  });

  document.querySelectorAll('[data-solo-wa]').forEach((el) => {
    el.hidden = !wa;
  });
}

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

/* ── Tarjeta de presentación ──────────────────────────────────
 *
 * Se arma con los mismos datos que el resto de la página, así que no
 * puede quedar diciendo un número distinto al de los botones.
 */

function textoTorre() {
  return estado.torre ? `en la torre ${estado.torre}` : 'en el conjunto';
}

/** El contacto que se imprime en el reverso. */
function pintarDatosTarjeta() {
  const numero = D.numeroLegible(estado.whatsapp);
  const bcNumber = el('bcNumber');
  const bcWa = document.querySelector('.bc-wa');

  if (bcNumber) bcNumber.textContent = numero || D.correo;
  // Sin número, el glifo de WhatsApp mentiría sobre por dónde escribir.
  if (bcWa) bcWa.classList.toggle('correo', !numero);

  const badge = el('bcTorre');
  if (badge) badge.textContent = estado.torre ? `Torre ${estado.torre} · aquí mismo` : 'Aquí en tu conjunto';

  const torre = el('torreTexto');
  if (torre) torre.textContent = textoTorre();
}

/**
 * El QR apunta a WhatsApp si hay número y, si no, a esta misma página:
 * un código que no lleva a ninguna parte es peor que uno que lleva al
 * sitio, donde igual está el contacto.
 */
function pintarQR() {
  const caja = el('bcQr');
  if (!caja || typeof QRCode === 'undefined') return;

  const destino = hayNumero()
    ? enlaceContacto('Hola Kevin, quiero un mantenimiento.')
    : `https://${D.sitio}/`;

  caja.innerHTML = '';
  try {
    new QRCode(caja, {
      text: destino,
      width: 320,
      height: 320,
      colorDark: '#0E1A22',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M,
    });
  } catch {
    caja.innerHTML = '<span class="bc-qr-ph">QR no disponible</span>';
  }
}

/** Archivo de contacto que el teléfono abre solo. */
function pintarVcf() {
  const boton = el('saveVcf');
  if (!boton) return;

  const lineas = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Gonzalez;Kevin;;;',
    'FN:Kevin Gonzalez',
    'ORG:Reinicia - kgstudio',
    'TITLE:Ingeniero de sistemas',
  ];
  if (hayNumero()) lineas.push(`TEL;TYPE=CELL:+${estado.whatsapp}`);
  lineas.push(
    `EMAIL;TYPE=INTERNET:${D.correo}`,
    `URL:https://${D.sitio}`,
    `ADR;TYPE=WORK:;;${D.direccion};;;;Colombia`,
    'NOTE:Mantenimiento de computadores. Limpieza, pasta térmica y optimización.',
    'END:VCARD',
  );

  // Las líneas de un vCard van separadas por CRLF; con solo LF hay
  // teléfonos que se niegan a importarlo.
  const blob = new Blob([lineas.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
  if (boton.dataset.url) URL.revokeObjectURL(boton.dataset.url);
  boton.dataset.url = URL.createObjectURL(blob);
  boton.href = boton.dataset.url;
}

function pintarTodo() {
  pintarContacto();
  pintarDatosTarjeta();
  pintarQR();
  pintarVcf();
}

/* ── Voltear la tarjeta ───────────────────────────────────── */

const bcard = el('bcard');
const flipBtn = el('flipBtn');

if (bcard && flipBtn) {
  flipBtn.addEventListener('click', () => {
    const alReverso = !bcard.classList.contains('flipped');
    bcard.classList.toggle('flipped', alReverso);
    flipBtn.textContent = alReverso ? 'Ver el frente' : 'Ver el reverso';
    flipBtn.setAttribute('aria-pressed', String(alReverso));
  });
}

/* ── Editor (?editar) ─────────────────────────────────────── */

const editor = el('editor');

if (editor && new URLSearchParams(location.search).has('editar')) {
  editor.hidden = false;

  const inTel = el('inTel');
  const inTorre = el('inTorre');
  const codeLine = el('codeLine');

  inTel.value = (estado.whatsapp || '').replace(/^57/, '').replace(/X/g, '');
  inTorre.value = estado.torre || '';

  function aplicar() {
    const digitos = inTel.value.replace(/\D/g, '').slice(0, 10);
    estado = {
      whatsapp: digitos.length === 10 ? `57${digitos}` : D.whatsapp,
      torre: inTorre.value.trim(),
    };
    localStorage.setItem(GUARDADO, JSON.stringify(estado));
    codeLine.textContent = `whatsapp: '${estado.whatsapp}',`;
    pintarTodo();
  }

  editor.addEventListener('input', aplicar);
  editor.addEventListener('submit', (e) => e.preventDefault());
  aplicar();

  const copyCode = el('copyCode');
  copyCode.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(codeLine.textContent);
      copyCode.textContent = 'Copiado';
      setTimeout(() => { copyCode.textContent = 'Copiar'; }, 1600);
    } catch {
      copyCode.textContent = 'Cópialo a mano';
    }
  });
}

// Las tarjetas se imprimen desde su propia hoja, que ya está a tamaño
// real; imprimir esta página sacaría la landing entera.
const printBtn = el('printBtn');
if (printBtn) {
  printBtn.addEventListener('click', () => window.open('tarjetas.html', '_blank', 'noopener'));
}

pintarTodo();

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
