%{
  
  #include <stdio.h>
  #include <stdlib.h>
  #include <math.h>
  extern int yylex(void);
  extern char *yytext;
  extern int linea;
  extern FILE *yyin;
  void yyerror(char *s);
%}



%token MAS MENOS POR DIV POTENCIA IGUAL PUNTOYCOMA COMA PARENTESISABRE PARENTESISCIERRA LLAVEABRE LLAVECIERRA PROGRAM IF ELSE FI DO UNTIL WHILE READ
%token WRITE FLOAT INT BOOL NOT AND OR BOLEANO NUM ID THEN
%token MAYOR MENOR MAYORI MENORI DIF IGUALI
%start expresiones;


%%

expresiones: PROGRAM LLAVEABRE lisdeclaraciones lissentencias LLAVECIERRA {return 0}
            | PROGRAM LLAVEABRE LLAVECIERRA {return 0}
                  ;
lisdeclaraciones: lisdeclaraciones declaracion 
                  | declaracion 
                  ;
declaracion: tipo listaid PUNTOYCOMA
                  ;
tipo: INT | FLOAT | BOOL
                  ;
listaid: listaid COMA ID | ID
                  ;
lissentencias: lissentencias sentencias
                  | sentencias
                  ;
sentencias: seleccion | iteracion | repeticion | sentread | sentwrite | bloque | asignacion
                  ;
seleccion: IF PARENTESISABRE bexpresion PARENTESISCIERRA THEN bloque FI
                  | IF PARENTESISABRE bexpresion PARENTESISCIERRA THEN bloque ELSE bloque
                  ;
iteracion: WHILE PARENTESISABRE bexpresion PARENTESISCIERRA bloque
                  ;
repeticion: DO bloque UNTIL PARENTESISABRE bexpresion PARENTESISCIERRA PUNTOYCOMA
                  ;
sentread: READ ID PUNTOYCOMA
                  ;
sentwrite: WRITE bexpresion PUNTOYCOMA
                  ;
bloque: LLAVEABRE lissentencias LLAVECIERRA
                  ;
asignacion: ID IGUAL bexpresion PUNTOYCOMA
                  ;
bexpresion: bexpresion OR bterm 
                  | bterm
                  ;
bterm: bterm AND notfactor 
                  | notfactor
                  ;
notfactor: NOT bfactor
                  | bfactor
                  ;
bfactor: "true" | "false" | relacion
                  ;
relacion: expresion relop expresion
                  | expresion
                  ;
relop: MAYOR | MENOR | MAYORI | MENORI | DIF | IGUALI
                  ;
expresion: expresion sumaop termino | termino
                  ;
sumaop: MAS | MENOS
                  ;
termino: termino multop signofactor | signofactor
                  ;
multop: POR | DIV
                  ;
signofactor: sumaop factor
                  | factor
                  ;
factor: PARENTESISABRE bexpresion PARENTESISCIERRA | NUM | ID
                  ;
          



%%




void yyerror(char *s)
{
  printf("Error sintactico en la linea %d",linea+1);
}
int main(int argc,char **argv)
{
  //gcc bison.tab.c lex.yy.c -L "C:\GnuWin32\lib" -lfl -o analizador

  int resultado;
  if (argc>1)
                yyin=fopen(argv[1],"r");
  else
                yyin=stdin;
  resultado = yyparse();
  if(resultado == 0){
    printf("Analisis Sintactico sin errores");
  }
  system("pause");
  return 0;
}

