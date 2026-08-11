// Vista del planeta girasol — primer cumpleaños. Mismos 14 pétalos y
// mensajes del proyecto original (/planeta-girasol-original), migrados acá
// para vivir dentro del universo. Ya no tiene su propia clave ni su propio
// audio de fondo: eso lo maneja el universo entero.
document.addEventListener("DOMContentLoaded", () => {
  const vista = document.getElementById("vista-girasol");
  const sunflowerContainer = document.getElementById("sunflower-container");
  const sunflowerBaseImage = document.getElementById("sunflower-base-image");

  const petalMessageContainer = document.getElementById(
    "petal-message-container"
  );
  const petalMessage = document.getElementById("petal-message");
  const finalModal = document.getElementById("final-modal");
  const finalModalContent = finalModal.querySelector(".modal-content");

  const helpMessage = document.getElementById("help-message");

  const NUM_PETALS = 14;
  let petalsCollected = 0;
  let inicializado = false;
  const petals = [];

  const petalData = [
    "Para Josselyn, mí ingeniera física favorita (es como una Marie Curie chiquita).",
    "Solía pensar que lo que siento por ti era una constante universal en mi vida, pero es una variable que tiende a crecer indefinidamente.",
    "Admiro tu disciplina y tu gracia, dentro y fuera del agua, mágica sirena que encanta los sentidos.",
    "Nuestra conexión tiene una energía que ni la física puede explicar del todo.",
    "Hay algo en ti que que aun no logro comprender, tal vez es como logras que todo parezca más bonito solo con estar presente.",
    "Tus detalles, tus gestos pequeños, tu ternura inesperada… Son más poderosos que cualquier poema, y mira que he intentado escribir muchos.",
    "Dicen que los girasoles giran buscando el sol, pero el mio ya lo encontró: está en tus ojos, en esa forma en la que haces brillar todo a tu alrededor.",
    "El solo verte existir es motivo de gozo, es fascinante, es como que no te explicas como una persona puede ser tan especial.",
    "A veces me paro a pensar y me sorprende lo rápido que pasa el tiempo... y aun así siento tan reciente esa primera vez que te vi, esa primera sonrisa.",
    "¿Crees que es una casualidad que siempre estés a mi lado en mis conciertos favoritos?, No es un capricho del azar; es la firma del destino en mi playlist personal.",
    "Verte crecer y florecer en la mujer fuerte, brillante y maravillosa que eres me llena de un orgullo inmenso. Te admiro más de lo que las palabras pueden expresar.",
    "Antes no me gustaba la playa… Hasta que fui contigo, Ahora una playa sin Josselyn está incompleta, ahora el sol me sabe a ti.",
    "Quiero que esto te sirva de recordatorio de que FELYN no es solo una palabra, es una promesa disfrazada de nombre.",
    ".",
  ];

  let helpMessageTimeout;
  let petalMessageTimeout;

  const createPetals = () => {
    for (let i = 0; i < NUM_PETALS; i++) {
      const petalImg = document.createElement("img");
      petalImg.src = `assets/images/petal_${String(i + 1).padStart(
        2,
        "0"
      )}.png`;
      petalImg.alt = `Pétalo ${i + 1}`;
      petalImg.classList.add("sunflower-image", "petal");
      petalImg.dataset.index = i;
      sunflowerContainer.appendChild(petalImg);
      petals.push(petalImg);

      gsap.set(petalImg, { opacity: 0, scale: 0.8 });
      gsap.to(petalImg, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.1 * i,
        ease: "back.out(1.7)",
      });
    }
  };

  const setupSunflowerInteraction = () => {
    vista.addEventListener("mousemove", (e) => {
      const containerRect = sunflowerContainer.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      const centerY = containerRect.top + containerRect.height / 2;

      const moveX = (e.clientX - centerX) * 0.01;
      const moveY = (e.clientY - centerY) * 0.01;

      gsap.to(sunflowerContainer, {
        x: moveX * 5,
        y: moveY * 5,
        rotationX: moveY * 0.5,
        rotationY: -moveX * 0.5,
        duration: 0.8,
        ease: "power1.out",
      });
    });
  };

  const hidePetalMessage = () => {
    clearTimeout(petalMessageTimeout);
    gsap.to(petalMessageContainer, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        petalMessageContainer.style.pointerEvents = "none";
        document.removeEventListener("click", clickToHidePetalMessage);

        if (petalsCollected !== NUM_PETALS) {
          startHelpMessageTimer();
        }
      },
    });
  };

  const clickToHidePetalMessage = (event) => {
    if (
      !petalMessageContainer.contains(event.target) &&
      !event.target.classList.contains("petal")
    ) {
      hidePetalMessage();
    }
  };

  const handlePetalClick = (e) => {
    const clickedPetal = e.target;

    if (
      !clickedPetal.classList.contains("petal") ||
      clickedPetal.classList.contains("fallen")
    ) {
      return;
    }

    clearTimeout(helpMessageTimeout);
    hideHelpMessage();
    hidePetalMessage();

    clickedPetal.classList.add("fallen");
    petalsCollected++;

    gsap.timeline().to(clickedPetal, {
      y: clickedPetal.getBoundingClientRect().height * 0.5,
      rotation: gsap.utils.random(-30, 30),
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => (clickedPetal.style.display = "none"),
    });

    if (petalsCollected === NUM_PETALS) {
      handleAllPetalsCollected();
    } else {
      const message = petalData.at(petalsCollected - 1);
      if (message) {
        petalMessage.textContent = message;
      } else {
        petalMessage.textContent = "¡SORPRESA INESPERADA!";
      }

      gsap.timeline().fromTo(
        petalMessageContainer,
        { opacity: 0, y: 20, pointerEvents: "none" },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          onStart: () => {
            petalMessageContainer.style.pointerEvents = "auto";
            document.addEventListener("click", clickToHidePetalMessage);
          },
          onComplete: () => {
            petalMessageTimeout = setTimeout(() => {
              hidePetalMessage();
            }, 15000);
          },
        }
      );
    }
  };

  const showHelpMessage = () => {
    gsap.to(helpMessage, { opacity: 1, duration: 0.5, ease: "steps(1)" });
  };

  const hideHelpMessage = () => {
    gsap.to(helpMessage, { opacity: 0, duration: 0.5, ease: "steps(1)" });
  };

  const startHelpMessageTimer = () => {
    clearTimeout(helpMessageTimeout);
    helpMessageTimeout = setTimeout(showHelpMessage, 15000);
  };

  const handleAllPetalsCollected = () => {
    clearTimeout(helpMessageTimeout);
    hideHelpMessage();

    sunflowerContainer.removeEventListener("click", handlePetalClick);
    sunflowerContainer.style.pointerEvents = "none";

    gsap.to(sunflowerContainer, {
      scale: 0.8,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap
      .timeline({ delay: 1 })
      .to(finalModal, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "steps(1)",
      })
      .to(
        finalModalContent,
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
        },
        "<0.2"
      );
  };

  const abrirGirasol = () => {
    if (inicializado) return;
    inicializado = true;

    sunflowerBaseImage.src = "assets/images/sunflower_base.png";
    createPetals();
    setupSunflowerInteraction();
    sunflowerContainer.addEventListener("click", handlePetalClick);
    startHelpMessageTimer();
  };

  const cerrarGirasol = () => {
    clearTimeout(helpMessageTimeout);
    hideHelpMessage();
  };

  window.registrarVistaPlaneta("girasol", {
    abrir: abrirGirasol,
    cerrar: cerrarGirasol,
  });
});
