const appi = require('electron').remote; 
const fs = require("fs");
const path = require("path")
const { exec } = require("child_process");
const { promises } = require('dns');

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
var exec2 = require('child_process').exec;
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
        guardarArchivo(true)
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
    //console.log(lines);
    pintar()
}

guardarArchivo = (alerta)=>{
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
        if(alerta)
            alert("Archivo guardado con exito")
    }
}

//Revision de los lexemas
pintar = ()=>{
    const infoCodigo = editor.getText(0,editor.getLength());
    let palabra = ""
    //delimitador
    for (let i = 0; i < infoCodigo.length; i++) {
        if(infoCodigo[i] == " " || infoCodigo[i] == "\n" || infoCodigo[i] == "{" || infoCodigo[i] == "(" || infoCodigo[i] == ")" || infoCodigo[i] == "}"){
            palabra = palabra.trim();
            if(palabrasReservadas.has(palabra)){
                //console.log(palabrasReservadas.has(palabra));
                pinta(i,palabra,palabrasReservadas.get(palabra))
            }
            palabra = ""
        }
        palabra += infoCodigo[i];
        //console.log(palabra);
    }
}
//pinta la palabra segun la posicion
pinta = (posicion,palabra,color) =>{
    
    editor.formatText(posicion-palabra.length, palabra.length, {
        'bold': true,
        'color': color
    });

}

compilar = () => {
    guardarArchivo(false)
    let codigo = filtrar()
    let comando = "go run ./public/lib/analizadorLexico/main.go "+codigo
    exec(comando, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            alert(error.message)
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            alert(stderr)
            return;
        }
        //console.log(stdout)
        lexico(stdout)
        sintactico()
    })
}
sintactico = () =>{
    var command = "start ./public/lib/analizadorLexico/analizador.exe "+filepathG +" > ./public/lib/analizadorLexico/salida.txt";

    runit(command, 1000).then(function(data){
        console.log("success: ", data);
    }, function(err){
        console.log("fail: ",err);
    });
}
function runit(command, timeout){

    return new Promise(function(resolve, reject){
        var ch = exec2(command, function(error, stdout, stderr){
            if(error){
                reject(error);
            } else{
                resolve("program exited without an error");
            }
        });
        setTimeout(function(){
            resolve("program still running");
        }, timeout)
    });
}



lexico = (salida) => {
    //console.log(salida)
    var arrayTokens = salida.split('|')
    tokens = {
        "RESERVADAS":arrayTokens[0],
        "IDENTIFICADORES":arrayTokens[1],
        "NUMEROS":arrayTokens[2],
        "OPERADORES":arrayTokens[3],
        "TERMINADORES":arrayTokens[4],
        "COMPARADORES":arrayTokens[5],
        "DELIMITADORES":arrayTokens[6],
        "ASIGNACION":arrayTokens[7]
    }
   //console.log(tokens)
    document.getElementById('reservadas').innerHTML = tokens.RESERVADAS
    document.getElementById('identificadores').innerHTML = tokens.IDENTIFICADORES
    document.getElementById('numeros').innerHTML = tokens.NUMEROS
    document.getElementById('operadores').innerHTML = tokens.OPERADORES
    document.getElementById('terminadores').innerHTML = tokens.TERMINADORES
    document.getElementById('comparadores').innerHTML = tokens.COMPARADORES
    document.getElementById('delimitadores').innerHTML = tokens.DELIMITADORES
    document.getElementById('asignacion').innerHTML = tokens.ASIGNACION
}

filtrar = () =>{
    var file = ""
    for (let i = 0; i<filepathG.length; i++){
        if(filepathG[i].charCodeAt() == 92){
            file = file + " "
        }
        else{
            file = file + filepathG[i]
        }
    }
    return file

}
