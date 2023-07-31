import { Console } from "console";
import fs from "fs";

// Función para leer el contenido de un archivo JSON
function readJsonFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(`data/${filename}`, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

// function readJsonFile(filename) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filename, "utf8", (err, data) => {
//       if (err) reject(err);
//       else resolve(JSON.parse(data));
//     });
//   });
// }

// Función para escribir el contenido en un archivo JSON
function writeJsonFile(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`data/${filename}`, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
// function writeJsonFile(filename, data) {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
//       if (err) reject(err);
//       else resolve();
//     });
//   });
// }



async function ActualizaCuentas() {
  try {


    // Leer los archivos roommates.json y gastos.json
    const roommates = await readJsonFile("roommates.json");
    for (const roommate of roommates) {
      roommate.recibe = 0;
      roommate.debe = 0;
    }

    const gastos = await readJsonFile("gastos.json");

    for (const gasto of gastos) {

      // Calcular la cuota a distribuir entre los roommates
      const cuota = gasto.monto / roommates.length;
      console.log("Cuota a distribuir por cada roommate:", cuota);

      // Distribuir la cuota entre todos los roommates
      for (const roommate of roommates) {
        roommate.debe= roommate.debe + cuota;

        // Si el roommate tiene el mismo nombre que el del gasto actual, restar su cuota al monto distribuido
        if (roommate.nombre === gasto.roommate) {
          roommate.recibe = roommate.recibe + (gasto.monto - cuota);
        }
      }
    }

    console.log("Saldos de los roommates actualizados:", roommates);

    // Escribir los datos actualizados en roommates.json
    await writeJsonFile("roommates.json", roommates);

    console.log("Distribución de gastos completada exitosamente.");
  } catch (error) {
    console.error("Error al distribuir los gastos:", error);
  }
}



// Exportar la función ActualizaCuentas para que sea accesible desde otros archivos
export { ActualizaCuentas };
