/* --------------------------------------------------------------------------
   WIEBKE — Página institucional (una sola página)
   Reemplaza el componente de página actual. Importa ./styles.css.

   CONVENCIÓN TIPOGRÁFICA DEL PROYECTO
   La clase .editorial es el ÚNICO mecanismo para invocar Times New Roman
   Italic. El brief autoriza exactamente cuatro apariciones en todo el sitio:
   «claridad.» · «Criterio, estructura y medida.» · «y arquitectura» ·
   «tu situación.». No añadir una quinta sin aprobación de marca.

   Este componente es de servidor. Todo el comportamiento vive en
   <SiteMotion />, que sí es de cliente.
   -------------------------------------------------------------------------- */

import "./styles.css";
import SiteMotion from "./SiteMotion";

const WHATSAPP =
  "https://wa.me/5492216775075?text=Hola%20Hermann%2C%20quisiera%20hacerte%20una%20consulta%20jur%C3%ADdica.";

const LOGO_DARK = "/wiebke-logo-dark.png";   // versión oscura → sobre Palladian
const LOGO_LIGHT = "/wiebke-logo-light.png"; // versión clara  → sobre Abyssal
const MONO_LIGHT = "/wiebke-monograma-light.png"; // monograma HW claro → lomo

function WhatsAppMark() {
  return (
    <svg className="whatsapp-mark" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.3 3.7A11.67 11.67 0 0 0 12.02.28C5.57.28.32 5.53.32 11.98c0 2.06.54 4.08 1.56 5.85L.22 23.9l6.21-1.63a11.7 11.7 0 0 0 5.59 1.42h.01c6.45 0 11.7-5.25 11.7-11.7 0-3.13-1.22-6.07-3.43-8.28Zm-8.27 18.01a9.72 9.72 0 0 1-4.96-1.36l-.36-.21-3.68.97.98-3.59-.23-.37a9.7 9.7 0 0 1-1.48-5.17c0-5.36 4.36-9.72 9.73-9.72 2.6 0 5.04 1.01 6.87 2.85a9.65 9.65 0 0 1 2.85 6.88c0 5.36-4.37 9.72-9.72 9.72Zm5.33-7.28c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.19.29-.75.95-.92 1.14-.17.2-.34.22-.63.08-.29-.15-1.23-.45-2.34-1.45a8.8 8.8 0 0 1-1.62-2.02c-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.14-.17.19-.29.29-.49.1-.19.05-.36-.03-.51-.07-.15-.65-1.58-.9-2.16-.23-.57-.47-.49-.65-.5h-.56c-.2 0-.51.08-.78.37-.27.29-1.02 1-1.02 2.43 0 1.44 1.05 2.82 1.19 3.02.15.19 2.06 3.14 4.99 4.41.7.3 1.24.48 1.66.61.7.22 1.34.19 1.85.12.56-.08 1.73-.71 1.97-1.39.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z" />
    </svg>
  );
}

/* Botón único del sistema: rectangular, fondo Abyssal, acento vertical Flame.
   `seguimiento` marca los botones que el observador vigila para decidir si
   corresponde mostrar el botón fijo. */
function Action({ children, className = "", id, seguimiento = true, ...rest }) {
  return (
    <a
      className={`action ${className}`.trim()}
      id={id}
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      {...(seguimiento ? { "data-consulta": "" } : {})}
      {...rest}
    >
      <WhatsAppMark />
      {children}
    </a>
  );
}

/* Lomo: índice fijo del documento. Sólo se pinta en escritorio (CSS).
   Superficie Abyssal, texto Palladian, marcador y posición en Burning Flame. */
function Spine() {
  return (
    <aside className="spine" aria-label="Índice del documento">
      {/* Monograma a escala de identificación, nunca de figura decorativa.
          Es además el regreso a la portada: en un impreso, la marca del lomo
          devuelve a la cubierta. */}
      <a className="spine-mark" href="#inicio" aria-label="Volver al inicio">
        <img src={MONO_LIGHT} alt="" aria-hidden="true" width={26} height={12} />
      </a>
      <nav className="spine-index">
        <a href="#areas" data-spine="areas">01</a>
        <a href="#sanitario" data-spine="sanitario">02</a>
        <a href="#contacto" data-spine="contacto">03</a>
      </nav>
      <span className="spine-foot">La Plata · Buenos Aires</span>
      <span className="spine-progress" aria-hidden="true" />
    </aside>
  );
}

