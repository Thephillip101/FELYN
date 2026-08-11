// Cada cumpleaños es un planeta en el universo.
// "vista" indica qué módulo dibuja su interior — debe coincidir con la clave
// que ese módulo usa al llamar a registrarVistaPlaneta() en mapa.js.
// Si "vista" es null, el planeta se ve y se puede visitar, pero todavía no
// tiene interior: al llegar avisa que ese mundo aún no existe.
// La posición de cada planeta se calcula sola (igual que las estrellas),
// no hace falta guardar coordenadas a mano.

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
];
