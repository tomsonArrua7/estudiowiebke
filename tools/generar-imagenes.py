"""
WIEBKE — Generador de la vista previa social y los iconos.

Reconstruye og.png, favicon.png, favicon-32.png y apple-touch-icon.png a
partir de los PNG de marca entregados y de Inter variable.

CRITERIOS
· Los logos se componen como activos gráficos: se escalan manteniendo su
  proporción original y no se reconstruyen tipográficamente.
· Fondo Abyssal. En una vista previa el contexto es ajeno —un chat, un
  muro—, así que la pieza necesita contraste propio; además es el
  tratamiento que el manual reserva a los bloques de máxima jerarquía.
· El acento sobre fondo oscuro es Burning Flame, no Truffle: sobre Abyssal,
  Truffle queda en 2,5:1 y resulta ilegible. Es la misma regla del sistema
  aplicada al soporte oscuro.
· El tracking se dibuja carácter a carácter porque Pillow no lo implementa.

Uso:  python tools/generar-imagenes.py
"""

import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---- Paleta (06 / IDENTIDAD VISUAL) --------------------------------------
PALLADIAN = (238, 233, 223)
ABYSSAL = (27, 38, 50)
BURNING_FLAME = (255, 177, 98)

def palladian(alfa):
    """Palladian mezclado sobre Abyssal, para filetes y textos secundarios."""
    return tuple(round(alfa * p + (1 - alfa) * a) for p, a in zip(PALLADIAN, ABYSSAL))

# ---- Tipografías ---------------------------------------------------------
INTER_URL = ("https://raw.githubusercontent.com/google/fonts/main/ofl/"
             "inter/Inter%5Bopsz%2Cwght%5D.ttf")
INTER_TTF = os.path.join(RAIZ, "tools", "InterVar.ttf")
TIMES_ITALIC = r"C:\Windows\Fonts\timesi.ttf"


def inter(tamano, peso=400, opsz=32):
    if not os.path.exists(INTER_TTF):
        print("  descargando Inter…")
        urllib.request.urlretrieve(INTER_URL, INTER_TTF)
    f = ImageFont.truetype(INTER_TTF, tamano)
    f.set_variation_by_axes([float(opsz), float(peso)])
    return f


def texto_trackeado(draw, xy, texto, fuente, color, tracking=0.0):
    """Dibuja con espaciado entre caracteres y devuelve el ancho total."""
    x, y = xy
    inicio = x
    for ch in texto:
        if draw is not None:
            draw.text((x, y), ch, font=fuente, fill=color)
        x += fuente.getlength(ch) + tracking
    return x - tracking - inicio


def ancho_trackeado(texto, fuente, tracking=0.0):
    return texto_trackeado(None, (0, 0), texto, fuente, None, tracking)


def logo(nombre, ancho):
    img = Image.open(os.path.join(RAIZ, "logos", nombre)).convert("RGBA")
    alto = round(ancho * img.height / img.width)      # proporción intacta
    return img.resize((ancho, alto), Image.LANCZOS)


# ==========================================================================
#  og.png — 1200 × 630, la medida que piden WhatsApp, LinkedIn y X
# ==========================================================================

def construir_og():
    W, H = 1200, 630
    MARGEN = 92
    lienzo = Image.new("RGB", (W, H), ABYSSAL)
    d = ImageDraw.Draw(lienzo)

    # Acento lateral Burning Flame: el mismo gesto que abre el capítulo
    # sanitario en el sitio.
    d.rectangle([0, 0, 7, H], fill=BURNING_FLAME)

    # Marca — versión clara, la que corresponde sobre Abyssal.
    marca = logo("WIEBKE-logo-principal-claro.png", 292)
    lienzo.paste(marca, (MARGEN, 84), marca)

    # Titular. Mismo quiebre que la portada del sitio: dos líneas en sans y
    # la cursiva sola en la tercera. El brief v2 lo alargó de 24 a 40
    # caracteres, que a 68 px ya no entraban en una línea.
    CUERPO = 58
    f_display = inter(CUERPO, peso=400, opsz=32)
    f_italic = ImageFont.truetype(TIMES_ITALIC, 64)
    tracking_display = -CUERPO * 0.045      # −0,045 em, como en el sitio
    ancho_util = W - MARGEN * 2

    lineas = ["Arquitectura y defensa", "jurídica para tus"]
    for linea in lineas:
        ancho = ancho_trackeado(linea, f_display, tracking_display)
        if ancho > ancho_util:
            raise SystemExit(
                f"La línea «{linea}» mide {ancho:.0f} px y no entra en "
                f"{ancho_util} px. Bajar CUERPO o repartir distinto.")

    y = 232
    for linea in lineas:
        texto_trackeado(d, (MARGEN, y), linea, f_display, PALLADIAN,
                        tracking_display)
        y += 62
    d.text((MARGEN, y - 2), "proyectos.", font=f_italic, fill=BURNING_FLAME)

    # Filete de cierre: Palladian al 24 %, el valor que fija el manual.
    d.rectangle([MARGEN, 522, W - MARGEN, 522], fill=palladian(0.24))

    # Colofón en versalitas.
    f_meta = inter(15, peso=700, opsz=14)
    tracking_meta = 15 * 0.22
    texto_trackeado(d, (MARGEN, 556), "HERMANN WIEBKE · ABOGADO",
                    f_meta, palladian(0.62), tracking_meta)

    derecha = "LA PLATA · BUENOS AIRES"
    ancho = ancho_trackeado(derecha, f_meta, tracking_meta)
    texto_trackeado(d, (W - MARGEN - ancho, 556), derecha,
                    f_meta, palladian(0.62), tracking_meta)

    ruta = os.path.join(RAIZ, "og.png")
    lienzo.save(ruta, "PNG", optimize=True)
    return ruta, lienzo.size


# ==========================================================================
#  Iconos — monograma HW sobre Abyssal
# ==========================================================================

def construir_icono(lado, proporcion_marca, nombre):
    """proporcion_marca: ancho del monograma como fracción del lado."""
    lienzo = Image.new("RGB", (lado, lado), ABYSSAL)
    ancho = round(lado * proporcion_marca)
    marca = logo("WIEBKE-monograma-HW-claro.png", ancho)
    lienzo.paste(marca,
                 ((lado - marca.width) // 2, (lado - marca.height) // 2),
                 marca)
    ruta = os.path.join(RAIZ, nombre)
    lienzo.save(ruta, "PNG", optimize=True)
    return ruta, lienzo.size


if __name__ == "__main__":
    print("Generando…")
    for ruta, tam in [
        construir_og(),
        # El monograma es apaisado (2,18:1). Cuanto menor es el icono, más
        # proporción necesita para no desaparecer: a 32 px casi no queda
        # margen que recortar.
        construir_icono(512, 0.66, "favicon.png"),
        construir_icono(180, 0.70, "apple-touch-icon.png"),
        construir_icono(32, 0.84, "favicon-32.png"),
    ]:
        print(f"  {os.path.basename(ruta):<24} {tam[0]}×{tam[1]}"
              f"  {os.path.getsize(ruta) // 1024 or 1} KB")
