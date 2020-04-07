package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

const maximo int = 100

var tokensDeSimbolos [maximo]byte
var indexTokensDeSimbolos int = 0

var tokensDeReservadas [maximo]string
var indexTokensDeReservadas int = 0

var tokensDeNumeros [maximo]string
var indexTokensDeNumeros int = 0

var tokensDeIdentificadores [maximo]string
var indexTokensDeIdentificadores int = 0

var tokensDeOperador [maximo]string
var indexTokensOperador int = 0

var tokensDelimitadores [maximo]string
var indexDelimitadores int = 0

var tokensDeTerminador [maximo]string
var indexDeTerminador int = 0

var tokensDeAsignacion [maximo]string
var indexDeAsignacion int = 0

var tokensDeComparacion [maximo]string
var indexDeComparacion int = 0

var palabrasReservadas = []string{"program", "if", "else", "fi", "do", "until", "while", "read", "write", "float", "int", "bool", "not", "and", "or"}

func numeroLineas(codigo string) int {
	var num int = 0
	file, err := os.Open(codigo)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if scanner.Text() != "" {
			num = num + 1
		}
	}
	return num
}

func extraerLineas(TAM int, codigo string) []string {
	lineas := make([]string, TAM)
	i := 0
	file, err := os.Open(codigo)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if scanner.Text() != "" { //no guarda las lineas vacias
			lineas[i] = scanner.Text()
			lineas[i] = strings.TrimSpace(lineas[i]) + "\n" //eliminar espacio en blanco de la cadena
			i = i + 1
		}
	}

	return lineas

}
func formarTokens(entrada string) {
	i := 0
	var palabra string
	for i < len(entrada) {
		if entrada[i] != 32 && entrada[i] != 44 && entrada[i] != 10 {
			if (entrada[i] == 59) || (entrada[i] == 34) || (entrada[i] == 40) || (entrada[i] == 41) ||
				(entrada[i] == 43) || (entrada[i] == 45) || (entrada[i] == 42) || (entrada[i] == 47) ||
				(entrada[i] == 35) || (entrada[i] == 60) || (entrada[i] == 62) || (entrada[i] == 61) ||
				(entrada[i] == 123) || (entrada[i] == 125) {

				clasificarSimbolo(entrada[i])

			} else {
				palabra = palabra + string(entrada[i])
			}
		} else {

			if verificarReservada(palabra) == true {
				//fmt.Println(palabra + " es RESERVADA")
				tokensDeReservadas[indexTokensDeReservadas] = palabra
				indexTokensDeReservadas = indexTokensDeReservadas + 1
			} else if verificarIdentificador(palabra) == true {
				//fmt.Println(palabra + " es un IDENTIFICADOR")
				tokensDeIdentificadores[indexTokensDeIdentificadores] = palabra
				indexTokensDeIdentificadores = indexTokensDeIdentificadores + 1
			} else if verificarNumero(palabra) == true {
				//fmt.Println(palabra + " es un NUMERO")
				tokensDeNumeros[indexTokensDeNumeros] = palabra
				indexTokensDeNumeros = indexTokensDeNumeros + 1

			}
			palabra = ""
		}
		i++

	}
}

func verificarReservada(cadena string) bool {

	for i := 0; i < len(palabrasReservadas); i++ {
		if palabrasReservadas[i] == cadena {
			return true
		}
	}
	return false
}

func verificarIdentificador(cadena string) bool {
	esIdentificador := false
	estado := 0
	i := 0
	limite := len(cadena)

	for i < limite {
		switch estado {
		case 0:
			if esLetra(cadena[i]) || cadena[i] == 95 {
				estado = 1
				esIdentificador = true
			} else {
				estado = 2
				esIdentificador = false
			}
			i = i + 1
			break
		case 1:
			if esLetra(cadena[i]) || esDigito(cadena[i]) || cadena[i] == 95 {
				estado = 1
				esIdentificador = true
			} else {
				estado = 2
				esIdentificador = false
			}
			i = i + 1
			break
		case 2:
			esIdentificador = false
			i = limite
			break
		}

	}
	return esIdentificador
}

func verificarNumero(cadena string) bool {
	esNumero := false
	estado := 0
	cont := 0
	i := 0
	limite := len(cadena)

	for i < limite {
		switch estado {
		case 0:
			if esDigito(cadena[i]) {
				estado = 0
				esNumero = true
				cont = cont + 1
			} else if (cadena[i] == 46 && cont == 0) || esLetra(cadena[i]) {
				estado = 2
				esNumero = false
			} else if cadena[i] == 46 {
				estado = 1
				esNumero = false
			}
			i = i + 1
			break
		case 1:
			if esDigito(cadena[i]) {
				estado = 1
				esNumero = true
			} else {
				estado = 2
				esNumero = false
			}
			i = i + 1
			break
		case 2:
			esNumero = false
			i = limite
			break
		}

	}
	return esNumero
}

