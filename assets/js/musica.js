// Reproductor de música de fondo. Barra persistente: sigue sonando igual
// en el mapa y en cualquier planeta, porque todo vive en la misma página.
document.addEventListener("DOMContentLoaded", () => {
  const reproductor = document.getElementById("reproductor");
  const audio = document.getElementById("musica-audio");
  const botonPlay = document.getElementById("musica-play");
  const botonAnterior = document.getElementById("musica-anterior");
  const botonSiguiente = document.getElementById("musica-siguiente");

  const VOLUMEN = 0.6;
  // Segundos que tarda en apagarse una canción y en encenderse la siguiente,
  // para que el cambio no se sienta como un corte seco.
  const FUNDIDO = 0.9;

  let orden = [];
  let posicion = 0;
  let iniciado = false;
  let cambiando = false;

  // Baraja una lista de índices (Fisher-Yates).
  const barajar = (lista) => {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  };

  // Cada vuelta empieza SIEMPRE por la primera canción de la playlist, y las
  // demás salen barajadas. Así el universo siempre se abre con la misma
  // canción, pero lo que sigue nunca es igual.
  const nuevaVuelta = () => {
    const resto = playlist.map((_, i) => i).slice(1);
    orden = playlist.length ? [0, ...barajar(resto)] : [];
    posicion = 0;
  };

  const ponerPista = (autoplay) => {
    if (orden.length === 0) nuevaVuelta();
    audio.src = playlist[orden[posicion]].archivo;
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

  botonPlay.addEventListener("click", alternarReproduccion);
  botonSiguiente.addEventListener("click", () => cambiarPistaConFundido(avanzar));
  botonAnterior.addEventListener("click", () => cambiarPistaConFundido(retroceder));
  audio.addEventListener("play", actualizarIconoPlay);
  audio.addEventListener("pause", actualizarIconoPlay);
  audio.addEventListener("ended", () => cambiarPistaConFundido(avanzar));

  // Llamado por mapa.js apenas se entra al universo (después de la clave).
  window.iniciarMusica = () => {
    if (iniciado) return;
    iniciado = true;
    reproductor.classList.remove("hidden");
    nuevaVuelta();
    audio.volume = 0;
    ponerPista(true);
    gsap.to(audio, { volume: VOLUMEN, duration: FUNDIDO * 1.5, ease: "power1.out" });
  };
});
