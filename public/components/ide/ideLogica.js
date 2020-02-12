const appi = require('electron').remote; 
const fs = require("fs");
//Hash map de palabras reservadas
const palabrasReservadas = require('d3-collection').map();
palabrasReservadas
.set("program","rgb(255, 0, 255)")
.set("if","rgb(0,255,0")
.set("else","rgb(255, 0, 0)")
.set("fi","rgb(100, 0, 255)")
.set("do","rgb(50, 100, 255)")
.set("until","rgb(50, 50, 255)")
.set("while","rgb(10, 150, 255)")
.set("read","rgb(150, 50, 255)")
.set("write","rgb(20, 30, 255)")
.set("float","rgb(20, 80, 255)")
.set("int","rgb(100, 200, 255)")
.set("bool","rgb(150, 230, 255)")
.set("not","rgb(255, 245, 255)")
.set("and","rgb(255, 255, 255)")
.set("or","rgb(0, 0, 0)");

const dialog = appi.dialog;
var filepathG = "";
var editor

window.onload = () => {
    editor = new Quill('#editor', {
        theme: 'snow'
    });
}

const ed = document.getElementById("editor");
ed.onkeyup = (e)=>{
    //evento de espacio o enter
    if(e.which == 13 || e.which == 32)
        pintar()
}

//Evento de guardar el archivo con Ctrl + S
document.onkeyup = function(e) {
    
    if (e.ctrlKey && e.which == 83) {
        guardarArchivo()
    }
  };


subirArchivo = async ()=>{
    dialog.showOpenDialog(function (fileNames) {
        // fileName es un array que contiene todos los archivo(s) seleccionado(s)
        if(fileNames === undefined){
            console.log("No se selecciono ningun archivo");
        }else{
            readFile(fileNames[0]);
        }
    }); 
}

readFile = async (filepath)=>{
    filepathG = filepath
    editor.deleteText(0,editor.getLength())
    var lines = await require('fs').readFileSync(filepath, 'utf-8');
    editor.insertText(0,lines);
    console.log(lines);
    pintar()
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
        })
        alert("Archivo guardado con exito")
    }
}

//Revision de los lexemas
pintar = ()=>{
    const infoCodigo = editor.getText(0,editor.getLength());
    let palabra = ""
    //delimitador
    for (let i = 0; i < infoCodigo.length; i++) {
        if(infoCodigo[i] == " " || infoCodigo[i] == "\n"){
            palabra = palabra.trim();
            if(palabrasReservadas.has(palabra)){
                console.log(palabrasReservadas.has(palabra));
                pinta(i,palabra,palabrasReservadas.get(palabra))
            }
            palabra = ""
        }
        palabra += infoCodigo[i];
        console.log(palabra);
    }
}
//pinta la palabra segun la posicion
pinta = (posicion,palabra,color) =>{
    
    editor.formatText(posicion-palabra.length, palabra.length, {
        'bold': true,
        'color': `${color}`
    });

}
