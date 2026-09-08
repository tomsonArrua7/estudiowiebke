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

---

## Pendientes antes de salir a producción

- [ ] **`og.png`** — la vista previa al compartir en WhatsApp, LinkedIn e
      Instagram. `index.html` la referencia pero **el archivo no existe**:
      hoy los enlaces se comparten sin imagen. Formato 1200×630.
- [ ] **`favicon.png`** — también referenciado y ausente.
- [ ] Revisar que las etiquetas `og:image` y `twitter:image` apunten al
      dominio definitivo (ver el `TODO` en `index.html`).

## Notas de mantenimiento

**Tipografía.** El sitio usa **Inter** variable con eje óptico, servida desde
Google Fonts. El brief original pedía Helvetica Neue, que en Windows degrada a
Arial y en Android a Roboto; se cambió para que todo el público vea la misma
composición. Sustituirla por una licenciada (Neue Haas Grotesk, Söhne) es
cambiar `--font-sans` en `styles.css` y la carga en `index.html`: ninguna otra
regla depende del nombre.

**Paleta cerrada.** Sólo los seis colores del manual y alfas de ellos. Sin
verdes, dorados, degradados ni sombras.

**Times New Roman Italic.** Reservada a cuatro expresiones y marcada con la
clase `.editorial`: «claridad.», «Criterio, estructura y medida.»,
«y arquitectura» y «tu situación.». No agregar una quinta sin aprobación
de marca.
