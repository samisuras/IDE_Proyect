const appi = require('electron').remote;
const fs = require("fs");
const path = require("path")
const { exec } = require("child_process");
const { promises } = require('dns');
const { table } = require('console');

//Hash map de palabras reservadas
const palabrasReservadas = require('d3-collection').map();
palabrasReservadas
    .set("program", "rgb(255, 0, 255)")
    .set("if", "rgb(0,255,0")
    .set("else", "rgb(255, 0, 0)")
    .set("fi", "rgb(100, 0, 255)")
    .set("do", "rgb(50, 100, 255)")
    .set("until", "rgb(50, 50, 255)")
    .set("while", "rgb(10, 150, 255)")
    .set("read", "rgb(150, 50, 255)")
    .set("write", "rgb(20, 30, 255)")
    .set("float", "rgb(20, 80, 255)")
    .set("int", "rgb(100, 200, 255)")
    .set("bool", "rgb(150, 230, 255)")
    .set("not", "rgb(255, 245, 255)")
    .set("and", "rgb(255, 255, 255)")
    .set("then", "rgb(255, 150, 25)")
    .set("or", "rgb(0, 0, 0)");

const dialog = appi.dialog;
var filepathG = "";
var editor
var ts = [];
var asig = [];
var tablaSimbolos = []
var exec2 = require('child_process').exec;
window.onload = () => {
    editor = new Quill('#editor', {
        theme: 'snow'
    });
}

const ed = document.getElementById("editor");
ed.onkeyup = (e) => {
    //evento de espacio o enter
    if (e.which == 13 || e.which == 32)
        pintar()
}

//Evento de guardar el archivo con Ctrl + S
document.onkeyup = function (e) {

    if (e.ctrlKey && e.which == 83) {
        guardarArchivo(true)
    }
};


subirArchivo = async () => {
    dialog.showOpenDialog(function (fileNames) {
        // fileName es un array que contiene todos los archivo(s) seleccionado(s)
        if (fileNames === undefined) {
            console.log("No se selecciono ningun archivo");
        } else {
            readFile(fileNames[0]);
        }
    });
}

readFile = async (filepath) => {
    filepathG = filepath
    editor.deleteText(0, editor.getLength())
    var lines = await require('fs').readFileSync(filepath, 'utf-8');
    editor.insertText(0, lines);
    //console.log(lines);
    pintar()
}

guardarArchivo = (alerta) => {
    if (filepathG == "") {
        alert("No se ha abierto ningun archivo");
    } else {
        const infoCodigo = editor.getText(0, editor.getLength());
        fs.writeFile(filepathG, infoCodigo, (err) => {
            if (err) {
                alert("Ha ocurrido un error al guardar el archivo");
                console.log(err);
                return;
            }
        })
        if (alerta)
            alert("Archivo guardado con exito")
    }
}

//Revision de los lexemas
pintar = () => {
    const infoCodigo = editor.getText(0, editor.getLength());
    let palabra = ""
    //delimitador de linea
    //linea = 0;
    for (let i = 0; i < infoCodigo.length; i++) {
        if (infoCodigo[i] == " " || infoCodigo[i] == "\n" || infoCodigo[i] == "{" || infoCodigo[i] == "(" || infoCodigo[i] == ")" || infoCodigo[i] == "}") {
            //Checa si es nueva linea para incrementar contador
            /*if(infoCodigo[i] == "\n"){
                linea++
            }*/
            palabra = palabra.trim();
            if (palabrasReservadas.has(palabra)) {
                //console.log(palabrasReservadas.has(palabra));
                pinta(i, palabra, palabrasReservadas.get(palabra))
            }
            palabra = ""
        }
        palabra += infoCodigo[i];
        //console.log(palabra);
    }

}
//pinta la palabra segun la posicion
pinta = (posicion, palabra, color) => {

    editor.formatText(posicion - palabra.length, palabra.length, {
        'bold': true,
        'color': color
    });

}

