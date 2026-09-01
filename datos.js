/* ============================================================
   Reinicia - datos del negocio
   ------------------------------------------------------------
   El ÚNICO archivo que hay que tocar. Lo cargan la landing y la
   hoja de tarjetas, así que el número vive en un solo lugar: antes
   estaba escrito dos veces y era cuestión de tiempo que quedaran
   distintos, que es la peor forma de tener un número de contacto.
   ============================================================ */

window.REINICIA = {
  // Celular en formato internacional, sin +, espacios ni guiones.
  // Colombia = 57 seguido de los 10 dígitos. Mientras diga XXXX la
  // página cae al correo sola: nunca manda a un wa.me roto.
  whatsapp: '57XXXXXXXXXX',

  // Número de torre dentro del conjunto. Vacío = no se menciona.
  torre: '',

  correo: 'kgagudelo@gmail.com',
  sitio: 'reinicia.kgstudio.top',
  direccion: 'Calle 155 #14-80, Bogotá',
  handle: '@kagonzalezdev',

  mensajeGenerico: 'Hola Kevin, quiero agendar un mantenimiento de mi computador.',
};

/* ── Utilidades que ambas páginas comparten ────────────────── */

/** Un número servible son 57 + 10 dígitos. El placeholder no pasa. */
window.REINICIA.numeroValido = function (numero) {
  return /^57\d{10}$/.test(numero || window.REINICIA.whatsapp);
};

/** 573001234567 → "300 123 4567". Si no sirve, devuelve cadena vacía. */
window.REINICIA.numeroLegible = function (numero) {
  const n = numero || window.REINICIA.whatsapp;
  if (!window.REINICIA.numeroValido(n)) return '';
  const local = n.replace(/^57/, '');
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
};

/**
 * A dónde manda un botón de contacto. Con número, a WhatsApp; sin él,
 * al correo con el mismo mensaje ya escrito. El visitante siempre tiene
 * por dónde escribir.
 */
window.REINICIA.enlaceContacto = function (mensaje) {
  const texto = mensaje || window.REINICIA.mensajeGenerico;
  if (window.REINICIA.numeroValido()) {
    return `https://wa.me/${window.REINICIA.whatsapp}?text=${encodeURIComponent(texto)}`;
  }
  const asunto = encodeURIComponent('Mantenimiento de computador');
  return `mailto:${window.REINICIA.correo}?subject=${asunto}&body=${encodeURIComponent(texto)}`;
};
