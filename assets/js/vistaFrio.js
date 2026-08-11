// Vista del planeta frío: el cuento contado como cómic, una viñeta a la vez.
// El contenido vive en assets/js/data/cuento.js — este archivo solo lo pasa.
// Se avanza tocando la viñeta, con los botones, con las flechas del teclado
// o deslizando el dedo.
document.addEventListener("DOMContentLoaded", () => {
  const vinetaEl = document.getElementById("comic-vineta");
  const imagenEl = document.getElementById("comic-imagen");
  const marcadorEl = document.getElementById("comic-marcador");
  const textoEl = document.getElementById("comic-texto");
  const progresoEl = document.getElementById("comic-progreso");
  const botonAnterior = document.getElementById("comic-anterior");
  const botonSiguiente = document.getElementById("comic-siguiente");

  // Cuánto hay que deslizar de lado para cambiar de viñeta, y cuánto en
  // vertical para que el gesto cuente como "estoy leyendo" y no cambie nada.
  const DISTANCIA_SWIPE = 50;
  const DISTANCIA_LECTURA = 12;

  let indice = 0;
  let abierta = false;
  let inicioGesto = null;

  const pintarVineta = () => {
    const vineta = cuento[indice];
    progresoEl.textContent = indice + 1 + " / " + cuento.length;

    // El texto es opcional: si la viñeta va solo con dibujo, el pie ni
    // siquiera ocupa lugar.
    const pie = (vineta.texto || "").trim();
    textoEl.textContent = pie;
    textoEl.classList.toggle("hidden", pie === "");

    if (vineta.imagen) {
      imagenEl.src = vineta.imagen;
      imagenEl.classList.remove("hidden");
      marcadorEl.classList.add("hidden");
    } else {
      // Viñeta pensada sin dibujo: solo el texto sobre el fondo helado.
      imagenEl.removeAttribute("src");
      imagenEl.classList.add("hidden");
      marcadorEl.classList.add("hidden");
    }
    vinetaEl.classList.toggle("solo-texto", !vineta.imagen);
    textoEl.scrollTop = 0;

    botonAnterior.disabled = indice === 0;
    botonSiguiente.disabled = indice === cuento.length - 1;
  };

  // Si el dibujo todavía no existe, en vez de una imagen rota se muestra qué
  // archivo falta — así se puede escribir el cuento primero y dibujar después.
  imagenEl.addEventListener("error", () => {
    if (!imagenEl.getAttribute("src")) return;
    imagenEl.classList.add("hidden");
    marcadorEl.classList.remove("hidden");
    marcadorEl.textContent = "Falta el dibujo: " + cuento[indice].imagen;
  });

  const irA = (nuevoIndice) => {
    if (nuevoIndice < 0 || nuevoIndice >= cuento.length) return;
    const direccion = nuevoIndice > indice ? 1 : -1;
    indice = nuevoIndice;

    gsap
      .timeline()
      .to(vinetaEl, {
        opacity: 0,
        x: -30 * direccion,
        duration: 0.2,
        ease: "power2.in",
      })
      .call(pintarVineta)
      .fromTo(
        vinetaEl,
        { opacity: 0, x: 30 * direccion },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
  };

  const siguiente = () => irA(indice + 1);
  const anterior = () => irA(indice - 1);

  botonSiguiente.addEventListener("click", (e) => {
    e.stopPropagation();
    siguiente();
  });
  botonAnterior.addEventListener("click", (e) => {
    e.stopPropagation();
    anterior();
  });

  // Tocar la viñeta avanza; deslizar hacia los lados avanza o retrocede.
  vinetaEl.addEventListener("pointerdown", (e) => {
    inicioGesto = { x: e.clientX, y: e.clientY };
  });

  vinetaEl.addEventListener("pointerup", (e) => {
    if (!inicioGesto) return;
    const dx = e.clientX - inicioGesto.x;
    const dy = e.clientY - inicioGesto.y;
    inicioGesto = null;

    // Si arrastró más en vertical que en horizontal, estaba leyendo (moviendo
    // el texto largo), no pidiendo cambiar de viñeta. Sin esto, al intentar
    // desplazar el mensaje de cierre se saltaba de viñeta.
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > DISTANCIA_LECTURA) return;

    if (dx <= -DISTANCIA_SWIPE) siguiente();
    else if (dx >= DISTANCIA_SWIPE) anterior();
    else siguiente();
  });

  document.addEventListener("keydown", (e) => {
    if (!abierta) return;
    if (e.key === "ArrowRight") siguiente();
    if (e.key === "ArrowLeft") anterior();
  });

  window.registrarVistaPlaneta("frio", {
    abrir: () => {
      abierta = true;
      // Siempre empieza desde el principio: es un cuento, se lee de corrido.
      indice = 0;
      pintarVineta();
      gsap.fromTo(
        vinetaEl,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    },
    cerrar: () => {
      abierta = false;
    },
  });
});
