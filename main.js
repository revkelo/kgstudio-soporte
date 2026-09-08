/* ============================================================
   Reinicia - landing
   ============================================================ */

// Los datos viven en datos.js, que también carga la hoja de tarjetas.
const D = window.REINICIA;

/*
 * El numero y la torre salen de datos.js y de ningun otro sitio.
 *
 * Antes se podian sobreescribir desde localStorage, para que el editor de
 * ?editar dejara ver el cambio antes de publicarlo. El editor se fue con la
 * tarjeta, asi que ya nadie escribe esa clave; leerla solo dejaba una mina:
 * un valor viejo guardado en un navegador seguiria pisando a datos.js para
 * siempre, y en el navegador de Kevin, que es el unico que lo uso.
 */
const estado = { whatsapp: D.whatsapp, torre: D.torre };

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

/*
 * La torre del vecino, que se nombra en la seccion de confianza. Lo unico
 * que sobrevive de lo que pintaba la tarjeta: el resto -el reverso, el QR,
 * el archivo de contacto y el editor de ?editar- se fue con ella.
 *
 * El numero y la torre siguen saliendo de datos.js, que es donde se cambian
 * para que queden publicados. Las tarjetas se imprimen desde tarjetas.html,
 * que tiene sus propios estilos y no depende de esta pagina.
 */
function pintarTorre() {
  const torre = el('torreTexto');
  if (torre) torre.textContent = textoTorre();
}

function pintarTodo() {
  pintarContacto();
  pintarTorre();
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

/* ── La secuencia con scroll ──────────────────────────────────────
 *
 * Traduce lo que se ha scrolleado dentro de la seccion en un numero de
 * cuadro, y lo escribe en un atributo. Todo lo que se ve -que salga la
 * tapa, que se vaya el polvo, que gire el ventilador- lo decide el CSS a
 * partir de ese atributo.
 *
 * Se hace asi y no pintando a mano en cada evento de scroll por dos
 * razones. Una, que el navegador anima las transiciones mejor de lo que
 * las animaria un bucle en JavaScript. Y dos, que el estado de la seccion
 * es UN dato que se puede leer en el inspector, en vez de estar repartido
 * entre veinte estilos en linea.
 */
(function secuencia() {
  const seccion = document.getElementById('mantenimiento');
  if (!seccion) return;

  const alto = seccion.querySelector('.secuencia-alto');
  const pasos = [...seccion.querySelectorAll('.secuencia-pasos li')];
  const CUADROS = pasos.length;

  // Con movimiento reducido la seccion no se pega ni avanza: el CSS ya la
  // deja como una lista de pasos con el equipo abierto. Escribir el cuadro
  // aqui la volveria a mover.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let pedido = false;

  function pintar() {
    pedido = false;
    const caja = alto.getBoundingClientRect();
    const recorrido = alto.offsetHeight - window.innerHeight;
    if (recorrido <= 0) return;

    // 0 cuando la seccion toca el borde de arriba, 1 cuando termina
    const avance = Math.min(1, Math.max(0, -caja.top / recorrido));

    /*
     * El ultimo cuadro necesita su propio tramo de scroll o pasaria en un
     * pixel: por eso se reparte en CUADROS tramos y no en CUADROS - 1.
     */
    const cuadro = Math.min(CUADROS - 1, Math.floor(avance * CUADROS));

    if (seccion.dataset.paso !== String(cuadro)) {
      seccion.dataset.paso = String(cuadro);
      pasos.forEach((li, i) => {
        li.classList.toggle('activo', i === cuadro);
        li.classList.toggle('hecho', i < cuadro);
      });
    }
    seccion.style.setProperty('--avance', avance.toFixed(3));
  }

  function pedir() {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(pintar);
  }

  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  pintar();
})();
