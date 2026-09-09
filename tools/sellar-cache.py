"""
WIEBKE — Sella los estáticos con una huella de contenido.

EL PROBLEMA QUE RESUELVE
CloudPanel sirve los estáticos con Cache-Control: max-age=315360000 —diez
años— y Cloudflare los guarda en el borde. Tras un despliegue, el HTML
llega nuevo (no se cachea: cf-cache-status DYNAMIC) pero el CSS sigue
siendo el viejo, así que la página se ve con marcado nuevo y estilos
antiguos. Pasó exactamente eso el 9/9/2026: Cloudflare servía un
styles.css de 29.872 bytes mientras el origen ya tenía uno de 33.391.

LA SOLUCIÓN
A cada referencia local se le añade ?v=<huella>, donde la huella son los
primeros 10 caracteres del SHA-256 del archivo. Si el archivo cambia,
cambia la URL, y tanto Cloudflare como el navegador la tratan como un
recurso nuevo. Si no cambia, la URL es idéntica y el caché de diez años
juega a favor.

No toca favicons ni og.png: esos los referencian servicios externos por
URL absoluta y conviene que sean estables.

Ejecutar SIEMPRE antes de commitear cambios en CSS o imágenes:

    python tools/sellar-cache.py
"""

import hashlib
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(RAIZ, "index.html")

# Rutas que se sellan. Se excluyen a propósito los iconos y og.png.
SELLABLES = re.compile(r'(?:styles\.css|fotos/[\w.-]+|logos/[\w.-]+)')


def huella(ruta_rel):
    ruta = os.path.join(RAIZ, ruta_rel)
    if not os.path.exists(ruta):
        return None
    with open(ruta, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()[:10]


def sellar(texto):
    cambios = []

    def reemplazo(m):
        # Atributo completo: href="…" | src="…" | srcset="…"
        attr, comilla, valor = m.group(1), m.group(2), m.group(3)
        limpio = valor.split("?")[0]
        if not SELLABLES.fullmatch(limpio):
            return m.group(0)
        h = huella(limpio)
        if not h:
            print(f"  AVISO: no existe {limpio}", file=sys.stderr)
            return m.group(0)
        nuevo = f"{limpio}?v={h}"
        if nuevo != valor:
            cambios.append((limpio, h))
        return f'{attr}={comilla}{nuevo}{comilla}'

    texto = re.sub(r'\b(href|src|srcset)=(["\'])([^"\']+)\2', reemplazo, texto)
    return texto, cambios


if __name__ == "__main__":
    original = open(HTML, encoding="utf-8").read()
    sellado, cambios = sellar(original)

    if sellado == original:
        print("Sin cambios: todas las huellas ya estaban al día.")
    else:
        open(HTML, "w", encoding="utf-8").write(sellado)
        print(f"index.html actualizado — {len(cambios)} referencias selladas:")
        for ruta, h in cambios:
            print(f"  {ruta:<34} v={h}")
