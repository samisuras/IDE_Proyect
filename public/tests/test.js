const Flow = require('dawn.js/src/flow').Flow
const MixMap = require('dawn.js/src/IR').MixMap
const LexParser = require('dawn.js/src/lex-parser').LexParser
const SyntaxParser = require('dawn.js/src/LR1-parser').SyntaxParser
const treeify = require('treeify')


var script = '\
            function CDE(o, p, z, t){\n\
                var q = o;\n\
                var w = p;\n\
            }\n\
';

var lex_syntax = {
    'String': /'.*?[^\\]'|".*?[^\\]"/,
    'Dot': /\./,
    'Func': /function/,
    'StmtEnd': /;|\n/,
    'Assign': /\=/,
    'Pl': /\(/,
    'Pr': /\)/,
    'Bl': /\{/,
    'Br': /\}/,
    'Comma': /\,/,
    'Var': /var/,
    'Id': /[a-zA-Z_$][\w_$]*/
};

var grammar = "\
            Program -> S+\n\
            S -> SGO StmtEnd | StmtEnd | Function\n\
            SGO -> Obj | StmtEnd | Assignment\n\
            Assignment -> Var* Receiver Assign Giver\n\
            Receiver -> Obj\n\
            Giver -> Obj | Function\n\
            Function -> Func Id* Pl Args* Pr Bl S* Br\n\
            Obj -> Id (Dot Id)* | Bl Br\n\
            Args -> Id (Comma Id)*";


var args = {
    script: script,
    lex_syntax: lex_syntax,
    grammar: grammar,
    start_stmt: ['Program'],
    sync_lex: ['StmtEnd', 'ParseFail', 'S'],
    mix_map: new MixMap,
    ast_cutter: [],
    scope_rules: ['Function']
};

var flow = new Flow(args);

flow.append([LexParser.flow, SyntaxParser.flow]);

flow.finish();

var ast = flow.result('ast');

console.log(treeify.asTree(ast))