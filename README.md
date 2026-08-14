# Reinicia

Mantenimiento de computadores para los vecinos del conjunto.
<https://reinicia.kgstudio.top> (también responde en `pc.kgstudio.top`).

Sitio estático puro (HTML + CSS + JS, sin build) desplegado en Vercel. Cada push a
`main` publica en producción.

## Lo único que falta: el número

Todo sale de `datos.js`, y de ahí lo leen la landing y la hoja de tarjetas. Antes
estaba escrito en dos archivos, que es la forma segura de acabar repartiendo
tarjetas con un número viejo.

```js
whatsapp: '57XXXXXXXXXX',   // internacional, sin + ni espacios: 57 + celular
torre: '',                  // vacío = la página no menciona torre
```

**Mientras el número diga `XXXX`, la página no se rompe:** cada botón cae al correo
y cambia su propio texto ("Escríbeme por correo" en vez de "por WhatsApp"), el QR
apunta al sitio en lugar de a un chat inexistente y la tarjeta muestra el correo.
Un CTA que promete WhatsApp y abre un error de WhatsApp es peor que no tenerlo.

El día que tengas el número, cambias esa línea y todo se reconecta solo.

### Probar sin publicar

Abre la página con `?editar` al final y aparece un formulario para número y torre.
Cambia lo que ves **en ese navegador** (queda en `localStorage`), suficiente para
imprimir tarjetas ya mismo, y te muestra la línea exacta para pegar en `datos.js`
cuando quieras publicarlo.

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
| `datos.js` | Número, torre y contacto. **El único archivo con datos** |
| `main.js` | Contacto, tarjeta de diagnóstico, tarjeta de presentación y scroll |
| `qrcode.js` | Generador de QR (davidshimjs, MIT), servido desde aquí |
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

En la sección **Mi tarjeta** de la landing la tarjeta está dibujada a proporción
real (90 × 55 mm) y se voltea para ver el reverso. El visitante puede descargarse
un `.vcf` que su teléfono abre solo, o escanear el QR.

Todo lo de adentro se mide en `cqw` —porcentaje del ancho de la propia tarjeta—
en vez de en píxeles, así que la misma tarjeta sirve para la miniatura del móvil
y para la hoja de impresión sin una media query: se escala entera, como una foto,
en lugar de descuadrarse tipo por tipo.

Para imprimirlas, abre `/tarjetas.html`, revisa que el QR y el número estén bien,
y usa **Imprimir → Guardar como PDF**. Están a tamaño real con guía de corte
punteada. Para litografía, pide 3 mm de sangrado.

## Ver en local

```bash
python -m http.server 8000
```
