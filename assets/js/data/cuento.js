// El planeta "Por descubrir": se lee de a una viñeta, con los botones, las
// flechas, tocando la imagen o deslizando el dedo.
//
// LAS IMÁGENES VAN EN: assets/images/
// con exactamente estos nombres: vineta_01.png ... vineta_06.png
// (la última viñeta no lleva imagen: es solo el mensaje de cierre).
//
// Si alguna falta, esa viñeta muestra un recuadro diciendo qué archivo espera,
// así que nada se rompe mientras las vas agregando.
//
// "imagen: null" = viñeta solo de texto. "texto" vacío = solo la imagen.

const cuento = [
  {
    id: "vineta-01",
    imagen: "assets/images/vineta_01.png",
    texto: "Entiendo que el viaje puede asustar, y más si no vamos juntos.",
  },
  {
    id: "vineta-02",
    imagen: "assets/images/vineta_02.png",
    texto:
      "Sé que a veces vamos a sentir que solamente nos rodea el ruido, y no tendremos ni idea de qué hacer.",
  },
  {
    id: "vineta-03",
    imagen: "assets/images/vineta_03.png",
    texto:
      "Pero también recuerda que la vida no para, y si no la vivimos solo la veremos pasar.",
  },
  {
    id: "vineta-04",
    imagen: "assets/images/vineta_04.png",
    texto: "Y aunque a veces nos sintamos solos y asustados...",
  },
  {
    id: "vineta-05",
    imagen: "assets/images/vineta_05.png",
    texto:
      "Recuerda lo bello que es vivir. Recuerda que ahí afuera hay muchas razones para estar feliz.",
  },
  {
    id: "vineta-06",
    imagen: "assets/images/vineta_06.png",
    texto: "Y tú eres la única que puede fijar el curso.",
  },
  {
    // El cierre va sin dibujo: solo la carta.
    id: "vineta-07",
    imagen: null,
    texto:
      "Seguir construyendo este pequeño universo como homenaje a tu existencia es mi tarea. Que sea una manera de celebrar, de recordar, de reconocer; que cuando necesites recordar lo maravillosa que eres y las cosas que inspiras, tengas un cielo estrellado solo para ti. Quizá eso te ayude un poco.\n\nQue no te lo recuerde constantemente no significa que no lo sienta.\n\nTe deseo toda la felicidad del mundo.\n\nFeliz cumpleaños, Josselyn.\nMi niña, mi amor.\nTe Quark, hoy y siempre, aquí y en todas las dimensiones posibles.",
  },
];
