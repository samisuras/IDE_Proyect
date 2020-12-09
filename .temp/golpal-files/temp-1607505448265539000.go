package main

	import (
		"fmt"

	)

	func main() {
y := 2
suma := 15
z := 1
x := 3
if (x < 1) {
x= x - 1;
if (x<6) {
z= z + 1;
} ;
suma= suma + 1;
for (y > 0){
y= y - 1;
}
} else{
z= z - 1;
x= x + y;
for {
x= x + 1;
if		 (x < 5){break;}}
} ;

		fmt.Println(x)
		fmt.Println(y)
		fmt.Println(z)
		fmt.Println(suma)

	}