// Canciones de fondo del universo.
//
// El orden es TOTALMENTE al azar: se baraja la lista entera cada vuelta y
// ninguna canción tiene un lugar reservado. Dentro de una vuelta no se repite
// ninguna hasta que hayan sonado todas.
//
// Para agregar otra: copia el archivo de audio a assets/audio/ y suma un
// bloque como estos. El id debe ser único.
//
// "titulo" y "artista" SÍ se ven en pantalla, en el menú de canciones que ella
// abre con el botón ♫. "artista" es opcional: si falta, solo se muestra el
// título.

const playlist = [
  {
    id: "pista-001",
    titulo: "La increíble historia del hombre que podía volar pero no sabía cómo",
    artista: "Izal",
    archivo: "assets/audio/song_01.mp3",
  },
  {
    id: "pista-002",
    titulo: "Fruta y té",
    artista: "Gepe",
    archivo: "assets/audio/song_02.mp3",
  },
  {
    id: "pista-003",
    titulo: "Flaca",
    artista: "Nanpa Básico",
    archivo: "assets/audio/song_03.mp3",
  },
  {
    id: "pista-004",
    titulo: "Bésame sin sentir",
    artista: "Micro TDH",
    archivo: "assets/audio/song_04.mp3",
  },
];