func esLetra(caracter byte) bool {
	if (caracter >= 65 && caracter <= 90) || (caracter >= 97 && caracter <= 122) {
		return true
	}
	return false
}

func esDigito(caracter byte) bool {
	if caracter >= 48 && caracter <= 57 {
		return true
	}
	return false
}
func extraerTokenSimbolo(lineas []string) {
	for i := 0; i < len(lineas); i++ {
		formarTokens(string(lineas[i]))
	}
}

func imprimirTokens() {

	//fmt.Print("Reservadas ")
	for i := 0; i < indexTokensDeReservadas; i++ {
		if i == (indexTokensDeReservadas - 1) {
			fmt.Print(string(tokensDeReservadas[i]) + "|")
		} else {
			fmt.Print(string(tokensDeReservadas[i]) + " ")
		}
	}
	//fmt.Print("Identificadores ")
	for i := 0; i < indexTokensDeIdentificadores; i++ {
		if i == (indexTokensDeIdentificadores - 1) {
			fmt.Print(string(tokensDeIdentificadores[i]) + "|")
		} else {
			fmt.Print(string(tokensDeIdentificadores[i]) + " ")
		}
	}
	//fmt.Print("Números ")
	for i := 0; i < indexTokensDeNumeros; i++ {
		if i == (indexTokensDeNumeros - 1) {
			fmt.Print(string(tokensDeNumeros[i]) + "|")
		} else {
			fmt.Print(string(tokensDeNumeros[i]) + " ")
		}
	}
	//fmt.Print("Operadores ")
	for i := 0; i < indexTokensOperador; i++ {
		if i == (indexTokensOperador - 1) {
			fmt.Print(string(tokensDeOperador[i]) + "|")
		} else {
			fmt.Print(string(tokensDeOperador[i]) + " ")
		}
	}
	//fmt.Print("Terminadores ")
	for i := 0; i < indexDeTerminador; i++ {
		if i == (indexDeTerminador - 1) {
			fmt.Print(string(tokensDeTerminador[i]) + "|")
		} else {
			fmt.Print(string(tokensDeTerminador[i]) + " ")
		}
	}
	//fmt.Print("Comparadores ")
	for i := 0; i < indexDeComparacion; i++ {
		if i == (indexDeComparacion - 1) {
			fmt.Print(string(tokensDeComparacion[i]) + "|")
		} else {
			fmt.Print(string(tokensDeComparacion[i]) + " ")
		}
	}
	//fmt.Print("Delimitadores ")
	for i := 0; i < indexDelimitadores; i++ {
		if i == (indexDelimitadores - 1) {
			fmt.Print(string(tokensDelimitadores[i]) + "|")
		} else {
			fmt.Print(string(tokensDelimitadores[i]) + " ")
		}
	}
	//fmt.Print("Asignación ")
	for i := 0; i < indexDeAsignacion; i++ {
		if i == (indexDeAsignacion - 1) {
			fmt.Print(string(tokensDeAsignacion[i]) + "|")
		} else {
			fmt.Print(string(tokensDeAsignacion[i]) + " ")
		}
	}
}

func clasificarSimbolo(simbolo byte) {

	if simbolo == 42 || simbolo == 43 || simbolo == 45 || simbolo == 47 || simbolo == 246 || simbolo == 94 { //operador
		tokensDeOperador[indexTokensOperador] = string(simbolo)
		indexTokensOperador++
	} else if simbolo == 40 || simbolo == 41 || simbolo == 91 || simbolo == 93 || simbolo == 125 { //Delimitadores
		tokensDelimitadores[indexDelimitadores] = string(simbolo)
		indexDelimitadores++
	} else if simbolo == 59 { //Terminadores
		tokensDeTerminador[indexDeTerminador] = string(simbolo)
		indexDeTerminador++
	} else if simbolo == 61 { //Asignacion
		tokensDeAsignacion[indexDeAsignacion] = string(simbolo)
		indexDeAsignacion++
	} else if simbolo == 60 || simbolo == 61 || simbolo == 62 { //Comparacion
		tokensDeComparacion[indexDeComparacion] = string(simbolo)
		indexDeComparacion++
	}
}

func archivo(arguments []string) string {
	file := ""

	for i := 0; i < len(arguments); i++ {
		if i == len(arguments)-1 {
			file = file + arguments[i]
			break
		} else {
			file = file + arguments[i] + "/"
		}
	}
	return file
}
func main() {
	file := archivo(os.Args[1:])
	tam := numeroLineas(file)
	lineas := extraerLineas(tam, file)
	extraerTokenSimbolo(lineas)
	imprimirTokens()

}
