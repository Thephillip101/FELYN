// Herramienta para cifrar el contenido del universo.
//
// PARA QUE SIRVE
// El repositorio es publico. Sin esto, cualquiera que lo abra puede leer las
// notas sin escribir el codigo. Con esto, lo unico que se publica es un bloque
// cifrado que no se puede leer sin el.
//
// COMO SE USA
//   node cifrar.js              -> lee los archivos de texto y escribe el cifrado
//   node cifrar.js --descifrar  -> recupera los archivos de texto desde el cifrado
//
// Te va a pedir el codigo. NO esta escrito en ningun sitio de este repositorio,
// y no debe estarlo: si estuviera, cifrar no serviria de nada.
//
// RED DE SEGURIDAD
// Los archivos de texto no se suben (estan en .gitignore), asi que si pierdes
// el computador el archivo cifrado que si esta en GitHub es tambien tu copia de
// respaldo: con --descifrar lo recuperas todo.
//
// PROTECCION CONTRA ERRORES
// Antes de cifrar nada, comprueba el codigo contra el cifrado que ya existe. Si
// te equivocas al escribirlo, se detiene. Sin eso, un dedazo cifraria todo con
// un codigo equivocado y ella no podria abrir nada.
//
// QUE TAN SEGURO ES
// El codigo tiene 5 letras. Deja fuera por completo a cualquiera que pase por
// ahi y mire, que es el riesgo de verdad. No pretende resistir a alguien
// decidido con una tarjeta grafica, porque 5 letras no dan para mas.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const readline = require("readline");

const VUELTAS = 250000;
const DIR = path.join(__dirname, "assets", "js", "data");
const SALIDA = path.join(DIR, "cifrado.js");

const ARCHIVOS = [
  { archivo: "mensajes.js", variable: "mensajes" },
  { archivo: "cuento.js", variable: "cuento" },
  { archivo: "final.js", variable: "final" },
];

const pedirClave = () => {
  // La variable de entorno existe para poder automatizarlo; si no esta, lo pregunta.
  if (process.env.FELYN_CLAVE) return Promise.resolve(process.env.FELYN_CLAVE.trim());
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("Codigo: ", (respuesta) => {
      rl.close();
      resolve(String(respuesta).trim());
    });
  });
};

const leerPaquete = () => {
  if (!fs.existsSync(SALIDA)) return null;
  const codigo = fs.readFileSync(SALIDA, "utf8");
  return new Function(codigo + "\nreturn contenidoCifrado;")();
};

const abrirPaquete = (paquete, clave) => {
  const sal = Buffer.from(paquete.sal, "base64");
  const iv = Buffer.from(paquete.iv, "base64");
  const todo = Buffer.from(paquete.datos, "base64");
  const etiqueta = todo.subarray(todo.length - 16);
  const datos = todo.subarray(0, todo.length - 16);
  const llave = crypto.pbkdf2Sync(Buffer.from(clave, "utf8"), sal, paquete.vueltas, 32, "sha256");
  const descifrador = crypto.createDecipheriv("aes-256-gcm", llave, iv);
  descifrador.setAuthTag(etiqueta);
  const texto = Buffer.concat([descifrador.update(datos), descifrador.final()]).toString("utf8");
  return JSON.parse(texto);
};

// Comprueba el codigo contra el cifrado que ya existe. Es lo que evita que un
// dedazo deje el universo cerrado con un codigo que nadie conoce.
const comprobarClave = (clave) => {
  const paquete = leerPaquete();
  if (!paquete) return true; // primera vez: no hay contra que comparar
  try {
    abrirPaquete(paquete, clave);
    return true;
  } catch (e) {
    return false;
  }
};

function cifrar(clave) {
  const contenido = {};
  for (const { archivo, variable } of ARCHIVOS) {
    const ruta = path.join(DIR, archivo);
    if (!fs.existsSync(ruta)) {
      throw new Error("Falta " + archivo + ". Si lo borraste: node cifrar.js --descifrar");
    }
    const codigo = fs.readFileSync(ruta, "utf8");
    contenido[variable] = new Function(codigo + "\nreturn " + variable + ";")();
  }

  const sal = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const llave = crypto.pbkdf2Sync(Buffer.from(clave, "utf8"), sal, VUELTAS, 32, "sha256");
  const cifrador = crypto.createCipheriv("aes-256-gcm", llave, iv);
  const datos = Buffer.concat([cifrador.update(JSON.stringify(contenido), "utf8"), cifrador.final()]);
  const conEtiqueta = Buffer.concat([datos, cifrador.getAuthTag()]);

  const paquete = {
    v: 1,
    vueltas: VUELTAS,
    sal: sal.toString("base64"),
    iv: iv.toString("base64"),
    datos: conEtiqueta.toString("base64"),
  };

  fs.writeFileSync(
    SALIDA,
    "// GENERADO POR cifrar.js - NO EDITAR A MANO.\n" +
      "// Los textos de verdad estan en mensajes.js, cuento.js y final.js, que se\n" +
      "// quedan en tu computador y no se suben. Despues de cambiarlos, corre:\n" +
      "//     node cifrar.js\n" +
      "// y sube el resultado.\n" +
      "const contenidoCifrado = " + JSON.stringify(paquete, null, 2) + ";\n"
  );

  // Comprobacion inmediata: se vuelve a abrir lo que se acaba de escribir.
  const revisado = abrirPaquete(leerPaquete(), clave);
  for (const { variable } of ARCHIVOS) {
    if (JSON.stringify(revisado[variable]) !== JSON.stringify(contenido[variable])) {
      throw new Error("La comprobacion fallo en " + variable + ". NO subas esto.");
    }
  }

  console.log("Cifrado y comprobado: assets/js/data/cifrado.js");
  for (const { variable } of ARCHIVOS) {
    const v = contenido[variable];
    console.log("   " + variable + ": " + (Array.isArray(v) ? v.length + " elementos" : "objeto"));
  }
}

function descifrar(clave) {
  const paquete = leerPaquete();
  if (!paquete) throw new Error("No existe cifrado.js");
  const contenido = abrirPaquete(paquete, clave);
  for (const { archivo, variable } of ARCHIVOS) {
    fs.writeFileSync(
      path.join(DIR, archivo),
      "// Recuperado con: node cifrar.js --descifrar\n" +
        "const " + variable + " = " + JSON.stringify(contenido[variable], null, 2) + ";\n"
    );
    console.log("Recuperado " + archivo);
  }
  console.log("");
  console.log("Ojo: el cifrado guarda los textos, no los comentarios de esos archivos.");
}

(async () => {
  try {
    const clave = await pedirClave();
    if (!clave) throw new Error("No escribiste ningun codigo.");
    if (!comprobarClave(clave)) {
      throw new Error("Ese codigo no abre el cifrado actual. No se toco nada.");
    }
    if (process.argv.includes("--descifrar")) descifrar(clave);
    else cifrar(clave);
  } catch (e) {
    console.error("ERROR: " + e.message);
    process.exit(1);
  }
})();
