var fs = require("fs");

var path = "./in/archivo_contable.DAT";
var status;

try {
  var filename = require.resolve(path);
  fs.readFile(filename, "utf8", function (err, words) { // Leo el archivo
    status = checkFormat(words); // Verifico el formato del archivo
    if (status.ok) { // Si el formato se encuentra correcto, continuo procesando
      let credit = 0;
      let debit = 0;
      for (let i = 1; i < status.data.length; i++) { // Sumo los creditos
        if (status.data[i][0] === "C") {
          credit = credit + parseInt(status.data[i].slice(1)) / 100;
        } else if (status.data[i][0] === "D") { // Sumo los debitos
          debit = debit + parseInt(status.data[i].slice(1)) / 100;
        } else { // En caso de tener un encabezado erroneo se informa
          console.log("Formato corrupto en C o D");
        }
      }
      let result = credit - debit;
      console.log("$" + result + "  " + status.fecha); // Se muestra resultado
    }
  });
} catch (e) {
  console.log(e);
}

function checkFormat(data) {
  data = data.split("\r\n"); // Separo la data en un arreglo
  let H = data[0][0];
  let regCount = 0;
  let actualLength = 0;
  let fecha = "";

  for (let i = 1; i <= 7; i++) { // Extraigo el numero de registros
    regCount = regCount + parseInt(data[0][i]) * 10 ** (7 - i);
  }
  for (let i = 0; i < data.length; i++) { // Cuento los registros
    actualLength = actualLength + data[i].length;
  }
  for (let i = 7; i < data[0].length; i++) { // Doy formato a la fecha
    if (i === 11 || i === 13 || i == 15) {
      fecha = fecha + "/" + data[0][i];
    } else {
      fecha = fecha + data[0][i];
    }
  }

  if (H !== "H") { // Verifico formato
    console.log("Problema en cantidad de registros");
    return {
      fecha,
      ok: false,
    };
  } else if (regCount !== actualLength) {
    console.log("Cantidad de registros incorrecta");
    return {
      fecha,
      ok: false,
    };
  }
  return { // Devuelvo un objeto con data, fecha y status del formato
    fecha,
    ok: true,
    data,
  };
}
