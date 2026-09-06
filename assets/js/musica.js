// Reproductor de música de fondo. Barra persistente: sigue sonando igual
// en el mapa y en cualquier planeta, porque todo vive en la misma página.
document.addEventListener("DOMContentLoaded", () => {
  const reproductor = document.getElementById("reproductor");
  const audio = document.getElementById("musica-audio");
  const botonPlay = document.getElementById("musica-play");
  const botonAnterior = document.getElementById("musica-anterior");
  const botonSiguiente = document.getElementById("musica-siguiente");
  const botonLista = document.getElementById("musica-lista-boton");
  const lista = document.getElementById("musica-lista");

  const VOLUMEN = 0.6;
  // Segundos que tarda en apagarse una canción y en encenderse la siguiente,
  // para que el cambio no se sienta como un corte seco.
  const FUNDIDO = 0.9;

  let orden = [];
  let posicion = 0;
  let iniciado = false;
  let cambiando = false;
  let opciones = [];

  // Baraja una lista de índices (Fisher-Yates).
  const barajar = (lista) => {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  };

  // Cada vuelta baraja la lista COMPLETA: ninguna canción tiene un lugar
  // reservado, ni siquiera la primera del archivo. Dentro de una vuelta no se
  // repite ninguna hasta que hayan sonado todas.
  const nuevaVuelta = () => {
    const ultimaDeLaVuelta = orden.length ? orden[orden.length - 1] : -1;
    const nueva = barajar(playlist.map((_, i) => i));
    // Si la primera de la vuelta nueva es la misma que acaba de sonar, se
    // corre un lugar: si no, esa canción sonaría dos veces seguidas y parece
    // que el azar se hubiera trabado.
    if (nueva.length > 1 && nueva[0] === ultimaDeLaVuelta) {
      [nueva[0], nueva[1]] = [nueva[1], nueva[0]];
    }
    orden = nueva;
    posicion = 0;
  };

  // Marca en el menú cuál está sonando.
  const marcarPistaActual = () => {
    const actual = orden.length ? orden[posicion] : -1;
    opciones.forEach((opcion, i) => {
      opcion.classList.toggle("sonando", i === actual);
    });
  };

  const ponerPista = (autoplay) => {
    if (orden.length === 0) nuevaVuelta();
    audio.src = playlist[orden[posicion]].archivo;
    marcarPistaActual();
    if (autoplay) {
      audio.play().catch(() => {
        // El navegador bloqueó el autoplay; el botón de play queda listo.
      });
    }
  };

  // Baja el volumen, cambia de canción y lo vuelve a subir.
  const cambiarPistaConFundido = (moverPosicion) => {
    if (cambiando) return;
    cambiando = true;
    gsap.killTweensOf(audio);
    gsap.to(audio, {
      volume: 0,
      duration: FUNDIDO / 2,
      ease: "power1.in",
      onComplete: () => {
        moverPosicion();
        ponerPista(true);
        gsap.to(audio, {
          volume: VOLUMEN,
          duration: FUNDIDO,
          ease: "power1.out",
          onComplete: () => {
            cambiando = false;
          },
        });
      },
    });
  };

  const avanzar = () => {
    posicion++;
    if (posicion >= orden.length) nuevaVuelta();
  };

  const retroceder = () => {
    posicion--;
    if (posicion < 0) {
      nuevaVuelta();
      posicion = orden.length - 1;
    }
  };

  // Salta directo a una canción elegida en el menú. Se busca su lugar dentro
  // de la vuelta actual, así lo que siga con "siguiente" tiene sentido y no se
  // repite lo que ya sonó.
  const irAPista = (indiceEnPlaylist) => {
    const destino = orden.indexOf(indiceEnPlaylist);
    if (destino === -1) return;
    if (destino === posicion && !audio.paused) {
      cerrarLista();
      return;
    }
    cambiarPistaConFundido(() => {
      posicion = destino;
    });
    cerrarLista();
  };

  const actualizarIconoPlay = () => {
    botonPlay.textContent = audio.paused ? "▶" : "⏸";
  };

  const alternarReproduccion = () => {
    gsap.killTweensOf(audio);
    if (audio.paused) {
      audio.volume = 0;
      audio.play().catch(() => {});
      gsap.to(audio, { volume: VOLUMEN, duration: FUNDIDO / 2 });
    } else {
      gsap.to(audio, {
        volume: 0,
        duration: FUNDIDO / 2,
        onComplete: () => audio.pause(),
      });
    }
  };

  // ---------- Menú de canciones ----------
  // Se arma desde playlist.js, así una canción nueva aparece sola en el menú
  // sin tocar el HTML.
  const armarLista = () => {
    lista.innerHTML = "";
    opciones = playlist.map((pista, i) => {
      const opcion = document.createElement("button");
      opcion.className = "musica-opcion";
      opcion.textContent = pista.titulo;
      opcion.addEventListener("click", (e) => {
        e.stopPropagation();
        irAPista(i);
      });
      lista.appendChild(opcion);
      return opcion;
    });
  };

  const listaAbierta = () => !lista.classList.contains("hidden");

  const abrirLista = () => {
    lista.classList.remove("hidden");
    botonLista.classList.add("activo");
    marcarPistaActual();
    gsap.fromTo(
      lista,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
    );
  };

  const cerrarLista = () => {
    if (!listaAbierta()) return;
    botonLista.classList.remove("activo");
    gsap.to(lista, {
      opacity: 0,
      y: 8,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => lista.classList.add("hidden"),
    });
  };

  const alternarLista = (e) => {
    e.stopPropagation();
    if (listaAbierta()) cerrarLista();
    else abrirLista();
  };

  botonPlay.addEventListener("click", alternarReproduccion);
  botonSiguiente.addEventListener("click", () => cambiarPistaConFundido(avanzar));
  botonAnterior.addEventListener("click", () => cambiarPistaConFundido(retroceder));
  botonLista.addEventListener("click", alternarLista);
  audio.addEventListener("play", actualizarIconoPlay);
  audio.addEventListener("pause", actualizarIconoPlay);
  audio.addEventListener("ended", () => cambiarPistaConFundido(avanzar));

  // Tocar en cualquier otro lado cierra el menú, que es lo que una espera.
  // Va en captura para enterarse aunque el mapa detenga el evento.
  //
  // Lo que pase DENTRO de la barra no cuenta: si no, al mantener el dedo sobre
  // el botón ♫ el menú se cerraba con el pointerdown y se volvía a abrir con
  // el click. Elegir una canción ya cierra el menú por su cuenta.
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (reproductor.contains(e.target)) return;
      cerrarLista();
    },
    true
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarLista();
  });

  // Llamado por mapa.js apenas se entra al universo (después de la clave).
  window.iniciarMusica = () => {
    if (iniciado) return;
    iniciado = true;
    reproductor.classList.remove("hidden");
    armarLista();
    nuevaVuelta();
    audio.volume = 0;
    ponerPista(true);
    gsap.to(audio, { volume: VOLUMEN, duration: FUNDIDO * 1.5, ease: "power1.out" });
  };
});
