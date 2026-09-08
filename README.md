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
y cambia su propio texto ("Escríbeme por correo" en vez de "por WhatsApp"). Un CTA
que promete WhatsApp y abre un error de WhatsApp es peor que no tenerlo.

El día que tengas el número, cambias esa línea y todo se reconecta solo.

## SEO local (Google Maps)

Esta es la página que tiene que aparecer cuando alguien busca "mantenimiento de
computadores Bogotá". El marcado del `<head>` declara el negocio con el mismo
`@id` que `kgstudio.top` y con el mismo nombre y dirección que la ficha de Google
Business: **kgstudio · Calle 155 #14-80, Bogotá D.C.** Los tres textos -ficha,
schema y pie de página- dicen exactamente lo mismo a propósito. Si cambias uno,
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
| `main.js` | Contacto, tarjeta de diagnóstico, la secuencia y las apariciones al scroll |
| `img/` | Las seis fotos, descargadas. Ver abajo |
| `tarjetas.html` | Tarjetas de presentación 90×55 mm, listas para imprimir o exportar a PDF |
| `robots.txt` | Rastreo abierto menos las tarjetas, y ruta del sitemap |
| `sitemap.xml` | La portada, con el host canónico (`reinicia.`, no `pc.`) |

## Las fotos

Tres, en `img/`, y cada una hace un trabajo que el texto no hacía:

| Archivo | Dónde | Qué enseña |
| --- | --- | --- |
| `placa-desmontada.jpg` | Qué incluye | Un portátil destapado de verdad, justo encima de la secuencia |
| `portatil-abierto.jpg` | Cómo funciona | Unas manos trabajando: el paso 03, que es el que el dueño del equipo no ve |
| `torre-ventilador.jpg` | Jornada del mes | Una torre abierta, en la mitad de la tarjeta que estaba vacía |
| `svc-portatil.jpg` | Servicios | La tarjeta de portátil |
| `svc-torre.jpg` | Servicios | La tarjeta de torre |
| `svc-software.jpg` | Servicios | La tarjeta de solo software |

Son de [Unsplash](https://unsplash.com/license), cuya licencia permite uso
comercial y no exige atribución.

**Están descargadas, no enlazadas.** Una foto servida desde el dominio de un
banco de imágenes es una petición a un tercero que se entera de quién visita el
sitio, y un enlace que se rompe el día que ese banco cambie de reglas o de
formato de URL. Pesan poco y viajan con el repo.

Todas llevan `width` y `height` en el HTML para que el navegador reserve el
hueco antes de descargarlas, y `loading="lazy"` porque ninguna está en la
primera pantalla. El `alt` describe lo que se ve, no repite el titular de al
lado.

## La secuencia

La sección **Qué le pasa a tu equipo mientras esperas** son seis cuadros que
avanzan con la rueda del ratón: la sección mide seis pantallas de alto y lo de
dentro se queda pegado arriba, así que scrollear no baja la página, pasa el
cuadro.

Los seis comparten el mismo chasis dibujado y lo único que cambia es qué capas
se ven: la tapa, los tornillos, lo de adentro, el polvo, la pasta vieja, la
pasta nueva y el termómetro. Es un solo dibujo con estados, no seis dibujos
sueltos, que es lo que se acaba contradiciendo cuando se retoca uno.

`main.js` no pinta nada: traduce lo scrolleado a un número de cuadro y lo
escribe en `data-paso` de la sección. Todo lo que se ve lo decide el CSS a
partir de ese atributo. Así el estado es **un** dato que se lee en el
inspector, y las transiciones las anima el navegador en vez de un bucle en
JavaScript.

El termómetro aparece dos veces, no una: caliente en el cuadro del hallazgo y
frío en el del cierre. Con una sola lectura no habría con qué compararla.

Con `prefers-reduced-motion` la sección no se pega ni avanza: se ve como lo
que es por debajo, una lista de seis pasos con el equipo abierto al lado.

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

Ya no están en la landing. Estaban en una sección propia con la tarjeta
dibujada a proporción real, el QR y un `.vcf`, y no sumaba: el contacto ya está
en la cabecera, en el titular y en el cierre, que es donde la gente lo busca.

Se imprimen desde `/tarjetas.html`, que es una hoja aparte con sus propios
estilos y no depende de la landing. Revisa que el QR y el número estén bien y
usa **Imprimir → Guardar como PDF**. Están a tamaño real (90 × 55 mm) con guía
de corte punteada. Para litografía, pide 3 mm de sangrado.

El número y la torre salen de `datos.js` y de ningún otro sitio. Antes se
podían sobreescribir con `?editar`, que guardaba el cambio en el navegador para
poder imprimir sin desplegar; ese editor se fue con la sección, y con él la
mina de que un valor viejo guardado en un navegador siguiera pisando a
`datos.js` para siempre.


## Ver en local

```bash
python -m http.server 8000
```
