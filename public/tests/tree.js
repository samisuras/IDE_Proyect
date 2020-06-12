const Flow = require('dawn.js/src/flow').Flow
const MixMap = require('dawn.js/src/IR').MixMap
const LexParser = require('dawn.js/src/lex-parser').LexParser
const SyntaxParser = require('dawn.js/src/LR1-parser').SyntaxParser
const treeify = require('treeify')


var script = '\
            program {\n\
                int x, y;\n\
                write x;\n\
                write y;\n\
            }\n\
';

var lex_syntax = {
    'LETRA': /'.*?[^\\]'|".*?[^\\]"/,
    'dot': /\./,
    'StmtEnd': /;|\n/,
    'Assign': /\=/,
    'Pl': /\(/,
    'Pr': /\)/,
    'Bl': /\{/,
    'Br': /\}/,
    'Pc': /\;/,
    'Comma': /\,/,
    'MayQ': /\>/,
    'MayIQ': /[>=]/,
    'MenQ': /\</,
    'MenIQ': /[<=]/,
    'IgualC': /[==]/,
    'Diff': /[!=]/,
    'MAS': /\+/,
    'MENOS': /\-/,
    'MUL': /\*/,
    'DIV': /\//,
    //Lexicografico del proyecto
    'PROGRAMA': /program/,
    'READ': /read/,
    'WRITE': /write/,
    'IF': /if/,
    'THEN': /then/,
    'ELSE': /else/,
    'FI': /fi/,
    'DO': /do/,
    'UNTIL': /until/,
    'WHILE': /while/,
    'READ': /read/,
    'WRITE': /write/,
    'FLOAT': /float/,
    'INT': /int/,
    'BOOL': /bool/,
    'NOT': /NOT/,
    'AND': /AND/,
    'OR': /OR/,
    'TRUE': /true/,
    'FALSE': /false/,
    'ID': /[a-z]/,
    'NUM': /[0-9]*/
};

var grammar = "\
            Program -> S+\n\
            S -> PROGRAMA Bl lista-declaracion lista-sentencias Br | PROGRAMA Bl Br\n\
            lista-declaracion -> lista-declaracion declaracion | declaracion\n\
            declaracion -> tipo lista-id Pc\n\
            tipo -> INT | FLOAT | BOOL\n\
            lista-id -> lista-id Comma ID | ID\n\
            lista-sentencias -> lista-sentencias sentencias | sentencias\n\
            sentencia -> seleccion | iteracion | repeticion | sentread | sentwrite | bloque | asignacion\n\
            selecion -> IF Pl bexpresion Pr THEN bloque FI | IF Pl bexpresion Pr THEN bloque ELSE bloque\n\
            iteracion -> WHILE Pl bexpresion Pr bloque\n\
            repeticion -> DO bloque UNTIL Pl bexpresion Pr Pc\n\
            sentread -> READ ID Pc\n\
            sentwrite -> WRITE bexpresion Pc\n\
            bloque -> Bl lista-sentencias Br\n\
            asignacion -> ID Assign bexpresion Pc\n\
            bexpresion -> bexpresion OR bterm | bterm\n\
            bterm -> bterm AND notfactor | notfactor\n\
            notfactor -> NOT bfactor | bfactor\n\
            bfactor -> TRUE | FALSE | relacion\n\
            relacion -> expresion relop expresion | expresion\n\
            relop -> MayQ | MayIQ |MenQ | MenIQ | IgualC | Diff\n\
            expresion -> expresion sumaop termino | termino\n\
            sumaop -> MAS | MENOS\n\
            termino -> termino multop signofactor | signofactor\n\
            multop -> MUL | DIV\n\
            signofactor: sumaop factor | factor\n\
            factor -> Pl bexpresion Pr | NUM | ID";
var args = {
    script: script,
    lex_syntax: lex_syntax,
    grammar: grammar,
    start_stmt: ['Program'],
    sync_lex: ['StmtEnd', 'ParseFail', 'S'],
    mix_map: new MixMap,
    ast_cutter: []
};

var flow = new Flow(args);

flow.append([LexParser.flow, SyntaxParser.flow]);

flow.finish();

var ast = flow.result('ast');
console.log(treeify.asTree(ast.leaves[0].leaves[0],true))

//console.log("*************HIJO*******\n",ast.leaves[1].leaves[0].leaves[1])
//console.log("*************PADRE*******\n",ast.leaves[1].leaves[0].leaves[1].parent)

