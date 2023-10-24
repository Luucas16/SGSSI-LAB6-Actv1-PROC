const fs = require("fs");
const crypto = require("crypto");

function compareTheFirstLines(fileToCompare, filePath, hashh, filepoints) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data2 = fileContent.split("\n").slice(0, 41);
  fileLines = data2.join("\n");

  // console.log("Mi hash: " + hashh );

  let hash1 = crypto.createHash("sha256");
  hash1.update(fileLines);
  let hashh1 = hash1.digest("hex")
  // console.log(
  //   "El hash de el archivo" + " " + filePath + " " + "es: " + hashh1
  // );

  if (hashh == hashh1) {
    console.log(
      "El archivo ''" +
        filePath +
        "'' tiene las mismas primeras lineas que  ''" +
        fileToCompare +
        "''"
    );
    filepoints++;
  } else {
    console.log(
      "El archivo ''" +
        filePath +
        "'' no tiene las mismas primeras lineas que  ''" +
        fileToCompare +
        "''"
    );
  }
  let resumenSHA256 = crypto.createHash("sha256");
  resumenSHA256.update(fileContent);
  let resumenSHA256Digest = resumenSHA256.digest("hex")
  let cerosConsecutivos = /^0*/.exec(resumenSHA256Digest)[0].length;

  if (cerosConsecutivos > 0) {
    console.log("Cumple la condicion de tener ceros al principio");
    filepoints++;
  } else {
    console.log("No cumple la condicion de tener ceros al principio");
  }

  if (filepoints == 3) {
    filepoints = filepoints + cerosConsecutivos;; 
  }
  console.log("La longitud del prefijo de ceros: "+ cerosConsecutivos +"\n");
  return filepoints;
}

function contieneSecuenciaConsecutiva(fileName) {
  try {
    const fileContent = fs.readFileSync(fileName, 'utf8');
    const data = fileContent.split("\n").slice(0, 42);
    const regex = /(?:1|2|3|4|5|6|7|8|9|a|b|c|d|e|f){8}/;

    return regex.test(data[41]);
  } catch (err) {
    console.error("Error al leer el archivo:", err);
    return false;
  }
}


function compareFileWithFolder(fileToCompare, folderPath) {
  fs.readdir(folderPath, (err, files) => {
    let mejorCandidato = "";
    let mejorPuntos = 0;
    if (err) {
      console.error("Error al leer la carpeta:", err);
      return;
    }
    const fileToCompareContent = fs.readFileSync(fileToCompare, "utf8");
    const data = fileToCompareContent.split("\n").slice(0, 41);
    fileToCompareLines = data.join("\n");

    let hash = crypto.createHash("sha256");
    hash.update(fileToCompareLines);
    let hashh = hash.digest("hex")




    for (const file of files) {
      const filePath = `${folderPath}/${file}`;
      let filepoints = 0;
      let ayuda = 0;
      if (contieneSecuenciaConsecutiva(filePath)) {
        console.log("El archivo " + filePath + " contiene la secuencia consecutiva correcta");
        filepoints++;
      } else {
        console.log("El archivo " + filePath + " no contiene la secuencia consecutiva correcta o en la linea donde deberia estar la secuencia no esta");
      }

       ayuda = compareTheFirstLines(fileToCompare, filePath, hashh,filepoints);
       if (ayuda > mejorPuntos) {
         mejorCandidato = filePath;
         mejorPuntos = ayuda;
         
       }
      
    };
    console.log("\nEl mejor candidato es: " + mejorCandidato);
  }
  )
}

const fileToCompare =
  "C:/Users/GA502/Desktop/Uni/Ikasgaiak/SGSSI/Semana 7/Bloques/SGSSI-23.CB.03.txt";
const folderPath = "C:/Users/GA502/Desktop/Uni/Ikasgaiak/SGSSI/Semana 7/Candidatos";

compareFileWithFolder(fileToCompare, folderPath);
