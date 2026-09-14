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

  const CLAVE_AVANCE = "felyn_comic_vineta";

  let indice = 0;
  let abierta = false;
  let inicioGesto = null;
  // Transición en curso, para poder cortarla si ella toca otra vez antes de
  // que termine: dos líneas de tiempo sobre la misma viñeta se pisaban entre
  // sí y el cambio salía a tirones.
  let transicion = null;
  // Cada cambio de viñeta lleva un número. Si mientras se espera una imagen
  // llega un toque nuevo, el cambio viejo ve que ya no es el último y se
  // retira sin pintar nada.
  let generacion = 0;

  // ---------- Precarga de los dibujos ----------
  // Cada viñeta pesa casi un mega. Cargándolas recién al avanzar, el
  // desvanecido arrancaba con el hueco todavía vacío y la imagen aparecía de
  // golpe un instante después: eso era lo que se sentía pegado. Se piden
  // todas al abrir el planeta, así mientras ella lee la primera van bajando
  // las demás.
  const precargadas = new Map();

  const precargar = (ruta) => {
    if (!ruta) return null;
    if (precargadas.has(ruta)) return precargadas.get(ruta);
    const img = new Image();
    img.decoding = "async";
    img.src = ruta;
    precargadas.set(ruta, img);
    return img;
  };

  const precargarTodas = () => {
    // En orden de lectura: la que sigue es siempre la más urgente.
    cuento.forEach((vineta) => precargar(vineta.imagen));
  };

  // Llama a seguir() cuando la imagen esté lista. Nunca espera para siempre:
  // si tarda demasiado o el archivo no existe, sigue igual y el aviso de
  // "falta el dibujo" se encarga del resto.
  const ESPERA_MAXIMA = 1200;
  const cuandoEsteLista = (ruta, seguir) => {
    const img = precargar(ruta);
    if (!img || img.complete) return seguir();
    let hecho = false;
    const unaVez = () => {
      if (hecho) return;
      hecho = true;
      seguir();
    };
    img.addEventListener("load", unaVez, { once: true });
    img.addEventListener("error", unaVez, { once: true });
    setTimeout(unaVez, ESPERA_MAXIMA);
  };

  // Por donde iba la ultima vez. Si ya habia llegado al final, se empieza otra
  // vez desde el principio: el cuento ya esta leido, y releerlo de corrido
  // tiene mas sentido que quedarse clavada en la ultima vineta.
  const guardarAvance = () => {
    try {
      localStorage.setItem(CLAVE_AVANCE, String(indice));
    } catch (e) {
      // Sin memoria simplemente empieza del principio cada vez.
    }
  };

  const avanceGuardado = () => {
    try {
      const n = parseInt(localStorage.getItem(CLAVE_AVANCE), 10);
      if (!Number.isInteger(n) || n < 0 || n >= cuento.length - 1) return 0;
      return n;
    } catch (e) {
      return 0;
    }
  };

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
    guardarAvance();
    const mia = ++generacion;

    // Corta lo que estuviera a medio camino antes de empezar otra cosa.
    if (transicion) transicion.kill();

    transicion = gsap.to(vinetaEl, {
      opacity: 0,
      x: -30 * direccion,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        if (mia !== generacion) return;
        pintarVineta();
        // El dibujo se muestra recién cuando de verdad está: así no se ve el
        // marco vacío un instante antes de que aparezca.
        cuandoEsteLista(cuento[indice].imagen, () => {
          if (mia !== generacion) return;
          transicion = gsap.fromTo(
            vinetaEl,
            { opacity: 0, x: 30 * direccion },
            { opacity: 1, x: 0, duration: 0.28, ease: "power2.out" }
          );
        });
      },
    });
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
      // Retoma por donde iba. Si ya lo habia terminado, vuelve a empezar.
      indice = avanceGuardado();
      generacion++;
      if (transicion) transicion.kill();
      precargarTodas();
      pintarVineta();
      cuandoEsteLista(cuento[indice].imagen, () => {
        gsap.fromTo(
          vinetaEl,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      });
    },
    cerrar: () => {
      abierta = false;
      generacion++;
      if (transicion) transicion.kill();
    },
  });
});