compilar = () => {
    document.getElementById('salida').innerHTML = ""
    guardarArchivo(false)
    let codigo = filtrar()
    let comando = "go run ./public/lib/analizadorLexico/main.go " + codigo
    exec('node ./public/tests/tree', (error, stdout, stderr) => {
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
        document.getElementById('arbolito').innerHTML = stdout
        //console.log(stdout)
    })
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
        semantico()
    })
}
semantico = () => {
    let comando = "go run ./public/lib/analizadorSemantico/main.go "
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
        console.log(stdout)
        document.getElementById('salida').innerHTML = stdout
    })


}
sintactico = () => {
    var command = "start ./public/lib/analizadorLexico/analizador.exe " + filepathG + " > ./public/lib/analizadorLexico/salida.txt";

    runit(command, 1000).then(function (data) {
        console.log("success: ", data);
    }, function (err) {
        console.log("fail: ", err);
    });
}
function runit(command, timeout) {

    return new Promise(function (resolve, reject) {
        var ch = exec2(command, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            } else {
                resolve("program exited without an error");
            }
        });
        setTimeout(function () {
            resolve("program still running");
        }, timeout)
    });
}



lexico = (salida) => {
    //console.log(salida)
    var arrayTokens = salida.split('|')
    tokens = {
        "RESERVADAS": arrayTokens[0],
        "IDENTIFICADORES": arrayTokens[1],
        "NUMEROS": arrayTokens[2],
        "OPERADORES": arrayTokens[3],
        "TERMINADORES": arrayTokens[4],
        "COMPARADORES": arrayTokens[5],
        "DELIMITADORES": arrayTokens[6],
        "ASIGNACION": arrayTokens[7]
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
    var cadena = editor.getText(9, editor.getLength())
    cadena = cadena.trim()
    sentencias = ""
    for(i=0;i<cadena.length;i++){
        if(i == cadena.length-1){
            break;
        }
        sentencias = sentencias + cadena [i]
    }
    fs.appendFile('sentencias.txt', sentencias, (error) => {
        if (error) {
            throw error;
        }
    })
    tabla();
    generarTabla()
    datos()
    complementar()
}
function complementar() {
    var textoTs = ""
    for (let i = 0; i < tablaSimbolos.length; i++) {
        textoTs += tablaSimbolos[i];

    }
    fs.appendFile('ts2.txt', textoTs, (error) => {
        if (error) {
            throw error;
        }
    })



}

function filtrar() {
    var file = ""
    for (let i = 0; i < filepathG.length; i++) {
        if (filepathG[i].charCodeAt() == 92) {
            file = file + " "
        }
        else {
            file = file + filepathG[i]
        }
    }
    return file

}

function tabla() {
    const infoCodigo = editor.getText(0, editor.getLength());

    let palabra = ""
    //delimitador de linea
    linea = 1;
    fs.unlink('tablaSimbolos.txt', function (err) {
        if (err) throw err;
    });
    for (let i = 0; i < infoCodigo.length; i++) {

        if (infoCodigo[i] == " " || infoCodigo[i] == "\n" || infoCodigo[i] == "{" || infoCodigo[i] == "(" || infoCodigo[i] == ")" || infoCodigo[i] == "}") {
            //Checa si es nueva linea para incrementar contador
            if (infoCodigo[i] == "\n") {
                linea++
            }
            palabra = palabra.trim();
            if (palabrasReservadas.has(palabra)) {
                switch (palabra) {
                    case 'int': //tipo 1
                        recuperarLinea(palabra, i, linea, 0);
                        break;
                    case 'float': // tipo 2
                        recuperarLinea(palabra, i, linea, '0.0');
                        break;
                    case 'bool': // tipo 3
                        recuperarLinea(palabra, i, linea, 'false');
                        break;
                }
            }
            palabra = ""
        }
        palabra += infoCodigo[i];
    }
    //
}

function recuperarLinea(palabra, posicion, linea, valor) {
    const infoCodigo = editor.getText(0, editor.getLength());
    ids = "";
    for (let i = posicion; i < infoCodigo.length; i++) {
        if (infoCodigo[i] != ';') {
            if (infoCodigo[i] != " ") {
                ids += infoCodigo[i];
            }
        }
        else {
            break;
        }
    }

    insertarTabla(palabra, ids, linea, valor)
}

function insertarTabla(palabra, ids, linea, valor) {

    if (ids.length > 1) {
        identificadores = ids.split(',');
        for (let i = 0; i < identificadores.length; i++) {
            texto = palabra + ',' + linea + ',' + identificadores[i] + ',' + valor + '|';
            if (duplicidad(palabra + '|' + identificadores[i]) == false) {
                ts.push(palabra + '|' + identificadores[i])
                guardarEnTabla(texto);
                tablaSimbolos.push(texto)
            }
            else {
                document.getElementById('salida').innerHTML = "Error Semantico: doble declaración en la línea " + linea;
            }

        }
    }
    else {
        texto = palabra + ',' + linea + ',' + ids + ',' + valor + '|';
        if (duplicidad(palabra + '|' + ids) == false) {
            ts.push(palabra + '|' + ids)
            guardarEnTabla(texto);
            tablaSimbolos.push(texto)

        }
        else {
            document.getElementById('salida').innerHTML = "Error Semantico: doble declaración en la línea " + linea;
        }

    }
}

function guardarEnTabla(texto) {
    fs.appendFile('tablaSimbolos.txt', texto, (error) => {
        if (error) {
            throw error;
        }
    })
}

function duplicidad(texto) {
    var id = texto.split('|');
    var aux;
    for (let i = 0; i < ts.length; i++) {
        aux = ts[i].split('|');
        if (aux[1] == id[1]) {
            console.log(id[1] + ' Ya esta en la lista')
            return true;
        }
    }

    return false;

}

function generarTabla() {
    var tabla = [];
    var aux;
    for (let i = 0; i < tablaSimbolos.length; i++) {
        tabla.push(tablaSimbolos[i].split(','))
    }
    let table = "";
    for (let i = 0; i < tabla.length; i++) {
        let cadena = "<tr>"
        for (let j = 0; j < 4; j++) {
            if (j == 3) {
                aux = tabla[i][j].split('|');
            }
            if (tabla[i][j] == null) {
                break;
            }
            else {
                if (j == 3) {
                    cadena += "<td>" + aux[0] + "</td>";
                }
                else {
                    cadena += "<td>" + tabla[i][j] + "</td>";
                }
            }
        }
        cadena += "</tr>"
        table += cadena;
    }

    document.getElementById('ts').innerHTML = table;


}

function datos() {

    const infoCodigo = editor.getText(0, editor.getLength());
    linea = 1;
    inicioLinea = 0;
    aux = 0;
    var asignacion;
    for (let i = 0; i < infoCodigo.length; i++) {
        if (infoCodigo[i] == "\n") {
            linea++
            inicioLinea = i + 1;
            aux = inicioLinea;
        }
        if (infoCodigo[i] == "=" && infoCodigo[i + 1] != "=") {
            insertarAsignacion(aux)
        }
        else {
            inicioLinea = 0;

        }

    }
    if (asig.length > 0) {
        verificarTipo()
    }

}

function insertarAsignacion(inicioLinea) {
    const infoCodigo = editor.getText(0, editor.getLength());
    linea = "";
    for (let i = inicioLinea; i < infoCodigo.length; i++) {
        if (infoCodigo[i] != ';') {
            linea += infoCodigo[i];
        }
        else {
            linea = linea.trim()
            break;
        }
    }
    asig.push(linea);
}

function verificarTipo() {
    var asignacion;
    for (let i = 0; i < asig.length; i++) {
        asignacion = asig[i].split('=');
        //console.log(asignacion)
        buscarEnTabla(asignacion[0], asignacion[1]);
        asignacion = null;

    }
}
function buscarEnTabla(id, expresion) {
    fs.readFile('tablaSimbolos.txt', 'utf8', (error, datos) => {
        if (error) throw error;
        simbolos = datos.split('|')
        var data = [];
        bandera = false;
        pos = 0;
        for (let i = 0; i < simbolos.length; i++) {
            data.push(simbolos[i].split(','))
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i][2] == id) {
                //console.log(data[i][2]," = ",id)
                bandera = true;
                pos = i;
                break;
            }
        }
        if (bandera == true) {
            expresion = expresion.trim();
            switch (data[pos][0]) {
                case 'int':
                    if (parseInt(expresion) > 0 || parseInt(expresion) < 0) {
                        actualizarTabla(id, expresion)
                    }
                    else {
                        if (expresion.includes('+') ||
                            expresion.includes('-') ||
                            expresion.includes('*') ||
                            expresion.includes('/')) {

                        }
                        else {
                            document.getElementById('salida').innerHTML = "Se esperaba un tipo int";
                        }
                    }
                    break;
                case 'float':
                    if (isNaN(parseFloat(expresion)) == true) {
                        document.getElementById('salida').innerHTML = "Se esperaba un tipo float";

                    }
                    else {
                        actualizarTabla(id, expresion)

                    }
                    break;
                case 'bool':
                    if (expresion == 'true' || expresion == 'false') {
                        actualizarTabla(id, expresion)
                    }
                    else {
                        document.getElementById('salida').innerHTML = "Se esperaba un tipo bool";
                    }
                    break;
            }

        }
        else {
            bandera = false;
            
            //document.getElementById('salida').innerHTML = "El identificador " + id + " no se ha declarado"

            
        }
    });

}

