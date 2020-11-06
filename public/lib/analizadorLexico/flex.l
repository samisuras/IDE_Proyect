%{
  #include <stdio.h>
  #include <stdlib.h>
  #include "bison.tab.h"
  int linea=0;
  static void skip_single_line_comment(void);
  static void skip_multiple_line_comment(void);
%}

DIGITO [0-9]
LETRA [a-zA-Z]
IDENTIFICADOR {LETRA}({LETRA}|{DIGITO})*
constEntera {DIGITO}({DIGITO})*
constFloat {DIGITO}({DIGITO})*.{DIGITO}(({DIGITO})*)? 
/*SIGNO [< <= > >= != ;]*/
Boleano "true"|"false"
%option noyywrap

%%

"//"              {skip_single_line_comment();}

"/*"              {skip_multiple_line_comment();}

" "               { /* empty */ }
[\r\t]       { /* empty */ }

">"         {yylval.cadena = yytext; return(MAYOR);}
"<"         {yylval.cadena = yytext; return(MENOR);}
">="         {yylval.cadena = yytext; return(MAYORI);}
"<="         {yylval.cadena = yytext; return(MENORI);}
"=="         {yylval.cadena = yytext; return(IGUALI);}
"!="         {yylval.cadena = yytext; return(DIF);}
"+"         {yylval.cadena = yytext; return(MAS);}
"-"         {yylval.cadena = yytext; return(MENOS);}
"*"         {yylval.cadena = yytext; return(POR);}
"/"         {yylval.cadena = yytext; return(DIV);}
"^"         {yylval.cadena = yytext; return(POTENCIA);}
"="         {yylval.cadena = yytext; return(IGUAL);}
";"         {yylval.cadena = yytext; return(PUNTOYCOMA);}
","         {yylval.cadena = yytext; return(COMA);}
"("         {yylval.cadena = yytext; return(PARENTESISABRE);}
")"         {yylval.cadena = yytext; return(PARENTESISCIERRA);}
"{"         {yylval.cadena = yytext; return(LLAVEABRE);}
"}"         {yylval.cadena = yytext; return(LLAVECIERRA);}
"program"         {yylval.cadena = yytext; return(PROGRAM);}
"if"         {yylval.cadena = yytext; return(IF);}
"else"         {yylval.cadena = yytext; return(ELSE);}
"fi"         {yylval.cadena = yytext; return(FI);}
"do"         {yylval.cadena = yytext; return(DO);}
"until"         {yylval.cadena = yytext; return(UNTIL);}
"while"         {yylval.cadena = yytext; return(WHILE);}
"read"         {yylval.cadena = yytext; return(READ);}
"write"         {yylval.cadena = yytext; return(WRITE);}
"float"         {yylval.cadena = yytext; return(FLOAT);}
"int"         {yylval.cadena = yytext; return(INT);}
"bool"         {yylval.cadena = yytext; return(BOOL);}
"not"         {yylval.cadena = yytext; return(NOT);}
"and"         {yylval.cadena = yytext; return(AND);}
"or"         {yylval.cadena = yytext; return(OR);}
"then"        {yylval.cadena = yytext; return(THEN);}


{Boleano}   {yylval.cadena = yytext; return BOLEANO;}
{constEntera} {yylval.cadena = yytext; return (NUM);}
{constFloat} {yylval.cadena = yytext; return (NUMF);}
{IDENTIFICADOR} {yylval.cadena = yytext; return (ID);}
"\n"        {linea++;}

.            {printf("Error lexico en linea %d\n",linea+1);}
%%

static void
skip_single_line_comment(void)
{
  int c;

  /* Read until we find \n or EOF */
  while((c = input()) != '\n' && c != EOF)
    ;

  /* Maybe you want to place back EOF? */
  if(c == EOF)
    unput(c);
}

static void
skip_multiple_line_comment(void)
{
  int c;

  for(;;)
  {
    switch(input())
    {
      /* We expect ending the comment first before EOF */
      case EOF:
        fprintf(stderr, "Error unclosed comment, expect */\n");
        exit(-1);
        goto done;
      break;
      /* Is it the end of comment? */
      case '*':
        if((c = input()) == '/')
          goto done;
        unput(c);
        break;
      default:
        /* skip this character */
        break;
    }
  }

  done:
  /* exit entry */ ;
}