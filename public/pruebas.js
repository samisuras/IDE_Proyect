const appi = require('electron').remote; 
const fs = require("fs");
const lineReader = require("line-reader")
const dialog = appi.dialog;
var filepathG = "";
subirArchivo = ()=>{
    dialog.showOpenDialog(function (fileNames) {
                // fileName es un array que contiene todos los archivo(s) seleccionado(s)
               if(fileNames === undefined){
                    console.log("No se selecciono ningun archivo");
               }else{
                    readFile(fileNames[0]);
               }
        });
        
        function readFile(filepath){
            filepathG = filepath
            document.getElementById("codigo").value = "";
            lineReader.eachLine(filepath,(line)=>{
                document.getElementById("codigo").value += line + "\n"
            })
        }
}

guardarArchivo = ()=>{
    console.log(filepathG);
    if(filepathG == ""){
        alert("No se ha abierto ningun archivo");
    }else{
        const infoCodigo = document.getElementById("codigo").value;
        fs.writeFile(filepathG,infoCodigo, (err)=>{
            if(err){
                alert("Ha ocurrido un error al guardar el archivo");
                console.log(err);
                return;
            }

            alert("Archivo guardado con exito")
        })
    }
}