function actualizarTabla(id, expresion) {

    fs.readFile('tablaSimbolos.txt', 'utf8', (error, datos) => {
        if (error) throw error;
        var partes = datos.split('|');
        var aux;
        var cadena = "";
        for (let i = 0; i < partes.length; i++) {
            aux = partes[i].split(',');
            if (aux[2] == id) {
                expresion = expresion.replace(/\s+/g, ' ');
                cadena = aux[0] + ',' + aux[1] + ',' + aux[2] + ',' + aux[3] + '|';
                var texto = aux[0] + ',' + aux[1] + ',' + aux[2] + ',' + expresion;
                actualizarArchivo(cadena.toString(), texto.toString())
            }
        }
    });
}

function actualizarArchivo(cadena, texto) {
    var aux = texto.split(',');
    var expresion = aux[3] + " ";
    var termino = "";
    var tipo = aux[0];
    var expresionValida = " ";
    var bandera = false;
    var resultado;
    if (expresion.includes('+') || expresion.includes('-') || expresion.includes('*') || expresion.includes('/')) {
        for (let i = 0; i < expresion.length; i++) {
            if (expresion[i] != " " && (expresion[i + 1] != '+' && expresion[i + 1] != '-' && expresion[i + 1] != '*'
                && expresion[i + 1] != '/')) {
                termino = termino + expresion[i];
            }
            else {
                expresionValida += termino;
                if (termino != '+' && termino != '-' && termino != '*' && termino != '/') {
                    switch (tipo) {
                        case 'int':
                            if (verificarEntero(termino, tipo) == false) {
                                document.getElementById('salida').innerHTML = "El termino "
                                    + termino + " no es tipo INT o no esta declarado.";
                                bandera = false;
                                return 0;

                            }
                            else {
                                //realizar la operacion
                                bandera = true;
                            }
                            break;
                        case 'float':
                            if (verificarFloat(termino, tipo) == false) {
                                document.getElementById('salida').innerHTML = "El termino "
                                    + termino + " no es tipo FLOAT o no esta declarado."
                                bandera = false;
                                return 0;
                            }
                            else {
                                //realizar la operacion
                                bandera = true;
                            }
                            break;
                        default:
                            break;
                    }
                }
                termino = ""
            }

        }
        if (bandera == true) {
            //console.log(tablaSimbolos)
            for (let i = 0; i < tablaSimbolos.length; i++) {
                var tem1 = tablaSimbolos[i].split(',');
                var tem2 = cadena.split(',');
                if (tem1[2] == tem2[2]) {
                    tablaSimbolos[i] = texto;
                    var aux = texto.split(',');
                    resultado = resolverExpresion(expresionValida)
                    aux[3] = resultado.toString();
                    tablaSimbolos[i] = (aux[0] + "," + aux[1] + "," + aux[2] + "," + aux[3]).toString()
                    fs.appendFile('ts3.txt', (aux[0] + "," + aux[1] + "," + aux[2] + "," + aux[3] + '|'), (error) => {
                        if (error) {
                            throw error;
                        }
                    })
                    break;
                }
            }

        }


    }
    else {
        for (let i = 0; i < tablaSimbolos.length; i++) {
            if (tablaSimbolos[i] == cadena) {
                tablaSimbolos[i] = texto;
                texto = texto + '|'
                fs.appendFile('ts.txt', texto, (error) => {
                    if (error) {
                        throw error;
                    }
                })
                break;
                //console.log(cadena, " ",texto)
            }
        }
    }
    generarTabla()
}

