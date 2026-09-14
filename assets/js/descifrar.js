// Abre el contenido del universo con la clave que ella escribe.
//
// Lo que se publica en GitHub es solo un bloque cifrado (cifrado.js). Los
// textos de verdad aparecen aqui, en su navegador, y solo si la clave es
// correcta. Por eso ya no hay ninguna clave escrita en el codigo: si el
// descifrado funciona, la clave era buena; si no, no lo era.
//
// Necesita conexion segura (https o localhost) porque crypto.subtle no existe
// en paginas abiertas con file://. Es otra razon para no abrir el index.html
// haciendo doble clic.
window.abrirContenido = async (clave) => {
  if (typeof contenidoCifrado === "undefined") return false;
  if (!window.crypto || !window.crypto.subtle) return false;

  const deBase64 = (texto) =>
    Uint8Array.from(atob(texto), (c) => c.charCodeAt(0));

  try {
    const paquete = contenidoCifrado;

    const material = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(clave),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    // Derivacion lenta a proposito: encarece muchisimo probar claves al azar.
    const llave = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: deBase64(paquete.sal),
        iterations: paquete.vueltas,
        hash: "SHA-256",
      },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    // Si la clave no es la correcta, esto lanza: AES-GCM comprueba que el
    // contenido no haya sido tocado y que la llave sea la que toca.
    const claro = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: deBase64(paquete.iv) },
      llave,
      deBase64(paquete.datos)
    );

    const contenido = JSON.parse(new TextDecoder().decode(claro));

    // A partir de aqui el resto del proyecto los usa como siempre.
    window.mensajes = contenido.mensajes;
    window.cuento = contenido.cuento;
    window.final = contenido.final;
    return true;
  } catch (e) {
    return false;
  }
};
