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
/*NUMERO {DIGITO}({DIGITO})* .{DIGITO}(({DIGITO})*)? 
/*SIGNO [< <= > >= != ;]*/
Boleano "true"|"false"
%option noyywrap

%%

"//"              {skip_single_line_comment();}

"/*"              {skip_multiple_line_comment();}

" "               { /* empty */ }
[\r\t]       { /* empty */ }

">"         {return(MAYOR);}
"<"         {return(MENOR);}
">="         {return(MAYORI);}
"<="         {return(MENORI);}
"=="         {return(IGUALI);}
"!="         {return(DIF);}
"+"         {return(MAS);}
"-"         {return(MENOS);}
"*"         {return(POR);}
"/"         {return(DIV);}
"^"         {return(POTENCIA);}
"="         {return(IGUAL);}
";"         {return(PUNTOYCOMA);}
","         {return(COMA);}
"("         {return(PARENTESISABRE);}
")"         {return(PARENTESISCIERRA);}
"{"         {return(LLAVEABRE);}
"}"         {return(LLAVECIERRA);}
"program"         {return(PROGRAM);}
"if"         {return(IF);}
"else"         {return(ELSE);}
"fi"         {return(FI);}
"do"         {return(DO);}
"until"         {return(UNTIL);}
"while"         {return(WHILE);}
"read"         {return(READ);}
"write"         {return(WRITE);}
"float"         {return(FLOAT);}
"int"         {return(INT);}
"bool"         {return(BOOL);}
"not"         {return(NOT);}
"and"         {return(AND);}
"or"         {return(OR);}
"then"        {return(THEN);}


{Boleano}   {return BOLEANO;}
{constEntera} {return (NUM);}
{IDENTIFICADOR} {return (ID);}
"\n"        {linea++;}

.            {printf("Error lexico en linea %d",linea+1);}
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