function verificarEntero(termino, tipo) {
    if (termino.includes('.')) {
        return false;
    }
    else {
        if (parseInt(termino) > 0 || parseInt(termino) < 0) {
            return true;
        }
        else { //verificar tipo en la tabal de simbolos
            if (verificarEnTabla(termino) == true) {
                var tabla;
                var bandera = false;

                for (let i = 0; i < tablaSimbolos.length; i++) {
                    tabla = tablaSimbolos[i].split(',')
                    if (tabla[2] == termino && tabla[0] == tipo) {
                        bandera = true;
                        valor = tabla[3];
                        console.log("el valor de ", termino, " es ", valor)
                        break;
                    }
                    else {
                        bandera = false;//en caso de que no este en la tabal de simbolos
                    }
                }
                if (bandera == false) {
                    return false;
                }
                else {
                    return true; //en caso de que este en la tabal de simbolos
                }
            }
            else {
                return false;
            }

        }
    }
}
function verificarFloat(termino, tipo) {

    if (parseFloat(termino) > 0 || parseFloat(termino) < 0) {
        return true;
    }
    else { //verificar tipo en la tabal de simbolos
        if (verificarEnTabla(termino) == true) {
            var tabla;
            var bandera = false;

            for (let i = 0; i < tablaSimbolos.length; i++) {
                tabla = tablaSimbolos[i].split(',')
                if (tabla[2] == termino && tabla[0] == tipo) {
                    bandera = true;
                    break;
                }
                else {
                    bandera = false;//en caso de que no este en la tabal de simbolos
                }
            }
            if (bandera == false) {
                return false;
            }
            else {
                return true; //en caso de que este en la tabal de simbolos
            }
        }
        else {
            return false;
        }

    }
}

