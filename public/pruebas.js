const appi = require('electron').remote; 
const fs = require("fs");
const dialog = appi.dialog;
var filepathG = "";
var editor
window.onload = () => {
    editor = new Quill('#editor', {
        modules: { toolbar: '#toolbar' },
        theme: 'snow'
    });
}


subirArchivo = ()=>{
    dialog.showOpenDialog(function (fileNames) {
        // fileName es un array que contiene todos los archivo(s) seleccionado(s)
        if(fileNames === undefined){
            console.log("No se selecciono ningun archivo");
        }else{
            readFile(fileNames[0]);
        }
    }); 
}

async function readFile(filepath){
    filepathG = filepath
    editor.deleteText(0,editor.getLength())
    var lines = await require('fs').readFileSync(filepath, 'utf-8');
    editor.insertText(0,lines);
}
guardarArchivo = ()=>{
    if(filepathG == ""){
        alert("No se ha abierto ningun archivo");
    }else{
        const infoCodigo = editor.getText(0,editor.getLength());
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

pintar = ()=>{
    const infoCodigo = editor.getText(0,editor.getLength());
    let palabra = ""
    //delimitador
    for (let i = 0; i < infoCodigo.length; i++) {
        
        if(infoCodigo[i] === " " || infoCodigo[i] === "\n"){
            console.log(esReservada(palabra));
            if(esReservada(palabra)){
                console.log("reserva");
                pinta(i,palabra)
            }
            console.log(palabra);
            palabra = ""
        }
        if(infoCodigo[i-1] == "\n"){
            palabra += infoCodigo[i+1];
            i++;
        }else{
            palabra += infoCodigo[i];
        }
    }
}
pinta = (posicion,palabra) =>{
    editor.formatText(posicion-palabra.length, posicion, 'italic', true); 
}
esReservada = (palabra) =>{
    let reservada = false;
    switch(palabra){
        case "class": reservada = true;
        break;
        case "int": reservada = true;
        break;
        case "string": reservada = true;
        break;
        default: reservada = false;
        break;
    }
    return reservada;
}

