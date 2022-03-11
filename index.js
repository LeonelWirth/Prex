var fs = require("fs");

var path = "./in/archivo_contable.DAT";
var status;

try {
  var filename = require.resolve(path);
  fs.readFile(filename, "utf8", function (err, words) {
    status = checkFormat(words);
    if (status.ok) {
      let credit = 0;
      let debit = 0;
      for (let i = 1; i < status.data.length; i++) {
        if (status.data[i][0] === "C") {
          credit = credit + parseInt(status.data[i].slice(1)) / 100;
        } else if (status.data[i][0] === "D") {
          debit = debit + parseInt(status.data[i].slice(1)) / 100;
        } else {
          console.log("Formato corrupto en C o D");
        }
      }
      let result = credit - debit;
      console.log("$" + result + "  " + status.fecha);
    }
  });
} catch (e) {
  console.log(e);
}

function checkFormat(data) {
  data = data.split("\r\n");
  let H = data[0][0];
  let regCount = 0;
  let actualLength = 0;
  let fecha = "";

  for (let i = 1; i <= 7; i++) {
    regCount = regCount + parseInt(data[0][i]) * 10 ** (7 - i);
  }
  for (let i = 0; i < data.length; i++) {
    actualLength = actualLength + data[i].length;
  }
  for (let i = 7; i < data[0].length; i++) {
    if (i === 11 || i === 13 || i == 15) {
      fecha = fecha + "/" + data[0][i];
    } else {
      fecha = fecha + data[0][i];
    }
  }

  if (H !== "H") {
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
  return {
    fecha,
    ok: true,
    data,
  };
}
