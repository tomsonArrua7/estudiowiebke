"use client";

/* --------------------------------------------------------------------------
   WIEBKE — Comportamiento de lectura

   Cuatro responsabilidades, todas de presentación:

   1. Apariciones al entrar en pantalla. Cada pieza se revela una sola vez.
   2. Botón fijo de WhatsApp en celular: se muestra únicamente cuando ningún
      botón de consulta está a la vista.
   3. Encabezado condensado al iniciar la lectura (132 → 78 px).
   4. Lomo: posición de lectura y sección activa.

   Los puntos 3 y 4 comparten un único listener de scroll servido por
   requestAnimationFrame: el trabajo se hace una vez por cuadro, no una vez
   por evento.

   Se aísla en un componente cliente para que la página siga siendo un
   componente de servidor.
   -------------------------------------------------------------------------- */

import { useEffect } from "react";

const SECCIONES = ["areas", "sanitario", "contacto"];

export default function SiteMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const soporta = "IntersectionObserver" in window;

    /* --- 1. Apariciones ------------------------------------------------ */
    const piezas = document.querySelectorAll("[data-reveal]");
    let obsReveal;
    if (reduce || !soporta) {
      piezas.forEach((el) => el.classList.add("is-in"));
    } else {
      obsReveal = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-in");
            obsReveal.unobserve(e.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
      );
      piezas.forEach((el) => obsReveal.observe(el));
    }

    /* --- 2. Botón fijo ------------------------------------------------- */
    const fija = document.getElementById("cta-fija");
    const inline = document.querySelectorAll("[data-consulta]");
    let obsCta;
    if (fija && inline.length && soporta) {
      const visibles = new Set();
      obsCta = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (e.isIntersecting) visibles.add(e.target);
            else visibles.delete(e.target);
          });
          fija.classList.toggle("is-visible", visibles.size === 0);
        },
        { threshold: 0 }
      );
      inline.forEach((el) => obsCta.observe(el));
    } else if (fija) {
      fija.classList.add("is-visible");
    }



    /* --- La panorámica sólo se anima mientras está a la vista: es la única
       animación perpetua del sitio. ------------------------------------ */
    const pano = document.querySelector(".panoramica");
    let obsPano;
    if (pano && soporta) {
      obsPano = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) =>
            pano.classList.toggle("is-mirando", e.isIntersecting)
          );
        },
        { threshold: 0 }
      );
      obsPano.observe(pano);
    } else if (pano) {
      pano.classList.add("is-mirando");
    }

    /* --- Regreso a la portada -------------------------------------------
       El href="#inicio" queda como respaldo sin JS, pero se intercepta: si el
       fragmento ya es #inicio, el navegador considera que no hay nada que
       hacer y el segundo clic no responde. */
    const retornos = document.querySelectorAll('a[href="#inicio"]');
    const alVolver = (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      if (window.history && history.replaceState) {
        history.replaceState(null, "", location.pathname + location.search);
      }
    };
    retornos.forEach((a) => a.addEventListener("click", alVolver));



    /* --- 3 y 4. Encabezado, posición y sección activa ------------------ */
    const membrete = document.querySelector(".masthead-bleed");
    const filamento = document.querySelector(".spine-progress");
    const enlaces = SECCIONES.map((id) =>
      document.querySelector(`[data-spine="${id}"]`)
    );
    const secciones = SECCIONES.map((id) => document.getElementById(id));
    let pendiente = false;
    let condensado = false;

    function pintar() {
      pendiente = false;
      const y = window.scrollY;

      /* Histéresis: dos umbrales separados por más que los 54 px que el
         encabezado pierde al condensarse, para que el reacomodo no pueda
         devolvernos al otro lado del umbral y entrar en bucle. */
      if (membrete) {
        if (!condensado && y > 140) {
          condensado = true;
          membrete.classList.add("is-condensed");
        } else if (condensado && y < 60) {
          condensado = false;
          membrete.classList.remove("is-condensed");
        }
      }

      if (filamento) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, y / total)) : 0;
        filamento.style.setProperty("--p", `${(p * 100).toFixed(2)}%`);
      }

      /* Sección activa: la última cuyo inicio ya cruzó el tercio superior. */
      let activa = -1;
      const umbral = y + window.innerHeight * 0.34;
      secciones.forEach((s, i) => {
        if (s && s.offsetTop <= umbral) activa = i;
      });
      enlaces.forEach((a, i) => {
        if (!a) return;
        if (i === activa) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }

    function alDesplazar() {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(pintar);
    }

    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar, { passive: true });
    pintar();

    return () => {
      if (obsReveal) obsReveal.disconnect();
      if (obsCta) obsCta.disconnect();
      if (obsPano) obsPano.disconnect();
      retornos.forEach((a) => a.removeEventListener("click", alVolver));
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
    };
  }, []);

  return null;
}