function BrandLockup({ src, width, height }) {
  return (
    <span className="brand-lockup">
      <img src={src} alt="WIEBKE" width={width} height={height} />
      <span>Hermann Wiebke · Abogado</span>
    </span>
  );
}

const SERVICES = [
  ["01", "Sucesiones e inmuebles",
   "Declaratorias, particiones, regularización y disposición de bienes heredados."],
  ["02", "Compraventas y escrituración",
   "Revisión documental, boletos, escrituras y seguridad jurídica de la operación."],
  ["03", "Alquileres y contratos",
   "Redacción, revisión, cumplimiento y resolución de conflictos contractuales."],
  ["04", "Propiedad y ocupaciones",
   "Conflictos posesorios, recupero de inmuebles y análisis de vías de regularización."],
  ["05", "Derecho urbanístico y administrativo",
   "Uso del suelo, obra privada, habilitaciones y actuaciones ante la Administración."],
  ["06", "Cuestiones ambientales",
   "Asesoramiento sobre regulación, autorizaciones y conflictos de incidencia ambiental."],
];

const HEALTH = [
  ["01", "Asesoramiento jurídico-arquitectónico de proyectos sanitarios", [
    "Acompañamos a propietarios, inversores, arquitectos y equipos técnicos desde las primeras etapas del proyecto, analizando su factibilidad normativa, sanitaria y edilicia.",
    "Evaluamos la categoría y prestaciones del establecimiento y traducimos las exigencias regulatorias en criterios concretos de diseño, organización y funcionamiento, procurando anticipar adecuaciones y contingencias antes de ejecutar la inversión.",
  ]],
  ["02", "Habilitación, regularización y gestión sanitaria", [
    "Asistimos en habilitaciones, ampliaciones, reformas, incorporación de servicios y modificaciones de establecimientos asistenciales ante el Ministerio de Salud de la Provincia de Buenos Aires.",
    "Asimismo, asesoramos a establecimientos en funcionamiento frente a requerimientos regulatorios, inspecciones, procesos de adecuación, regularización y procedimientos administrativos sancionatorios.",
  ]],
];

/* Vista previa al compartir. og:image y twitter:image DEBEN ser absolutas:
   con ruta relativa, WhatsApp, LinkedIn y X no las resuelven y el enlace se
   comparte sin imagen. Reemplazar SITIO por el dominio definitivo. */
export const SITIO = "https://REEMPLAZAR-POR-EL-DOMINIO-DEFINITIVO";

