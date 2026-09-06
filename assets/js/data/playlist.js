// Canciones de fondo del universo.
//
// El orden es TOTALMENTE al azar: se baraja la lista entera cada vuelta y
// ninguna canción tiene un lugar reservado. Dentro de una vuelta no se repite
// ninguna hasta que hayan sonado todas.
//
// Para agregar otra: copia el archivo de audio a assets/audio/ y suma un
// bloque como estos. El id debe ser único.
//
// OJO con "titulo": ahora SÍ se ve en pantalla, en el menú de canciones que
// ella abre con el botón ♫. Ponle el nombre de verdad de cada canción.

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
