# WIEBKE — Sitio institucional

Sitio de una sola página para **Hermann Wiebke · Abogado** (La Plata, Buenos Aires).
Derecho, urbanismo y operaciones inmobiliarias.

Estático puro: HTML, CSS y unas pocas líneas de JavaScript. **Sin build, sin
dependencias, sin runtime.** Se despliega copiando archivos.

---

## Estructura

```
index.html          El sitio
styles.css          Sistema visual completo
logos/              Los cuatro PNG de marca entregados
react/              Misma página como componentes, para el proyecto RSC actual
docs/               Comparación tipográfica (herramienta interna de decisión)
```

## Ver en local

```bash
python -m http.server 5178
```

Y abrir `http://localhost:5178`.

---

## Despliegue en CloudPanel

Tipo de sitio: **Static HTML Site**. No hace falta PHP, Node ni Python: no hay
nada que interpretar en el servidor.

1. En CloudPanel: `+ Add Site` → **Create a Static HTML Site**.
2. Dominio: el definitivo (o un subdominio para probar).
3. Subir el contenido de este repositorio a la raíz del sitio
   (`/home/<usuario>/htdocs/<dominio>/`), de modo que `index.html` quede
   directamente ahí — no dentro de una subcarpeta.
4. Emitir el certificado con **Let's Encrypt** desde la pestaña SSL/TLS.
5. Configurar la redirección definitiva entre `www` y sin `www`.

Con git en el servidor:

```bash
cd /home/<usuario>/htdocs/<dominio>
git clone https://github.com/tomsonArrua7/estudiowiebke.git .
```

Para actualizar: `git pull`. No hay que reconstruir nada.

### Caché: sellar antes de commitear

CloudPanel sirve los estáticos con `Cache-Control: max-age=315360000` —diez
años— y Cloudflare los guarda en el borde. `index.html` no se cachea
(`cf-cache-status: DYNAMIC`), pero `styles.css` sí, así que tras un
despliegue la página puede quedar con **marcado nuevo y estilos viejos**.
Pasó el 9/9/2026.

Por eso cada referencia local lleva `?v=<huella del contenido>`. Después de
tocar CSS o imágenes, y **antes de commitear**:

```bash
python tools/sellar-cache.py
```

Si el archivo cambió, cambia su URL y el caché se renueva solo. Si no
cambió, la URL es idéntica y los diez años juegan a favor. Sólo hay que
purgar Cloudflare a mano si alguna vez se olvida este paso.

---

## Dominio

`estudiowiebke.com.ar` — ya escrito en `index.html` (canonical, `og:url`,
`og:image`, `twitter:image`), en `react/Page.jsx`, en `robots.txt` y en
`sitemap.xml`. La forma canónica es **sin `www`**: la redirección de
`www` hacia el dominio pelado se configura en CloudPanel.

Si el dominio cambiara:

```bash
grep -rl estudiowiebke.com.ar --include='*.html' --include='*.jsx'      --include='*.xml' --include='*.txt' . | xargs sed -i 's|estudiowiebke.com.ar|NUEVO|g'
```

## Después de publicar

1. Emitir el certificado con Let's Encrypt (pestaña SSL/TLS) y forzar HTTPS.
2. Configurar la redirección `www` → sin `www`.
3. Validar la vista previa al compartir. **Ambas herramientas cachean**, así
   que si más adelante cambia `og.png` hay que forzar el refresco desde ahí:
   - <https://developers.facebook.com/tools/debug/> — sirve también para WhatsApp
   - <https://www.linkedin.com/post-inspector/>
4. Alta en Google: verificar la propiedad en
   [Search Console](https://search.google.com/search-console), enviar
   `https://estudiowiebke.com.ar/sitemap.xml` y pedir la indexación de la
   portada. Sin esto el sitio tarda semanas en aparecer.

## Imágenes generadas

`og.png` y los iconos se construyen con `tools/generar-imagenes.py`, a partir
de los PNG de `logos/` e Inter variable. Para rehacerlos:

```bash
python tools/generar-imagenes.py
```

| Archivo                 | Medida    | Uso                                  |
| ----------------------- | --------- | ------------------------------------ |
| `og.png`                | 1200×630  | Vista previa al compartir            |
| `favicon.png`           | 512×512   | Icono general                        |
| `favicon-32.png`        | 32×32     | Pestaña del navegador                |
| `apple-touch-icon.png`  | 180×180   | Pantalla de inicio en iOS            |

**Panorámica.** `fotos/panoramica-*.{webp,jpg}` salen de
`tools/generar-panoramica.py`. El barrido se hace con `transform`, no con
`background-position`: éste último obliga a repintar la banda entera en cada
cuadro, mientras que el primero lo resuelve la GPU. La imagen se lleva al
118 % del ancho para que exista sobrante por donde barrer, y el recorrido de
15,254 % (= 18/118) termina justo al ras del borde derecho. La animación se
pausa cuando la banda no está a la vista y se desactiva con
`prefers-reduced-motion`.

El monograma HW es apaisado y de trazo fino: por debajo de 24 px pierde
definición. Es una limitación de la marca, no del archivo.

## Notas de mantenimiento

**Tipografía.** El sitio usa **Inter** variable con eje óptico, servida desde
Google Fonts. El brief original pedía Helvetica Neue, que en Windows degrada a
Arial y en Android a Roboto; se cambió para que todo el público vea la misma
composición. Sustituirla por una licenciada (Neue Haas Grotesk, Söhne) es
cambiar `--font-sans` en `styles.css` y la carga en `index.html`: ninguna otra
regla depende del nombre.

**Paleta cerrada.** Sólo los seis colores del manual y alfas de ellos. Sin
verdes, dorados, degradados ni sombras.

**Times New Roman Italic.** Reservada a **tres** expresiones y marcada con la
clase `.editorial`: «proyectos.», «y arquitectura» y «tu situación.».
No agregar una cuarta sin aprobación de marca.

**Portada.** El brief v2 retiró el bloque «Derecho / Urbanismo» y el
antetítulo «Asesoramiento jurídico». La columna derecha de la portada no se
reemplazó por nada: el tercio derecho queda vacío a propósito.
