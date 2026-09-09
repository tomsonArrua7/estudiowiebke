"""
WIEBKE — Panorámica de La Plata.

Prepara la toma panorámica de la catedral para la banda con movimiento.

CRITERIO
La imagen entra a color, sin duotonar. Se puede porque su propia luz ya cae
dentro del sistema: el resplandor del poniente ronda el Burning Flame del
manual y el cielo tira al Abyssal. Lo que la integra no es un filtro sino el
velo Abyssal en degradado que lleva encima en el CSS, que además refuerza la
dirección de luz que la foto ya tiene —oscura a la izquierda, abierta a la
derecha.

FORMATOS
WebP como principal y JPEG de respaldo. El PNG original pesa 1,8 MB, que es
nueve veces el sitio entero: impensable para una banda decorativa.

Uso:  python tools/generar-panoramica.py
"""

import os
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEN = os.path.join(RAIZ, "fotos", "panoramica-original.png")
SALIDA = os.path.join(RAIZ, "fotos")


def exportar(im, nombre, **opts):
    ruta = os.path.join(SALIDA, nombre)
    im.save(ruta, **opts)
    return ruta, os.path.getsize(ruta)


if __name__ == "__main__":
    im = Image.open(ORIGEN).convert("RGB")
    print(f"Origen: {im.size[0]}×{im.size[1]}")

    piezas = []

    # Escritorio: resolución nativa. No se amplía en el archivo; el zoom que
    # necesita el barrido lo hace el CSS.
    piezas.append(("panoramica.webp", im, dict(format="WEBP", quality=82, method=6)))
    piezas.append(("panoramica.jpg", im, dict(format="JPEG", quality=84,
                                              optimize=True, progressive=True)))

    # Celular: la mitad de ancho basta y pesa un cuarto.
    chica = im.resize((992, round(992 * im.size[1] / im.size[0])), Image.LANCZOS)
    piezas.append(("panoramica-movil.webp", chica,
                   dict(format="WEBP", quality=80, method=6)))
    piezas.append(("panoramica-movil.jpg", chica,
                   dict(format="JPEG", quality=82, optimize=True, progressive=True)))

    print("Generando…")
    for nombre, img, opts in piezas:
        ruta, peso = exportar(img, nombre, **opts)
        print(f"  {nombre:<26} {img.size[0]}×{img.size[1]}  {peso//1024} KB")
