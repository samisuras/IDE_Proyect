%{
  #include <string.h>
  #include <stdio.h>
  #include <stdlib.h>
  #include <math.h>
  extern int yylex(void);
  extern char *yytext;
  extern int linea;
  extern FILE *yyin;
  void yyerror(char *s);
  void insertar(char *tipo);

%}

%union{
  char *cadena;
}

%token <cadena> NUM
%token <cadena> NUMF
%token <cadena> INT FLOAT BOOL ID
%token <cadena> MAS MENOS POR DIV POTENCIA IGUAL PUNTOYCOMA COMA PARENTESISABRE PARENTESISCIERRA LLAVEABRE LLAVECIERRA PROGRAM IF ELSE FI DO UNTIL WHILE READ
%token <cadena> WRITE NOT AND OR BOLEANO THEN
%token <cadena> MAYOR MENOR MAYORI MENORI DIF IGUALI

%type <cadena> expresiones lisdeclaraciones lissentencias declaracion tipo listaid sentencias
%type <cadena> seleccion iteracion repeticion sentread sentwrite bloque asignacion bexpresion
%type <cadena> bterm notfactor bfactor relacion expresion relop sumaop termino multop signofactor factor

%start expresiones;


%%

expresiones: PROGRAM LLAVEABRE lisdeclaraciones lissentencias LLAVECIERRA {return 0}
            | PROGRAM LLAVEABRE LLAVECIERRA  {return 0}
                  ;
lisdeclaraciones: lisdeclaraciones declaracion 
                  | declaracion 
                  ;
declaracion:  tipo listaid PUNTOYCOMA {insertar($$);}
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
bfactor: BOLEANO | relacion
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
factor: PARENTESISABRE bexpresion PARENTESISCIERRA | NUM | ID | NUMF
                  ;
          



%%
void insertar(char *tipo)
{
    FILE* fichero;     
    fichero = fopen("salida.txt", "a+");
    fprintf (fichero, "%s\n", tipo);
    fclose(fichero);     
}

void yyerror(char *s)
{
  printf("Error sintactico en la linea %d\n",linea+1);
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
    printf("Analisis Sintactico sin errores\n");
  }
  system("pause");
  return 0;
}

