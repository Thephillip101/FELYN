// Vista del planeta que todavía se está construyendo. No tiene contenido que
// descubrir: su trabajo es que se entienda que el universo no está terminado
// y que cada tanto va a aparecer algo nuevo.
//
// Cuando este mundo esté listo, se reemplaza este archivo por el de verdad,
// se le cambia "vista" al planeta en cumpleanos.js y se le quita "enObra".
document.addEventListener("DOMContentLoaded", () => {
  const textoEl = document.getElementById("obra-texto");

  // Un párrafo por elemento: así no hacen falta saltos de línea escritos a
  // mano y cada uno puede animarse por separado.
  const parrafos = [
    "Este planeta todavía no existe.",
    "Lo estoy construyendo. Va lento, porque las cosas que valen la pena van lentas, y porque quiero que cuando llegues aquí valga la pena haber esperado.",
    "Mientras tanto quiero que sepas esto: el universo no está terminado, y no va a estarlo nunca. Cada año va a aparecer un planeta nuevo, y cada vez que se me ocurra algo que decirte va a encenderse una estrella más allá afuera.",
    "Así que vuelve cuando quieras. Siempre va a haber algo que no estaba la última vez.",
  ];

  let armado = false;

  const armar = () => {
    if (armado) return;
    armado = true;
    parrafos.forEach((linea) => {
      const p = document.createElement("p");
      p.textContent = linea;
      textoEl.appendChild(p);
    });
  };

  window.registrarVistaPlaneta("construccion", {
    abrir: () => {
      armar();
      gsap.fromTo(
        textoEl.children,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.18,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    },
    cerrar: () => {},
  });
});
