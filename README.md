# Reinicia

Mantenimiento de computadores para los vecinos del conjunto.
<https://reinicia.kgstudio.top> (también responde en `pc.kgstudio.top`).

Sitio estático puro (HTML + CSS + JS, sin build) desplegado en Vercel. Cada push a
`main` publica en producción.

## Pendientes antes de repartir tarjetas

| Dato | Dónde |
| --- | --- |
| Número de WhatsApp | `main.js` línea 8 y `tarjetas.html` (al final) |
| Número de torre | `index.html`, en la cita de la sección Confianza (`torre [X]`) |

```js
const WHATSAPP = '57XXXXXXXXXX';
```

Formato internacional, sin `+`, espacios ni guiones. Colombia es `57` seguido del
celular. En `tarjetas.html` el mismo número alimenta el QR y se muestra formateado solo.

## SEO local (Google Maps)

Esta es la página que tiene que aparecer cuando alguien busca "mantenimiento de
computadores Bogotá". El marcado del `<head>` declara el negocio con el mismo
`@id` que `kgstudio.top` y con el mismo nombre y dirección que la ficha de Google
Business: **kgstudio · Calle 155 #14-80, Bogotá D.C.** Los tres textos —ficha,
schema y pie de página— dicen exactamente lo mismo a propósito. Si cambias uno,
cambia los tres o Google deja de unir la ficha con el sitio.

Reinicia no se declara como otro negocio, sino como el `Service` que presta
kgstudio, con su catálogo de precios (60/50/30 mil). Cuando muevas un precio en
`index.html`, muévelo también en el `OfferCatalog`.

Pendientes que no se resuelven desde el código:

- Falta `og:image`: al compartir el enlace por WhatsApp sale sin miniatura. Basta
  una imagen de 1200×630 en la raíz y su `<meta property="og:image">`.
- Falta `telephone` en el schema hasta que exista el número del negocio.
- El `sameAs` ya cita la ficha por su MID (`/g/11zds2s_mr`); falta `hasMap` con
  el enlace directo al mapa.
- La página sigue sin reseñas, y así debe quedarse hasta tener clientes reales
  que las autoricen (ver más abajo).

## Archivos

| Archivo | Qué hace |
| --- | --- |
| `index.html` | La landing completa |
| `styles.css` | Estilos y tokens |
| `main.js` | Enlaces de WhatsApp, tarjeta de diagnóstico y aparición al scroll |
| `tarjetas.html` | Tarjetas de presentación 90×55 mm, listas para imprimir o exportar a PDF |
| `robots.txt` | Rastreo abierto menos las tarjetas, y ruta del sitemap |
| `sitemap.xml` | La portada, con el host canónico (`reinicia.`, no `pc.`) |

## La tarjeta de diagnóstico

Es la pieza central del hero: un interruptor **Antes / Después** que mueve tres barras
(temperatura, arranque, espacio) entre el estado de un equipo descuidado y el de uno
recién mantenido. Vende el resultado sin necesidad de explicarlo.

Las cifras son de un equipo típico, no medidas de un cliente real, y la propia tarjeta
lo dice al pie. Están en `main.js`, en el objeto `STATE`:

```js
const STATE = {
  despues: { temp: ['54°C', 30], ... },
  antes:   { temp: ['87°C', 94], ... },
};
```

Cada valor es `[texto, porcentaje de la barra]`.

## Sobre testimonios

La página **no** lleva reseñas. Cuando tengas clientes reales, pídeles una frase y su
nombre con autorización, y se agrega una sección con las de verdad. Publicar
testimonios inventados en una página que cobra por un servicio es engañar a quien
llega a contratarte.

## Tarjetas de presentación

Abre `/tarjetas.html`, revisa que el QR y el número estén bien, y usa **Imprimir →
Guardar como PDF**. Están a tamaño real (90 × 55 mm) con guía de corte punteada.
Para litografía, pide 3 mm de sangrado.

## Ver en local

```bash
python -m http.server 8000
```
