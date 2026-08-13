/*
 * Selector de síntomas: arma el mensaje de WhatsApp mientras el visitante
 * elige, y lo aplica a todos los enlaces marcados con [data-wa].
 *
 * Los que traen data-msg propio (barra, cierre, botón flotante) mandan
 * siempre el mensaje genérico: quien los usa no pasó por el selector.
 */

// ── Único dato que hay que cambiar: número en formato internacional,
//    sin +, sin espacios ni guiones. Colombia = 57 + celular.
const WHATSAPP = '57XXXXXXXXXX';

const GENERIC = 'Hola Kevin, necesito ayuda con mi computador.';

function waLink(message) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

const preview = document.getElementById('preview');
const mainCta = document.getElementById('mainCta');
const chips = Array.from(document.querySelectorAll('.chip'));

let selected = null;

function currentMessage() {
  if (!selected) return GENERIC;
  return `Hola Kevin, mi computador ${selected}. ¿Me ayudas?`;
}

function render() {
  const message = currentMessage();
  if (preview) preview.textContent = message;
  if (mainCta) mainCta.href = waLink(message);
}

chips.forEach((chip) => {
  chip.setAttribute('aria-pressed', 'false');
  chip.addEventListener('click', () => {
    const symptom = chip.dataset.symptom || null;
    // Volver a tocar el mismo chip lo deselecciona.
    selected = selected === symptom ? null : symptom;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.symptom === selected)));
    render();
  });
});

// Enlaces con mensaje fijo.
document.querySelectorAll('[data-wa][data-msg]').forEach((el) => {
  el.href = waLink(el.dataset.msg || GENERIC);
});

render();