function verificarEnTabla(termino) {
    for (let i = 0; i < tablaSimbolos.length; i++) {
        tabla = tablaSimbolos[i].split(',')
        if (tabla[2] == termino) {
            return true;
        }

    }
    return false;
}

function resolverExpresion(expresion) {
    expresion = expresion.trim()
    var termino = ""
    expresion = expresion + ";"
    var valor;
    var operacion = ""
    for (let i = 0; i <= expresion.length; i++) {
        if (expresion[i] != '+' && expresion[i] != '-' && expresion[i] != '*' && expresion[i] != '/'
            && expresion[i] != ';') {
            termino = termino + expresion[i];
        }
        else {

            valor = obtenerValorTs(termino);
            if (valor != false) {
                valor = filtrarValor(valor)
                operacion = operacion + valor;
            }
            else {
                operacion = operacion + termino;
            }

            if (expresion[i] == '+' || expresion[i] == '-' || expresion[i] == '*' || expresion[i] == '/') {
                operacion = operacion + expresion[i];
            }
            termino = ""
        }

    }

    return eval(operacion)

}

function filtrarValor(cadena) {
    var aux = "";
    for (let i = 0; i < cadena.length; i++) {
        if (cadena[i] != '|') {
            aux += cadena[i];
        }
    }
    return aux;
}

function obtenerValorTs(termino) {

    for (let i = 0; i < tablaSimbolos.length; i++) {
        tabla = tablaSimbolos[i].split(',')
        if (tabla[2] == termino) {
            return tabla[3];
        }

    }
    return false;
}