export const metadata = {
  title: "HERMANN WIEBKE — Abogado",
  description:
    "Asesoramiento jurídico en asuntos patrimoniales, inmobiliarios, urbanísticos y ambientales en La Plata.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "HERMANN WIEBKE — Abogado",
    url: `${SITIO}/`,
    title: "HERMANN WIEBKE — Abogado",
    description: "Derecho, urbanismo y operaciones inmobiliarias en La Plata.",
    images: [{
      url: `${SITIO}/og.png`,
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "WIEBKE — Decisiones que requieren claridad.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HERMANN WIEBKE — Abogado",
    description: "Derecho, urbanismo y operaciones inmobiliarias en La Plata.",
    images: [`${SITIO}/og.png`],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#1B2632",
};

export default function Page() {
  return (
    <>
      <Spine />
      <main>
        {/* Ancla de retorno. Va aquí, y no sobre el encabezado, porque el
            encabezado es sticky: cuando está pegado ya está a la vista, y el
            navegador considera que no hay nada que desplazar. */}
        <span id="inicio" aria-hidden="true" />
      {/* Marca la presencia de JS durante el parseo, antes del primer pintado:
          sin JS el contenido se muestra sin apariciones, nunca oculto. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('js')",
        }}
      />

      {/* 01 — ENCABEZADO */}
      <div className="masthead-bleed bleed">
        <header className="masthead page-shell">
          <a className="brand" href="#inicio" aria-label="WIEBKE — volver al inicio">
            <BrandLockup src={LOGO_DARK} width={184} height={32} />
          </a>
          <span className="location">La Plata · Buenos Aires</span>
        </header>
      </div>

      {/* 02 — PORTADA */}
      <section className="hero page-shell">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow" data-stagger style={{ "--d": "0ms" }}>
            Asesoramiento jurídico
          </p>

          {/* Acento editorial 1/4 */}
          <h1 data-stagger style={{ "--d": "90ms" }}>
            Decisiones que requieren <em className="editorial">claridad.</em>
          </h1>

          <p className="hero-text" data-stagger style={{ "--d": "180ms" }}>
            Abordaje integral de asuntos patrimoniales, inmobiliarios, urbanísticos y
            ambientales. Análisis del problema, sus riesgos y las alternativas posibles.
          </p>

          <div className="hero-actions" data-stagger style={{ "--d": "260ms" }}>
            <Action>Consultar por WhatsApp</Action>
          </div>
        </div>

        {/* Columna de apoyo: puramente tipográfica, sin monograma ni planos. */}
        <div className="hero-system" data-reveal>
          <div className="hero-disciplines">
            <span><i>01</i> Derecho</span>
            <span><i>02</i> Urbanismo</span>
          </div>
        </div>
      </section>

      {/* 03 — ÁREAS DE CONSULTA */}
      <section className="services page-shell" id="areas" aria-labelledby="services-title">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">01 / Áreas de consulta</p>
            <h2 id="services-title">¿En qué puedo ayudarte?</h2>
          </div>
          {/* Acento editorial 2/4 */}
          <p className="section-note editorial">Criterio, estructura y medida.</p>
        </div>

        <div className="service-grid">
          {SERVICES.map(([n, title, text]) => (
            <article className="service-card" key={n} data-reveal>
              <span className="service-number">{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 04 — ÁREA ESPECIALIZADA · quiebre de capítulo a sangre
          Fondo Abyssal · textos Palladian · acento y numeración Burning Flame ·
          plano secundario Blue Fantastic (panel que ordena las líneas de servicio). */}
      <section className="health-band bleed" id="sanitario" aria-labelledby="health-title">
        <div className="health-practice page-shell">
          <div className="health-heading" data-reveal>
            <p className="eyebrow">02 / Área especializada</p>
            {/* Acento editorial 3/4 */}
            <h2 id="health-title">
              Derecho sanitario <em className="editorial">y arquitectura</em>
            </h2>
            <p className="health-intro">
              Asesoramiento integral para el proyecto, habilitación y funcionamiento de
              establecimientos de salud.
            </p>
          </div>

          <div className="health-services" data-reveal>
            {HEALTH.map(([n, title, paras]) => (
              <article key={n}>
                <span>{n}</span>
                <div>
                  <h3>{title}</h3>
                  {paras.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — PRIMERA CONVERSACIÓN */}
      <section className="contact-wrap bleed" id="contacto">
        <div className="contact page-shell" aria-labelledby="contact-title">
          <div data-reveal>
            <p className="eyebrow">03 / Primera conversación</p>
            {/* Acento editorial 4/4 */}
            <h2 id="contact-title">
              Contame brevemente <em className="editorial">tu situación.</em>
            </h2>
          </div>
          <div className="contact-action" data-reveal>
            <p>
              Escribime por WhatsApp para realizar una primera orientación y, si
              corresponde, coordinar una entrevista.
            </p>
            <Action>Iniciar consulta</Action>
          </div>
        </div>
      </section>

      {/* 06 — PIE */}
      <footer>
        <div className="page-shell footer-inner">
          <a className="brand" href="#inicio" aria-label="WIEBKE — volver al inicio">
            <BrandLockup src={LOGO_LIGHT} width={152} height={27} />
          </a>
          <p>
            El envío de un mensaje no implica la aceptación del caso ni constituye por
            sí solo una relación profesional.
          </p>
          {/* En celular no hay lomo y el encabezado se va con el scroll:
              éste es el punto de retorno, ofrecido al final del documento. */}
          <div className="footer-end">
            <span className="footer-year">© 2026</span>
            <a className="to-top" href="#inicio">
              <span aria-hidden="true">↑</span> Volver arriba
            </a>
          </div>
        </div>
      </footer>

      {/* Botón fijo en celular. No lleva data-consulta: es el observado, no el
          observador. Su visibilidad la gobierna <SiteMotion />. */}
      <Action
        id="cta-fija"
        className="mobile-whatsapp"
        seguimiento={false}
        aria-label="Consultar por WhatsApp"
      >
        Consultar por WhatsApp
      </Action>

        <SiteMotion />
      </main>
    </>
  );
}
