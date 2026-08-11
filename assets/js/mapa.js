// Registro de vistas de planeta: cada módulo (vistaGirasol.js, vistaFrio.js...)
// se anota aquí con su propia clave. Vive fuera del DOMContentLoaded porque
// esos módulos pueden registrarse antes o después, no importa el orden.
window.vistasPlaneta = window.vistasPlaneta || {};
window.registrarVistaPlaneta = (clave, controlador) => {
  window.vistasPlaneta[clave] = controlador;
};

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Elementos ----------
  const splashScreen = document.getElementById("splash-screen");
  const splashText1 = document.getElementById("splash-text-1");
  const splashText2 = document.getElementById("splash-text-2");
  const passwordInput = document.getElementById("password-input");
  const enterButton = document.getElementById("enter-button");
  const passwordHint = document.querySelector(".password-hint");
  const passwordError = document.getElementById("password-error");

  const universo = document.getElementById("universo");
  const cielo = document.getElementById("cielo");
  const mundo = document.getElementById("mundo");
  const naveContenedor = document.getElementById("nave-contenedor");
  const naveFlote = document.getElementById("nave-flote");
  const naveCuerpo = document.getElementById("nave-cuerpo");
  const propulsor = document.getElementById("propulsor");
  const pista = document.getElementById("pista");
  const mensajeContainer = document.getElementById("mensaje-container");
  const mensajeTexto = document.getElementById("mensaje-texto");
  const mensajeCerrar = document.getElementById("mensaje-cerrar");

  const CORRECT_PASSWORD = "KIWWA";
  const CLAVE_VISTAS = "felyn_estrellas_vistas";

  // ---------- Ajustes de sensación (tocar estos números cambia el "feel") ----------
  // Cuánto tarda la nave en llegar a lo que tocas.
  const DURACION_VUELO = 1.4;
  // Velocidad de la deriva orbital, en píxeles por segundo. Muy lenta a
  // propósito: da vida sin estorbar cuando ella quiere tocar algo.
  const VELOCIDAD_ORBITA = 4;
  // Qué fracción del impulso queda después de UN SEGUNDO al soltar el
  // arrastre (más alto = patina más). Se mide por segundo y no por cuadro:
  // si no, en una pantalla de 120Hz el impulso se apaga al doble de rápido
  // que en una de 60Hz y el desplazamiento se siente distinto en cada equipo.
  const FRICCION_POR_SEGUNDO = 0.012;
  // Techo del impulso al soltar, en píxeles por segundo. Sin él, un tirón
  // rápido mandaba la cámara lejísimos y se sentía demasiado sensible.
  const VELOCIDAD_MAXIMA = 2400;
  // Qué tan rápido el zoom real alcanza al zoom pedido.
  const SUAVIDAD_ZOOM = 0.2;
  // Con cuánta fuerza el espacio la trae de vuelta si se fue MUY lejos del
  // contenido. Suave a propósito: es un recordatorio, no una correa.
  const FUERZA_REGRESO = 0.018;
  // Cuánto más se puede acercar. El tope de alejarse se calcula solo, para
  // que al máximo zoom hacia afuera entre el cúmulo entero en pantalla.
  const ESCALA_MAX = 3;
  let ESCALA_MIN = 0.25;
  // Cuánto se oscurece lo que está en el borde del cúmulo respecto al centro.
  const OSCURECER_BORDE = 0.5;
  // Entrada: el universo se abre mirando el sol y la cámara se abre despacio.
  // Las dos escalas se calculan en medirUniverso contra el tamaño del anillo
  // interno: si fueran fijas, en un celular (angosto) el primer anillo caería
  // entero fuera de pantalla y se entraría a un universo vacío.
  let ESCALA_INICIAL = 0.9;
  let ESCALA_ENTRADA = 1.75;
  const DURACION_ENTRADA = 2.6;
  // Cuánto se acerca la cámara al elegir un destino (y se aleja al salir).
  const ZOOM_AL_VISITAR = 1.4;
  // Segundos sin tocar nada antes de que la nave se vaya a pasear sola, y a
  // qué velocidad deambula.
  const ESPERA_PARA_PASEO = 12;
  const VELOCIDAD_PASEO = 30;
  // Efecto lente: cuánto se encogen y apagan los cuerpos hacia el borde.
  // ALCANCE > 1 estira la caída más allá de la pantalla. Suave, si no lo que
  // queda a los lados se apaga tanto que parece que no estuviera.
  const LENTE_ENCOGE = 0.28;
  const LENTE_APAGA = 0.4;
  const LENTE_ALCANCE = 2.1;

  // Todo vive en un disco REDONDO alrededor del centro, no en un cuadrado: eso
  // es lo que hace que al alejarse se vea un cúmulo de estrellas flotando en
  // un gran vacío. El cúmulo crece solo a medida que se agregan mensajes.
  //
  // El tamaño del disco se mide contra la pantalla, no en píxeles fijos: las
  // estrellas y planetas sí tienen tamaño fijo, así que si el anillo no se
  // encogiera en un celular la primera vista quedaría completamente vacía.
  const CANTIDAD = mensajes.length + cumpleanos.length;
  let RADIO_INTERNO = 0;
  let RADIO_EXTERNO = 0;
  let MUNDO_ANCHO = 0;
  let MUNDO_ALTO = 0;
  let MARGEN_LIBRE = 0;
  // El centro del universo: ahí va el planeta girasol, y todo lo demás gira
  // a su alrededor.
  const CENTRO = { x: 0, y: 0 };

  const medirUniverso = () => {
    const base = Math.min(window.innerWidth, window.innerHeight);
    // El anillo interno deja aire alrededor del sol (con el anillo pegado al
    // centro, esa zona se veía saturada); de ahí para afuera el disco crece
    // generoso con cada mensaje nuevo, para que el cielo no se sienta
    // apretado por más estrellas que se sumen.
    //
    // Todo se mide contra el lado corto de la pantalla, nunca en píxeles
    // fijos: en un celular (alto y angosto) solo entran unos 200px de mundo a
    // cada lado, y con radios fijos la primera vista quedaba vacía. Por lo
    // mismo ESCALA_INICIAL se calcula abajo contra RADIO_INTERNO.
    RADIO_INTERNO = base * 0.62;
    RADIO_EXTERNO = RADIO_INTERNO + Math.sqrt(CANTIDAD) * base * 0.5;
    // Margen generoso para vagar más allá del último cuerpo sin que nada tire.
    MARGEN_LIBRE = base * 1.6;
    MUNDO_ANCHO = Math.round((RADIO_EXTERNO + base) * 2);
    MUNDO_ALTO = MUNDO_ANCHO;
    CENTRO.x = MUNDO_ANCHO / 2;
    CENTRO.y = MUNDO_ALTO / 2;
    // Alejarse al máximo debe mostrar el cúmulo COMPLETO rodeado de vacío. Se
    // mide contra el lado corto para que entre en ambos sentidos, y el 1.35
    // es el respiro de vacío que lo hace leer como un cúmulo y no como una
    // pantalla llena.
    ESCALA_MIN = Math.max(0.05, base / 2 / (RADIO_EXTERNO * 1.35));
    // Al entrar tiene que verse el sol con el primer anillo de estrellas
    // alrededor, no el sol solo en medio de la nada.
    ESCALA_INICIAL = base / 2 / (RADIO_INTERNO * 1.35);
    ESCALA_ENTRADA = ESCALA_INICIAL * 1.95;
  };

  const camara = { x: 0, y: 0, escala: 1 };
  const posNave = { x: 0, y: 0 };
  const velocidad = { x: 0, y: 0 };
  const anclaZoom = { x: 0, y: 0 };
  let tiempoUltimoMovimiento = 0;
  let recorridoDelGesto = 0;

  // Un tirón muy brusco puede dar velocidades enormes y la cámara sale
  // disparada media pantalla. Se le pone techo.
  const limitarVelocidad = () => {
    const rapidez = Math.hypot(velocidad.x, velocidad.y);
    if (rapidez <= VELOCIDAD_MAXIMA) return;
    const factor = VELOCIDAD_MAXIMA / rapidez;
    velocidad.x *= factor;
    velocidad.y *= factor;
  };
  let escalaObjetivo = 1;

  let cuerpos = [];
  let capasFondo = [];
  let limites = null;

  let arrastrando = false;
  let huboArrastre = false;
  let ultimoPuntero = { x: 0, y: 0 };
  const punterosActivos = new Map();
  let distanciaPinchAnterior = null;
  let vistaAbiertaId = null;
  // Cuerpo al que la nave quedó amarrada, y a qué distancia aparcó: se va
  // orbitando junto a él, en vez de quedarse flotando sola en el vacío donde
  // ese cuerpo solía estar.
  let naveAnclada = null;
  let naveDesfase = { x: 0, y: 0 };
  let vueloActual = null;
  // Cuerpo que la cámara sigue durante el vuelo (se suelta al aterrizar o
  // apenas ella toca la pantalla).
  let cuerpoEnfocado = null;
  // Animación de apertura del universo.
  let introActiva = false;
  // Zoom que tenía antes de visitar algo, para devolverlo al salir.
  let escalaAntesDeVisita = null;
  // Paseo sin rumbo: si pasa un rato sin tocar nada, la nave se va a dar
  // vueltas sola por el espacio. No visita ni toca nada, solo vuela.
  let modoPaseo = false;
  let ultimaInteraccion = 0;
  const paseo = { centro: { x: 0, y: 0 }, radio: 0, angulo: 0, fase: 0 };

  // ---------- Pantalla de clave ----------
  const showSplashScreen = () => {
    gsap
      .timeline()
      .to(splashText1, { opacity: 1, duration: 0.8, ease: "steps(1)" })
      .to(splashText2, { opacity: 1, duration: 0.8, ease: "steps(1)" }, ">-0.4")
      .fromTo(
        [passwordInput, enterButton, passwordHint],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "<0.5"
      );
  };

  const handlePasswordEntry = () => {
    const enteredPassword = passwordInput.value.toUpperCase();
    if (enteredPassword === CORRECT_PASSWORD) {
      hideSplashScreen();
    } else {
      gsap
        .timeline()
        .fromTo(
          passwordError,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "steps(1)" }
        )
        .to(
          passwordInput,
          {
            x: "+=10",
            yoyo: true,
            repeat: 3,
            duration: 0.05,
            ease: "steps(1)",
            onComplete: () => {
              passwordInput.value = "";
            },
          },
          "<"
        )
        .to(passwordError, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          delay: 2,
          ease: "steps(1)",
        });
    }
  };

  const hideSplashScreen = () => {
    gsap.to(splashScreen, {
      opacity: 0,
      duration: 0.5,
      ease: "steps(1)",
      onComplete: () => {
        splashScreen.classList.add("hidden");
        universo.classList.remove("hidden");
        gsap.to(universo, { opacity: 1, duration: 0.5, ease: "steps(1)" });
        iniciarUniverso();
        if (window.iniciarMusica) window.iniciarMusica();
      },
    });
  };

  enterButton.addEventListener("click", handlePasswordEntry);
  passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handlePasswordEntry();
  });

  // ---------- Arranque ----------
  const iniciarUniverso = () => {
    capasFondo = [{ el: document.getElementById("capa-nebulosa"), factor: 0.12 }];

    medirUniverso();
    // Arranca aparcada junto al girasol, no encima: el centro está ocupado.
    posNave.x = CENTRO.x + 170;
    posNave.y = CENTRO.y - 115;

    mundo.style.width = MUNDO_ANCHO + "px";
    mundo.style.height = MUNDO_ALTO + "px";

    crearCuerpos();
    calcularLimites();

    anclaZoom.x = window.innerWidth / 2;
    anclaZoom.y = window.innerHeight / 2;

    animarFlotacionNave();
    configurarControles();
    gsap.ticker.add(bucle);
    animarEntrada();

    gsap.to(pista, { opacity: 0, duration: 1, delay: 6 });
  };

  // El universo se abre mirando el sol de cerca y la cámara se va abriendo
  // despacio hasta descubrir el cúmulo alrededor.
  const animarEntrada = () => {
    introActiva = true;
    camara.escala = ESCALA_ENTRADA;
    escalaObjetivo = ESCALA_ENTRADA;
    centrarEn(CENTRO.x, CENTRO.y);

    gsap.to(camara, {
      escala: ESCALA_INICIAL,
      duration: DURACION_ENTRADA,
      ease: "power2.out",
      onUpdate: () => {
        escalaObjetivo = camara.escala;
      },
      onComplete: () => {
        introActiva = false;
        ultimaInteraccion = gsap.ticker.time;
      },
    });
  };

  // ---------- Reparto de estrellas y planetas ----------
  // Genera valores estables para cada cuerpo a partir de su id, así siempre
  // aparecen igual sin tener que guardar nada a mano.
  const hashTexto = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return h;
  };

  // Revuelve los bits de un número. Es imprescindible: sin esto, ids
  // parecidos (msg-001, msg-002…) dan resultados casi iguales y las estrellas
  // terminan alineadas en diagonal y con colores calcados.
  const revolver = (n) => {
    let h = n | 0;
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
  };

  // Número estable entre 0 y 1 a partir de un id y un "para qué".
  const azarDe = (id, proposito) =>
    revolver(hashTexto(id + "-" + proposito)) / 4294967296;

  // "Profundidad" de 0 a 1: define escala base y orden de superposición.
  const profundidadDe = (id) => azarDe(id, "profundidad");

  // Cada estrella tiene su propio color, siempre el mismo. Se revela recién
  // cuando la visitas: antes de eso todas se ven igual (turquesa, pulsando),
  // así el color es el recuerdo de haberla abierto.
  const colorDeEstrella = (id) =>
    `hsl(${Math.floor(azarDe(id, "color") * 360)}, 85%, 72%)`;

  // Reparte todo dentro del disco (distancia y ángulo al azar, pero siempre
  // los mismos para cada id) y después separa lo que haya caído demasiado
  // junto, para que nada se tape por más contenido que se agregue con los años.
  const repartirCuerpos = () => {
    const lista = [
      ...mensajes.map((dato) => ({ tipo: "estrella", dato, radio: 45 })),
      ...cumpleanos.map((dato) => ({
        tipo: "planeta",
        dato,
        // El del centro es mucho más grande, así que necesita más espacio
        // libre alrededor.
        radio: dato.centro ? 230 : 115,
        // El planeta marcado como centro se queda clavado ahí: ni se reparte
        // al azar, ni orbita, ni lo mueven los empujones de separación.
        fijo: !!dato.centro,
      })),
    ];

    lista.forEach((cuerpo) => {
      if (cuerpo.fijo) {
        cuerpo.x = CENTRO.x;
        cuerpo.y = CENTRO.y;
        return;
      }
      // El exponente decide qué tan apretado queda el centro. 0.5 repartiría
      // parejo por área; 0.8 deja el centro apenas más poblado que el borde,
      // que es como se ve un cúmulo de verdad. Valores altos (antes 1.7)
      // amontonaban casi todo encima del sol.
      const cercania = Math.pow(azarDe(cuerpo.dato.id, "distancia"), 0.8);
      const distancia = RADIO_INTERNO + cercania * (RADIO_EXTERNO - RADIO_INTERNO);
      const angulo = azarDe(cuerpo.dato.id, "angulo") * Math.PI * 2;
      cuerpo.x = CENTRO.x + Math.cos(angulo) * distancia;
      cuerpo.y = CENTRO.y + Math.sin(angulo) * distancia;
    });

    for (let paso = 0; paso < 30; paso++) {
      let hubieronChoques = false;
      for (let i = 0; i < lista.length; i++) {
        for (let j = i + 1; j < lista.length; j++) {
          const a = lista[i];
          const b = lista[j];
          const separacionMinima = a.radio + b.radio;
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let distancia = Math.hypot(dx, dy);
          if (distancia >= separacionMinima) continue;
          if (distancia === 0) {
            dx = 1;
            dy = 0;
            distancia = 1;
          }
          // Si uno de los dos está clavado (el centro), se mueve solo el otro,
          // y el doble, para que la separación quede igual.
          const empuje =
            (separacionMinima - distancia) / (a.fijo || b.fijo ? 1 : 2);
          const ex = (dx / distancia) * empuje;
          const ey = (dy / distancia) * empuje;
          if (!a.fijo) {
            a.x -= ex;
            a.y -= ey;
          }
          if (!b.fijo) {
            b.x += ex;
            b.y += ey;
          }
          hubieronChoques = true;
        }
      }
      if (!hubieronChoques) break;
    }

    return lista;
  };

  const obtenerVisitadas = () => {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_VISTAS)) || [];
    } catch (e) {
      return [];
    }
  };

  const marcarVisitada = (id) => {
    const vistas = obtenerVisitadas();
    if (!vistas.includes(id)) {
      vistas.push(id);
      localStorage.setItem(CLAVE_VISTAS, JSON.stringify(vistas));
    }
  };

  const crearCuerpos = () => {
    const vistas = obtenerVisitadas();

    cuerpos = repartirCuerpos().map((cuerpo) => {
      const { tipo, dato, x, y, fijo } = cuerpo;
      const profundidad = profundidadDe(dato.id);
      const el = document.createElement("div");
      el.dataset.id = dato.id;

      // Lo que está en el borde del cúmulo se ve más apagado que lo del
      // centro: ayuda a leer de un vistazo dónde está el corazón del universo.
      const lejaniaDelCentro = Math.min(
        1,
        Math.hypot(x - CENTRO.x, y - CENTRO.y) / RADIO_EXTERNO
      );
      el.style.setProperty(
        "--brillo",
        (1 - OSCURECER_BORDE * lejaniaDelCentro).toFixed(3)
      );

      // profundidad: 0 = lo más lejos, 1 = lo más cerca. Manda en el tamaño,
      // en el desenfoque y en quién tapa a quién. Como ya no hay estrellas de
      // adorno en el fondo, el rango es amplio para que el "3D" se note.
      if (tipo === "estrella") {
        el.className = "estrella " + (vistas.includes(dato.id) ? "" : "nueva");
        el.style.setProperty("--color-estrella", colorDeEstrella(dato.id));
        el.style.setProperty("--escala", (0.55 + profundidad * 0.95).toFixed(2));
        el.style.setProperty("--desenfoque", ((1 - profundidad) * 0.9).toFixed(2) + "px");
        // Cada una titila a su PROPIA velocidad y arranca en su propio
        // momento: con la misma frecuencia para todas, el cielo entero latía
        // acompasado y se notaba artificial.
        el.style.setProperty(
          "--titileo",
          (2.2 + azarDe(dato.id, "titileo") * 4.6).toFixed(2) + "s"
        );
        el.style.setProperty(
          "--pulso",
          (1.3 + azarDe(dato.id, "pulso") * 1.1).toFixed(2) + "s"
        );
        el.style.setProperty(
          "--retraso",
          (-azarDe(dato.id, "retraso") * 5).toFixed(2) + "s"
        );
        el.style.zIndex = String(Math.round(profundidad * 8) + 1);
      } else {
        el.className = "planeta" + (fijo ? " planeta-centro" : "");
        el.style.setProperty("--color-principal", dato.colorPrincipal);
        el.style.setProperty("--color-secundario", dato.colorSecundario);
        // El del centro va grande y nítido siempre: es el corazón del universo.
        el.style.setProperty("--escala", fijo ? "3.2" : (0.7 + profundidad * 0.8).toFixed(2));
        el.style.setProperty("--desenfoque", fijo ? "0px" : ((1 - profundidad) * 0.7).toFixed(2) + "px");
        if (fijo) el.style.setProperty("--brillo", "1");
        el.style.zIndex = String(fijo ? 12 : Math.round(profundidad * 8) + 2);

        const nombre = document.createElement("span");
        nombre.className = "planeta-nombre";
        nombre.textContent = dato.nombre;
        el.appendChild(nombre);
      }

      mundo.appendChild(el);

      // Se guarda en coordenadas polares respecto al centro: la distancia no
      // cambia nunca, solo el ángulo va avanzando.
      const distancia = Math.max(1, Math.hypot(x - CENTRO.x, y - CENTRO.y));
      const registro = {
        tipo,
        dato,
        el,
        x,
        y,
        fijo,
        distancia: fijo ? 0 : distancia,
        angulo: Math.atan2(y - CENTRO.y, x - CENTRO.x),
        // Todos avanzan a la misma velocidad en píxeles: los de adentro dan
        // la vuelta más rápido, como en un sistema solar de verdad. El del
        // centro no gira (y además dividir por su distancia daría infinito).
        velocidadAngular: fijo ? 0 : VELOCIDAD_ORBITA / distancia,
        lenteAnterior: -1,
        // Última posición realmente escrita en el DOM.
        posPintadaX: Number.NaN,
        posPintadaY: Number.NaN,
        // Arranca en true para que el primer pintado le escriba su posición.
        fueraDeVista: true,
      };

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (huboArrastre) return;
        volarHacia(registro);
      });

      return registro;
    });
  };

  // Hasta dónde puede alejarse del centro antes de que el espacio la traiga
  // de vuelta. Es un círculo, no un rectángulo, porque el contenido también
  // está repartido en disco: así el límite se siente igual en toda dirección.
  const calcularLimites = () => {
    const radioContenido = Math.max(...cuerpos.map((c) => c.distancia));
    limites = {
      radioContenido,
      radioMaximo: radioContenido + MARGEN_LIBRE,
    };
  };

  // ---------- Bucle principal ----------
  const bucle = (tiempo, deltaMs) => {
    // Si la pestaña estuvo en segundo plano, delta puede venir enorme; se
    // recorta para que al volver no salte todo de golpe.
    const dt = Math.min(deltaMs, 50) / 1000;

    moverOrbitas(dt);
    if (naveAnclada) {
      posNave.x = naveAnclada.x + naveDesfase.x;
      posNave.y = naveAnclada.y + naveDesfase.y;
    }
    gestionarPaseo(tiempo, dt);
    posicionarNave();

    if (introActiva) {
      // Mientras se abre el universo manda la animación: nada de inercia ni
      // de elástico peleando con ella.
      centrarEn(CENTRO.x, CENTRO.y);
    } else {
      suavizarZoom();
      aplicarInercia(dt);
      aplicarRegresoElastico();
      // Durante el vuelo la cámara centra el CUERPO, no la nave: así la
      // estrella queda en el medio y la nave aparcada a un costado.
      if (cuerpoEnfocado) centrarEn(cuerpoEnfocado.x, cuerpoEnfocado.y);
    }

    aplicarCamara();
  };

  // ---------- Paseo sin rumbo ----------
  // Si pasa un rato sin que ella toque nada, la nave se va sola a dar vueltas
  // por el espacio. No visita ni abre nada: solo vuela, para que el universo
  // se sienta vivo mientras lo mira.
  const registrarInteraccion = () => {
    ultimaInteraccion = gsap.ticker.time;
    if (modoPaseo) terminarPaseo();
  };

  const empezarPaseo = () => {
    modoPaseo = true;
    naveAnclada = null;
    // Deambula alrededor de lo que ella está mirando, para no perderse de
    // vista mientras vuela.
    paseo.centro.x = (window.innerWidth / 2 - camara.x) / camara.escala;
    paseo.centro.y = (window.innerHeight / 2 - camara.y) / camara.escala;
    const dx = posNave.x - paseo.centro.x;
    const dy = posNave.y - paseo.centro.y;
    paseo.radio = Math.max(140, Math.hypot(dx, dy));
    paseo.angulo = Math.atan2(dy, dx);
    paseo.fase = 0;
    gsap.to(propulsor, { opacity: 0.5, scaleY: 0.7, duration: 1, ease: "power2.out" });
    gsap.to(naveCuerpo, { rotation: 13, duration: 1.4, ease: "power2.inOut" });
  };

  const terminarPaseo = () => {
    modoPaseo = false;
    gsap.to(propulsor, { opacity: 0, scaleY: 0.3, duration: 0.5, ease: "power2.in" });
    gsap.to(naveCuerpo, { rotation: 0, duration: 0.7, ease: "power2.inOut" });
  };

  const gestionarPaseo = (tiempo, dt) => {
    if (vueloActual || cuerpoEnfocado || introActiva || vistaAbiertaId) return;

    if (!modoPaseo) {
      if (tiempo - ultimaInteraccion > ESPERA_PARA_PASEO) empezarPaseo();
      return;
    }

    paseo.angulo += (VELOCIDAD_PASEO / paseo.radio) * dt;
    // El radio respira despacio, así el camino no es un círculo perfecto y
    // parece que anduviera explorando de verdad.
    paseo.fase += dt * 0.22;
    const radio = paseo.radio * (1 + Math.sin(paseo.fase) * 0.35);
    posNave.x = paseo.centro.x + Math.cos(paseo.angulo) * radio;
    posNave.y = paseo.centro.y + Math.sin(paseo.angulo) * radio;
  };

  // Solo hace las cuentas. Escribir en el DOM es trabajo del pintado de abajo,
  // que ya sabe cuáles están en pantalla y cuáles no vale la pena tocar.
  const moverOrbitas = (dt) => {
    cuerpos.forEach((c) => {
      if (c.fijo) return;
      c.angulo += c.velocidadAngular * dt;
      c.x = CENTRO.x + Math.cos(c.angulo) * c.distancia;
      c.y = CENTRO.y + Math.sin(c.angulo) * c.distancia;
    });
  };

  const suavizarZoom = () => {
    const anterior = camara.escala;
    camara.escala += (escalaObjetivo - camara.escala) * SUAVIDAD_ZOOM;
    if (Math.abs(escalaObjetivo - camara.escala) < 0.0005) {
      camara.escala = escalaObjetivo;
    }
    if (camara.escala === anterior) return;
    // Se corrige la cámara para que el punto donde apuntaste no se mueva
    // mientras el zoom avanza.
    const factor = camara.escala / anterior;
    camara.x = anclaZoom.x - (anclaZoom.x - camara.x) * factor;
    camara.y = anclaZoom.y - (anclaZoom.y - camara.y) * factor;
  };

  const aplicarInercia = (dt) => {
    if (cuerpoEnfocado || arrastrando) return;
    if (Math.abs(velocidad.x) < 3 && Math.abs(velocidad.y) < 3) {
      velocidad.x = 0;
      velocidad.y = 0;
      return;
    }
    camara.x += velocidad.x * dt;
    camara.y += velocidad.y * dt;
    const retencion = Math.pow(FRICCION_POR_SEGUNDO, dt);
    velocidad.x *= retencion;
    velocidad.y *= retencion;
  };

  // En vez de un muro, el espacio la trae de vuelta despacito si se alejó
  // demasiado del contenido. Nunca hay un borde duro que golpear.
  const aplicarRegresoElastico = () => {
    if (!limites || arrastrando || cuerpoEnfocado) return;

    // A qué punto del mundo está mirando el centro de la pantalla.
    const vistaX = (window.innerWidth / 2 - camara.x) / camara.escala;
    const vistaY = (window.innerHeight / 2 - camara.y) / camara.escala;

    const dx = vistaX - CENTRO.x;
    const dy = vistaY - CENTRO.y;
    const lejania = Math.hypot(dx, dy);

    // Hasta dónde se la deja ir, según cuánto del cúmulo entre en pantalla:
    //
    // - Mientras el cúmulo NO quepa entero, hay libertad total: se puede
    //   llegar hasta la estrella más lejana y un buen trecho más. (Antes se
    //   le restaba el área visible y el centro de la vista quedaba corto por
    //   media pantalla: las estrellas del borde no se podían centrar nunca.)
    // - Cuando ya cabe entero, el límite se va cerrando solo. No hay a dónde
    //   ir, y así el cúmulo queda encuadrado al alejarse del todo.
    const radioVisible =
      Math.hypot(window.innerWidth / 2, window.innerHeight / 2) / camara.escala;
    const sobraPantalla = Math.max(0, radioVisible - limites.radioContenido);
    const permitido = Math.max(
      limites.radioContenido * 0.1,
      limites.radioContenido + MARGEN_LIBRE * 0.6 - sobraPantalla
    );
    if (lejania <= permitido) return;

    // Cuanto más lejos se fue, más fuerte tira: es un elástico, no un muro.
    const exceso = lejania - permitido;
    const tiron = exceso * camara.escala * FUERZA_REGRESO;
    camara.x += (dx / lejania) * tiron;
    camara.y += (dy / lejania) * tiron;
    // Fuera del límite el impulso se apaga un poco más rápido, si no la
    // inercia pelea contra el regreso.
    velocidad.x *= 0.92;
    velocidad.y *= 0.92;
  };

  const centrarEn = (x, y) => {
    camara.x = window.innerWidth / 2 - x * camara.escala;
    camara.y = window.innerHeight / 2 - y * camara.escala;
  };

  const posicionarNave = () => {
    naveContenedor.style.setProperty("--pos", `${posNave.x}px, ${posNave.y}px`);
  };

  const aplicarCamara = () => {
    mundo.style.transform = `translate(${camara.x}px, ${camara.y}px) scale(${camara.escala})`;
    // Las capas de fondo son un patrón que se repite infinitamente: se
    // desplazan corriendo el patrón, así nunca se acaban por más que viajes.
    // Correr el patrón obliga a repintar toda la pantalla, así que se redondea
    // a píxeles enteros y no se toca si no cambió: los movimientos de menos de
    // un píxel no se ven, pero costaban un repintado completo igual.
    capasFondo.forEach((capa) => {
      const x = Math.round(camara.x * capa.factor);
      const y = Math.round(camara.y * capa.factor);
      if (x === capa.pintadoX && y === capa.pintadoY) return;
      capa.pintadoX = x;
      capa.pintadoY = y;
      capa.el.style.backgroundPosition = `${x}px ${y}px`;
    });
    pintarCuerpos();
  };

  // Efecto lente: lo que está cerca del centro de la pantalla se ve grande y
  // nítido, y hacia los bordes se encoge y se apaga. Es lo que hace que el
  // espacio se sienta curvo y sin bordes, en vez de una hoja recortada.
  const pintarCuerpos = () => {
    const mitadAncho = window.innerWidth / 2;
    const mitadAlto = window.innerHeight / 2;
    const alcance = Math.hypot(mitadAncho, mitadAlto) * LENTE_ALCANCE;
    // Margen generoso alrededor de la pantalla: lo que está más lejos que
    // esto no se ve, así que no vale la pena tocarlo en cada cuadro.
    const limiteX = mitadAncho * 1.6;
    const limiteY = mitadAlto * 1.6;

    cuerpos.forEach((c) => {
      const pantallaX = camara.x + c.x * camara.escala;
      const pantallaY = camara.y + c.y * camara.escala;

      // Fuera de vista: se saltea. Como la posición se recalcula sola a partir
      // del ángulo, al volver a entrar aparece en su sitio sin saltos.
      if (
        Math.abs(pantallaX - mitadAncho) > limiteX ||
        Math.abs(pantallaY - mitadAlto) > limiteY
      ) {
        c.fueraDeVista = true;
        return;
      }

      // Se mueven por transform y no por left/top: así el navegador no tiene
      // que recalcular la posición de todo en cada cuadro.
      //
      // Y solo se reescribe si el cuerpo se movió DE VERDAD en el mundo. Al
      // arrastrar, lo que se mueve es la cámara (el transform del mundo), no
      // los cuerpos: ellos orbitan a 4 px/s, o sea 0.07px por cuadro. Escribir
      // igual ensuciaba veinte elementos por cuadro sin ningún cambio visible,
      // y eso era lo que provocaba tironcitos al desplazarse.
      if (
        c.fueraDeVista ||
        Math.abs(c.x - c.posPintadaX) + Math.abs(c.y - c.posPintadaY) > 0.3
      ) {
        c.posPintadaX = c.x;
        c.posPintadaY = c.y;
        c.el.style.setProperty("--pos", `${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px`);
      }
      c.fueraDeVista = false;

      const distancia = Math.hypot(pantallaX - mitadAncho, pantallaY - mitadAlto);
      const caida = Math.min(1, distancia / alcance) ** 2;
      const lente = 1 - LENTE_ENCOGE * caida;

      // Solo se escribe en el DOM si el cambio se nota. La lente va de 1 a
      // 0.72, así que un paso de 0.012 son unos 25 escalones: imperceptible
      // al ojo, pero menos de la mitad de repintados al desplazarse.
      if (Math.abs(lente - c.lenteAnterior) < 0.012) return;
      c.lenteAnterior = lente;
      c.el.style.setProperty("--lente", lente.toFixed(3));
      c.el.style.setProperty("--opacidad-lente", (1 - LENTE_APAGA * caida).toFixed(3));
    });
  };

  const animarFlotacionNave = () => {
    gsap.fromTo(
      naveFlote,
      { y: -7 },
      { y: 7, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true }
    );
    gsap.fromTo(
      naveFlote,
      { rotation: -3.5 },
      { rotation: 3.5, duration: 3.7, ease: "sine.inOut", repeat: -1, yoyo: true }
    );
  };

  // ---------- Vuelo ----------
  // La nave persigue al cuerpo mientras este sigue orbitando, y aparca AL LADO
  // y no encima: si aterrizara en el centro quedaría tapada por la estrella o
  // el planeta, que es justo lo que se veía mal.
  // Lo suficiente para que el cuerpo de la nave (76px de ancho) nunca tape la
  // estrella ni el planeta al que llegó.
  const separacionDeAparcado = (cuerpo) =>
    cuerpo.tipo === "planeta" ? 92 : 60;

  const volarHacia = (cuerpo) => {
    if (vueloActual) vueloActual.kill();
    // Ojo con el orden: ocultarMensaje devuelve el zoom al valor de antes de
    // la visita anterior, así que hay que acercarse DESPUÉS de llamarlo.
    ocultarMensaje();
    registrarInteraccion();

    naveAnclada = null;
    cuerpoEnfocado = cuerpo;
    velocidad.x = 0;
    velocidad.y = 0;

    // Se acerca un poco al elegir destino; al cerrar el mensaje o volver del
    // planeta, la cámara se abre de nuevo hasta donde estaba.
    escalaAntesDeVisita = escalaObjetivo;
    anclaZoom.x = window.innerWidth / 2;
    anclaZoom.y = window.innerHeight / 2;
    escalaObjetivo = Math.min(ESCALA_MAX, escalaObjetivo * ZOOM_AL_VISITAR);

    // Aparca del lado por el que venía llegando: se siente natural y nunca
    // queda tapada.
    let haciaX = posNave.x - cuerpo.x;
    let haciaY = posNave.y - cuerpo.y;
    const largo = Math.hypot(haciaX, haciaY) || 1;
    const separacion = separacionDeAparcado(cuerpo);
    const desfase = {
      x: (haciaX / largo) * separacion,
      y: (haciaY / largo) * separacion,
    };

    const inicio = { x: posNave.x, y: posNave.y };
    const avance = { valor: 0 };
    const inclinacion = Math.max(-20, Math.min(20, (cuerpo.x - posNave.x) * 0.05));

    vueloActual = gsap
      .timeline({
        onComplete: () => {
          vueloActual = null;
          cuerpoEnfocado = null;
          naveAnclada = cuerpo;
          naveDesfase = desfase;
          alLlegar(cuerpo);
        },
      })
      .to(propulsor, { opacity: 1, scaleY: 1, duration: 0.3, ease: "power2.out" }, 0)
      .to(naveCuerpo, { rotation: inclinacion, duration: 0.4, ease: "power2.out" }, 0)
      .to(
        avance,
        {
          valor: 1,
          duration: DURACION_VUELO,
          ease: "power2.inOut",
          onUpdate: () => {
            const metaX = cuerpo.x + desfase.x;
            const metaY = cuerpo.y + desfase.y;
            posNave.x = inicio.x + (metaX - inicio.x) * avance.valor;
            posNave.y = inicio.y + (metaY - inicio.y) * avance.valor;
          },
        },
        0
      )
      .to(naveCuerpo, { rotation: 0, duration: 0.45, ease: "power2.inOut" }, ">-0.4")
      .to(propulsor, { opacity: 0, scaleY: 0.3, duration: 0.4, ease: "power2.in" }, "<");
  };

  const alLlegar = (cuerpo) => {
    if (cuerpo.tipo === "estrella") {
      cuerpo.el.classList.remove("nueva");
      marcarVisitada(cuerpo.dato.id);
      mostrarMensaje(cuerpo.dato.texto, cuerpo.dato.especial);
    } else {
      abrirVistaPlaneta(cuerpo.dato.id);
    }
  };

  // ---------- Mensajes ----------
  // El mensaje se queda hasta que ella lo cierre: sin cuenta regresiva, para
  // que pueda leerlo con calma y releerlo si quiere.
  const mostrarMensaje = (texto, especial) => {
    mensajeTexto.textContent = texto;
    // Las cartas marcadas como especiales llevan marco dorado.
    mensajeContainer.classList.toggle("especial", !!especial);
    mensajeTexto.scrollTop = 0;
    gsap.fromTo(
      mensajeContainer,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        onStart: () => {
          mensajeContainer.style.pointerEvents = "auto";
        },
      }
    );
  };

  // Devuelve la cámara al zoom que tenía antes de acercarse a visitar algo.
  const restaurarZoom = () => {
    if (escalaAntesDeVisita === null) return;
    anclaZoom.x = window.innerWidth / 2;
    anclaZoom.y = window.innerHeight / 2;
    escalaObjetivo = escalaAntesDeVisita;
    escalaAntesDeVisita = null;
  };

  const ocultarMensaje = () => {
    restaurarZoom();
    gsap.to(mensajeContainer, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        mensajeContainer.style.pointerEvents = "none";
      },
    });
  };

  mensajeCerrar.addEventListener("click", ocultarMensaje);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") ocultarMensaje();
  });

  // ---------- Vistas de planeta ----------
  const abrirVistaPlaneta = (planetaId) => {
    const planeta = cumpleanos.find((p) => p.id === planetaId);
    if (!planeta) return;

    // Planeta que todavía no tiene interior: se puede visitar igual, solo
    // avisa. Así se pueden dejar mundos "reservados" sin romper nada.
    const vistaEl = planeta.vista
      ? document.getElementById("vista-" + planeta.vista)
      : null;
    if (!vistaEl) {
      mostrarMensaje("Este mundo todavía está por construirse. Vuelve pronto.");
      return;
    }
    const controlador = window.vistasPlaneta[planeta.vista];

    vistaAbiertaId = planeta.vista;
    gsap.to(universo, {
      opacity: 0,
      duration: 0.4,
      ease: "steps(1)",
      onComplete: () => {
        universo.classList.add("hidden");
        vistaEl.classList.remove("hidden");
        gsap.to(vistaEl, { opacity: 1, duration: 0.4, ease: "steps(1)" });
        if (controlador && controlador.abrir) controlador.abrir();
      },
    });
  };

  const cerrarVistaActual = () => {
    if (!vistaAbiertaId) return;
    const vistaEl = document.getElementById("vista-" + vistaAbiertaId);
    const controlador = window.vistasPlaneta[vistaAbiertaId];
    if (controlador && controlador.cerrar) controlador.cerrar();

    gsap.to(vistaEl, {
      opacity: 0,
      duration: 0.4,
      ease: "steps(1)",
      onComplete: () => {
        vistaEl.classList.add("hidden");
        vistaAbiertaId = null;
        universo.classList.remove("hidden");
        gsap.to(universo, { opacity: 1, duration: 0.4, ease: "steps(1)" });
        // La cámara se abre de nuevo al volver del planeta.
        restaurarZoom();
        registrarInteraccion();
      },
    });
  };

  document.querySelectorAll("[data-volver]").forEach((boton) => {
    boton.addEventListener("click", cerrarVistaActual);
  });

  // ---------- Controles (mouse, dedo y rueda: todo con Pointer Events) ----------
  const pedirZoom = (factor, centroX, centroY) => {
    anclaZoom.x = centroX;
    anclaZoom.y = centroY;
    escalaObjetivo = Math.min(
      ESCALA_MAX,
      Math.max(ESCALA_MIN, escalaObjetivo * factor)
    );
  };

  const finalizarPuntero = (e) => {
    punterosActivos.delete(e.pointerId);
    if (punterosActivos.size < 2) distanciaPinchAnterior = null;
    if (punterosActivos.size === 0) {
      arrastrando = false;
      // Si frenó y sostuvo antes de soltar, no debe salir volando: ese gesto
      // quiere decir "déjalo justo acá".
      if (performance.now() - tiempoUltimoMovimiento > 120) {
        velocidad.x = 0;
        velocidad.y = 0;
      }
    }
  };

  const configurarControles = () => {
    cielo.addEventListener("pointerdown", (e) => {
      registrarInteraccion();
      punterosActivos.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (punterosActivos.size === 1) {
        arrastrando = true;
        // Se reinicia en cada toque: si el dedo se mueve, el toque cuenta como
        // arrastre y no como clic, para no volar sin querer al soltar.
        huboArrastre = false;
        // Tocar la pantalla frena el impulso y suelta la cámara: mande ella.
        velocidad.x = 0;
        velocidad.y = 0;
        recorridoDelGesto = 0;
        tiempoUltimoMovimiento = performance.now();
        cuerpoEnfocado = null;
        // Corta un zoom que todavía se estuviera asentando: si no, el
        // suavizado sigue corrigiendo la cámara hacia el punto de la rueda y
        // pelea contra el arrastre, que es lo que se sentía irregular.
        escalaObjetivo = camara.escala;
        ultimoPuntero = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener("pointermove", (e) => {
      if (!punterosActivos.has(e.pointerId)) return;
      punterosActivos.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (punterosActivos.size === 2) {
        const puntos = [...punterosActivos.values()];
        const dist = Math.hypot(
          puntos[0].x - puntos[1].x,
          puntos[0].y - puntos[1].y
        );
        if (distanciaPinchAnterior !== null) {
          pedirZoom(
            dist / distanciaPinchAnterior,
            (puntos[0].x + puntos[1].x) / 2,
            (puntos[0].y + puntos[1].y) / 2
          );
        }
        distanciaPinchAnterior = dist;
        return;
      }

      if (arrastrando && punterosActivos.size === 1) {
        const dx = e.clientX - ultimoPuntero.x;
        const dy = e.clientY - ultimoPuntero.y;
        camara.x += dx;
        camara.y += dy;
        ultimoPuntero = { x: e.clientX, y: e.clientY };

        // El recorrido se suma desde que apoyó el dedo, no evento a evento:
        // arrastrando despacito ningún paso pasaba el umbral y el gesto
        // terminaba contando como un toque, disparando un vuelo sin querer.
        recorridoDelGesto += Math.abs(dx) + Math.abs(dy);
        if (recorridoDelGesto > 8) huboArrastre = true;

        // La velocidad se mide con el tiempo REAL entre eventos del puntero.
        // Antes se medía por cuadro, y si en un cuadro el mouse no reportaba
        // nada la velocidad se partía a la mitad: al soltar, a veces había
        // impulso y a veces no. Esa era la sensación de "a veces responde".
        const ahora = performance.now();
        const lapso = (ahora - tiempoUltimoMovimiento) / 1000;
        if (lapso > 0.001) {
          const vx = dx / lapso;
          const vy = dy / lapso;
          velocidad.x = velocidad.x * 0.7 + vx * 0.3;
          velocidad.y = velocidad.y * 0.7 + vy * 0.3;
          limitarVelocidad();
          tiempoUltimoMovimiento = ahora;
        }
      }
    });

    window.addEventListener("pointerup", finalizarPuntero);
    window.addEventListener("pointercancel", finalizarPuntero);

    cielo.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        registrarInteraccion();
        cuerpoEnfocado = null;
        // Proporcional a cuánto giró la rueda, no un escalón fijo: los
        // trackpads mandan muchos eventos chiquitos y con paso fijo el zoom
        // se disparaba, mientras que un mouse de rueda dura se sentía lento.
        const giro = Math.max(-240, Math.min(240, e.deltaY));
        pedirZoom(Math.exp(-giro * 0.0012), e.clientX, e.clientY);
      },
      { passive: false }
    );
  };

  showSplashScreen();
});
