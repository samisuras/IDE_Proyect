package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"github.com/novalagung/golpal"
)

const max = 100

var ts [max]string
var indexTs int = 0

var ts2 [max]string
var indexTs2 int = 0

var ts3 [max]string
var indexTs3 int = 0

var tablaSimbolos [max]string
var indexTablaSimbolos int = 0

func extraerModificadas() string {
	var lineas string
	file, err := os.Open("ts.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lineas = scanner.Text()

	}

	return lineas

}
func extraerNulas() string {
	var lineas string
	file, err := os.Open("ts2.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lineas = scanner.Text()

	}

	return lineas

}
func extraerAsignaciones() string {
	var lineas string
	file, err := os.Open("ts3.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lineas = scanner.Text()

	}

	return lineas

}
func filtarTs(modificadas string) {
	var simbolo string
	i := 0
	for i < len(modificadas) {
		if modificadas[i] != 124 {
			simbolo = simbolo + string(modificadas[i])
		} else {
			ts[indexTs] = simbolo
			indexTs++
			simbolo = ""
		}
		i++
	}
}
func filtarTs2(nulas string) {
	var simbolo string
	i := 0
	for i < len(nulas) {
		if nulas[i] != 124 {
			simbolo = simbolo + string(nulas[i])
		} else {
			ts2[indexTs2] = simbolo
			indexTs2++
			simbolo = ""
		}
		i++
	}
}
func filtarTs3(asig string) {
	var simbolo string
	i := 0
	for i < len(asig) {
		if asig[i] != 124 {
			simbolo = simbolo + string(asig[i])
		} else {
			ts3[indexTs3] = simbolo
			indexTs3++
			simbolo = ""
		}
		i++
	}
}
func crearTs() {
	i := 0
	for i < indexTs {
		simboloTs := strings.Split(ts[i], ",")
		tablaSimbolos[indexTablaSimbolos] = simboloTs[0] + "," + simboloTs[1] + "," + simboloTs[2] + "," + simboloTs[3] + "," + "`" + simboloTs[2] + "`"
		indexTablaSimbolos++
		i++
	}
	j := 0
	for j < indexTs2 {
		simboloTs2 := strings.Split(ts2[j], ",")
		agregarTs(simboloTs2[0]+","+simboloTs2[1]+","+simboloTs2[2]+","+simboloTs2[3]+","+"`"+simboloTs2[2]+"`", simboloTs2[2])
		j++
	}
}
func agregarTs(cadena string, id string) {
	i := 0
	bandera := false
	for i < indexTablaSimbolos {
		simboloTs := strings.Split(tablaSimbolos[i], ",")
		if simboloTs[2] == id {
			bandera = true
			break
		} else {
			bandera = false
		}
		i++
	}
	if bandera == false {
		tablaSimbolos[indexTablaSimbolos] = cadena
		indexTablaSimbolos++
	}
}
func complementarTs() {
	j := 0
	for j < indexTs3 {
		simboloTs3 := strings.Split(ts3[j], ",")
		agregarAsig(simboloTs3[2], simboloTs3[3])
		j++
	}
}
func agregarAsig(id string, valor string) {
	i := 0
	for i < indexTablaSimbolos {
		simboloTs := strings.Split(tablaSimbolos[i], ",")
		if simboloTs[2] == id {
			tablaSimbolos[i] = simboloTs[0] + "," + simboloTs[1] + "," + simboloTs[2] + "," + valor
			break
		}
		i++
	}
}
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
			if strings.Contains(lineas[i], "then") == true {
				filtro := lineas[i]
				aux := ""
				j := 0
				for j < len(filtro) {
					if filtro[j] == 116 && filtro[j+1] == 104 && filtro[j+2] == 101 && filtro[j+3] == 110 {
						j = j + 4
					} else {
						aux += string(filtro[j])
					}
					j++
				}
				lineas[i] = aux

			}
			if strings.Contains(lineas[i], "while") == true {
				filtro2 := lineas[i]
				aux2 := ""
				k := 0
				bandera := false
				for k < len(filtro2) {
					if (filtro2[k] == 119) && (filtro2[k+1] == 104) && (filtro2[k+2] == 105) &&
						(filtro2[k+3] == 108) && (filtro2[k+4] == 101) {
						k = k + 5
						bandera = true
					} else {
						if bandera == true {
							aux2 = aux2 + "for "
							bandera = false
						}
						aux2 += string(filtro2[k])
					}
					k++
				}
				lineas[i] = aux2

			}

			if strings.Contains(lineas[i], "fi") == true {
				filtro3 := lineas[i]
				aux3 := ""
				l := 0
				for l < len(filtro3) {
					if (filtro3[l] == 102) && (filtro3[l+1] == 105) {
						l = l + 2
					} else {
						aux3 += string(filtro3[l])
					}
					l++
				}
				lineas[i] = aux3

			}

			if strings.Contains(lineas[i], "do") == true {
				filtro4 := lineas[i]
				aux4 := ""
				m := 0
				bandera := false
				for m < len(filtro4) {
					if (filtro4[m] == 100) && (filtro4[m+1] == 111) {
						m = m + 2
						bandera = true
					} else {
						if bandera == true {
							aux4 = aux4 + "for "
							bandera = false
						}
						aux4 += string(filtro4[m])
					}
					m++
				}
				lineas[i] = aux4

			}

			if strings.Contains(lineas[i], "until") == true {
				filtro5 := lineas[i]
				n := 0
				aux5 := ""
				expresion := ""
				for n < len(filtro5) {
					if (filtro5[n] == 117) && (filtro5[n+1] == 110) && (filtro5[n+2] == 116) &&
						(filtro5[n+3] == 105) && (filtro5[n+4] == 108) {
						n = n + 5
					} else {
						if filtro5[n] != 59 && filtro5[n] != 125 {
							aux5 = aux5 + string(filtro5[n])
						}
					}
					n++
				}
				if strings.Contains(aux5, "<") == true {
					a := 0
					a1 := ""
					for a < len(aux5) {
						if aux5[a] == 60 {
							a1 = a1 + ">"
						} else {
							a1 = a1 + string(aux5[a])
						}
						a = a + 1
					}
					expresion = a1
				}
				if strings.Contains(aux5, ">") == true {
					b := 0
					b1 := ""
					for b < len(aux5) {
						if aux5[b] == 62 {
							b1 = b1 + "<"
						} else {
							b1 = b1 + string(aux5[b])
						}
						b = b + 1
					}
					expresion = b1
				}
				if strings.Contains(aux5, "<=") == true {
					c := 0
					c1 := ""
					for c < len(aux5) {
						if aux5[c] == 60 && aux5[c+1] == 61 {
							c1 = c1 + ">="
							c = c + 2
						} else {
							c1 = c1 + string(aux5[c])
						}
						c = c + 1
					}
					expresion = c1
				}
				if strings.Contains(aux5, ">=") == true {
					d := 0
					d1 := ""
					for d < len(aux5) {
						if aux5[d] == 62 && aux5[d+1] == 61 {
							d1 = d1 + "<="
							d = d + 2
						} else {
							d1 = d1 + string(aux5[d])
						}
						d = d + 1
					}
					expresion = d1
				}

				lineas[i] = ""
				aux5 = "if" + expresion + "{break;}}"
				lineas[i] = aux5

			}

			lineas[i] = strings.TrimSpace(lineas[i]) + "\n" //eliminar espacio en blanco de la cadena
			i = i + 1
		}
	}
	return lineas

}
func evaluarExpresiones(expresion string) {
	bandera := true
	expCompleta := ""
	if strings.Contains(expresion, "<=") == true && bandera == true {
		exp := strings.Split(expresion, "<=")
		bandera = false
		expCompleta = sustituirValores(exp[0], exp[1], "<=")
	}
	if strings.Contains(expresion, ">=") == true && bandera == true {
		exp := strings.Split(expresion, ">=")
		bandera = false
		expCompleta = sustituirValores(exp[0], exp[1], ">=")
	}
	if strings.Contains(expresion, "==") == true && bandera == true {
		exp := strings.Split(expresion, "==")
		fmt.Println(exp, "==")
		bandera = false
		expCompleta = sustituirValores(exp[0], exp[1], "==")
	}
	if strings.Contains(expresion, ">") == true && bandera == true {
		exp := strings.Split(expresion, ">")
		bandera = false
		expCompleta = sustituirValores(exp[0], exp[1], ">")
	}
	if strings.Contains(expresion, "<") == true && bandera == true {
		exp := strings.Split(expresion, "<")
		bandera = false
		expCompleta = sustituirValores(exp[0], exp[1], "<")
	}
	if strings.Contains(expresion, "!=") == true && bandera == true {
		exp := strings.Split(expresion, "!=")
		bandera = false
		expCompleta = sustituirValores(exp[0], exp[1], "!=")
	}
	fmt.Println(expCompleta)
	//escribeArchivo(expCompleta)
}
func sustituirValores(expIzq string, expDer string, operador string) string {
	expIzq = strings.TrimSpace(expIzq)
	expIzq = sustituir(expIzq)
	expDer = strings.TrimSpace(expDer)
	expDer = sustituir(expDer)
	expCompleta := expIzq + operador + expDer
	return expCompleta
}
func sustituir(expresion string) string {
	i := 0
	palabra := ""
	bandera := false
	exp := ""
	valor := ""
	signo := ""
	for i < len(expresion) {
		if string(expresion[i]) != " " && string(expresion[i]) != "*" && string(expresion[i]) != "/" &&
			string(expresion[i]) != "-" && string(expresion[i]) != "+" {
			palabra += (string(expresion[i]))
			bandera = false
			if i == len(expresion)-1 {
				bandera = true
			}
		} else {
			signo = string(expresion[i])

			bandera = true
		}
		if bandera == true {
			if len(palabra) != 0 {
				if palabra[0] >= 97 && palabra[0] < 123 {
					valor = extraerValoresTs(palabra)
					exp = (exp + "(" + valor + ")")
				} else {
					if strings.Contains(palabra, ".") == true {
						//fmt.Println(palabra, " es un numero float") directo
						valor = palabra
						exp = (exp + "(" + valor + ")")

					} else {
						//fmt.Println(palabra, " es un int") directo
						valor = palabra
						exp = (exp + "(" + valor + ")")

					}
				}
			}
			exp = exp + signo
			palabra = ""
			bandera = false
		}
		i++
	}

	return exp
}
func escribeArchivo(exp string) {
	texto := []byte(exp)
	err := ioutil.WriteFile("evaluarExpresiones.txt", texto, 0644)
	if err != nil {
		panic(err)
	}
}
func extraerValoresTs(id string) string {
	i := 0
	for i < indexTablaSimbolos {
		simboloTs := strings.Split(tablaSimbolos[i], ",")
		if string(simboloTs[2]) == id {
			return string(simboloTs[3])
		}
		i++
	}
	return "error"
}
func declaraciones(lineas []string, indexLineas int) string {
	dec := ""
	i := 0
	for i < indexTablaSimbolos {
		simboloTs := strings.Split(tablaSimbolos[i], ",")
		dec += simboloTs[2] + " := " + simboloTs[3] + "\n"
		i++
	}

	j := 0
	indexSentencias := 0
	for j < indexLineas {
		if strings.Contains(lineas[j], "if") == true || strings.Contains(lineas[j], "while") == true ||
			strings.Contains(lineas[j], "do") == true {
			indexSentencias = j
			break
		}
		j++
	}
	k := indexSentencias
	for k < indexLineas {
		dec += lineas[k]

		k++
	}
	dec = strings.TrimSpace(dec)

	return dec
}
func eliminarArchivo(file string) {

	err := os.Remove(file)
	if err != nil {

	}
}
func existeArchivo(file string) bool {
	_, err := os.Stat(file)
	if err == nil {
		return true
	}
	if os.IsNotExist(err) {
		return false
	}
	return true

}
func generarSalidas() string {
	i := 0
	salidas := ""
	flecha := `"=>"`
	for i < indexTablaSimbolos {
		simboloTs := strings.Split(tablaSimbolos[i], ",")
		salidas = salidas + "fmt.Println(" + string(simboloTs[4]) + "," + flecha + "," + simboloTs[2] + ")\n"
		i = i + 1

	}
	return salidas
}
func main() {

	modificadas := extraerModificadas()
	nulas := extraerNulas()
	filtarTs(modificadas)
	filtarTs2(nulas)
	if existeArchivo("ts3.txt") == true {
		asignaciones := extraerAsignaciones()
		filtarTs3(asignaciones)
	}

	eliminarArchivo("ts.txt")
	eliminarArchivo("ts2.txt")
	if existeArchivo("ts3.txt") == true {
		eliminarArchivo("ts3.txt")
	}
	crearTs()
	complementarTs()
	tam := numeroLineas("sentencias.txt")
	lineas := extraerLineas(tam, "sentencias.txt")
	dec := declaraciones(lineas, tam)
	eliminarArchivo("sentencias.txt")
	salidas := generarSalidas()
	//fmt.Println(dec)
	cmdString := `
	package main
	import (
		"fmt"
	)
	func main() {` + "\n" + dec + salidas + `}`
	//fmt.Println(cmdString)
	output, err := golpal.New().ExecuteRaw(cmdString)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(output)
}
