// Cada cumpleaños es un planeta en el universo.
// "vista" indica qué módulo dibuja su interior — debe coincidir con la clave
// que ese módulo usa al llamar a registrarVistaPlaneta() en mapa.js.
// Si "vista" es null, el planeta se ve y se puede visitar, pero todavía no
// tiene interior: al llegar avisa que ese mundo aún no existe.
// La posición de cada planeta se calcula sola (igual que las estrellas),
// no hace falta guardar coordenadas a mano.
//
// "tamano" es opcional: 1 es el tamaño normal de un planeta. Subirlo lo hace
// más grande y le reserva más espacio libre alrededor, para que no se tape
// con nada. El del centro tiene su propio tamaño y no usa este campo.
//
// "enObra: true" lo dibuja con andamios girando alrededor: es un mundo que
// todavía se está construyendo.

const cumpleanos = [
  {
    id: "planeta-girasol",
    vista: "girasol",
    nombre: "Girasol",
    colorPrincipal: "#ffd700",
    colorSecundario: "#e0b64a",
    // Es el centro del universo: no orbita, todo lo demás gira a su alrededor.
    // Solo un planeta puede llevar esta marca.
    centro: true,
  },
  {
    id: "planeta-frio",
    vista: "frio",
    // TODO: falta ponerle nombre cuando definas el cuento.
    nombre: "Por descubrir",
    colorPrincipal: "#8fd9ff",
    colorSecundario: "#eaf6ff",
  },
  {
    // El planeta que se está construyendo. Es grande a propósito: se ve desde
    // lejos, y esa es la idea — que se note que el universo sigue creciendo.
    // Cuando esté listo, se le cambia "vista" y se le quita "enObra".
    id: "planeta-obra",
    vista: "construccion",
    nombre: "En construcción",
    colorPrincipal: "#7b6bb0",
    colorSecundario: "#d5c8f2",
    tamano: 2.1,
    enObra: true,
  },
];
