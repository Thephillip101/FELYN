// Canciones de fondo del universo.
//
// La PRIMERA de la lista suena siempre al empezar; las demás salen en orden
// aleatorio, sin repetirse hasta que suenen todas. Así que deja arriba la
// canción con la que quieres que se abra el universo.
//
// Para agregar otra: copia el archivo de audio a assets/audio/ y suma un
// bloque como estos. El id debe ser único.
// "titulo" es solo para que tú sepas cuál es cuál; no se muestra en pantalla.

const playlist = [
  {
    id: "pista-001",
    titulo: "Canción 1",
    archivo: "assets/audio/song_01.mp3",
  },
  {
    id: "pista-002",
    titulo: "Canción 2",
    archivo: "assets/audio/song_02.mp3",
  },
  {
    id: "pista-003",
    titulo: "Canción 3",
    archivo: "assets/audio/song_03.mp3",
  },
  {
    id: "pista-004",
    titulo: "Canción 4",
    archivo: "assets/audio/song_04.mp3",
  },
];
