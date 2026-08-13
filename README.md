# KG Studio Soporte

Landing del servicio técnico de computadores: <https://pc.kgstudio.top>

Sitio estático puro (HTML + CSS + JS, sin build) desplegado en Vercel. Cada push a `main`
publica en producción.

## Cambiar el número de WhatsApp

Está en una sola constante, al inicio de `main.js`:

```js
const WHATSAPP = '57XXXXXXXXXX';
```

Formato internacional, sin `+`, espacios ni guiones. Colombia es `57` seguido del celular.

## Cómo está armado

| Archivo | Qué hace |
| --- | --- |
| `index.html` | Todo el contenido de la página |
| `styles.css` | Estilos y tokens de color/tipografía |
| `main.js` | Selector de síntomas → arma el mensaje de WhatsApp |

El selector de síntomas del hero compone el texto que llega por WhatsApp, así el
mensaje ya trae el problema descrito. Para agregar un síntoma nuevo basta con
otro botón en `index.html`:

```html
<button type="button" class="chip" data-symptom="no conecta al wifi">No conecta al wifi</button>
```

El valor de `data-symptom` se inserta en la frase `Hola Kevin, mi computador <symptom>. ¿Me ayudas?`,
así que se escribe en tercera persona y sin punto final.

## Ver en local

Cualquier servidor estático sirve:

```bash
python -m http.server 8000
```

## Dominio

`pc.kgstudio.top` está asignado a este proyecto en Vercel. El DNS de `kgstudio.top`
también vive en Vercel (nameservers `ns1/ns2.vercel-dns.com`), así que el subdominio
resuelve por el registro comodín y no necesita un registro propio. El certificado lo
emite Vercel automáticamente.
