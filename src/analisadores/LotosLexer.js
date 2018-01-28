'use strict'

import Tokenizr from 'tokenizr'

let lexer = new Tokenizr()
lexer.reset()

const COMMENT = /(\(\*(?:.|[\n\r])*?\*\))|(\(\*(?:.|[\n\r])*)/
const RESERVED_WORD = /(implementedby|specification|actualizedby|enumeratedby|constructor|iteratedby|comparedby|formaleqns|formalopns|formalsorts|behaviour|printedby|renamedby|sortnames|external|behavior|opnnames|endproc|endspec|endtype|library|process|ofsort|noexit|accept|choice|endlib|forall|atomic|sorts|using|where|stop|type|opns|hide|eqns|exit|par|any|for|let|of|in|is|i)/
const STRONG_RESERVED_WORD = /(BasicNaturalNumber|Bit|BitNatRepr|BitString|Bool|Boolean|DecDigit|DecNatRepr|DecString|HexDigit|HexNatRepr|HexString|NatRepresentations|Nat|NaturalNumber|OctDigit|Octet|OctetString|OctNatRepr|OctString|Set|String|false|true|and|Bit1|Bit2|Bit3|Bit4|Bit5|Bit6|Bit7|Bit8|Card|eq|ge|gt|iff|implies|Includes|Insert|Ints|IsIn|IsSubsetOf|le|Length|lt|Minus|NatNum|ne|not|NotIn|or|Remove|Reverse|Succ|Union|xor)/
const RESERVED_LEXICAL_TOKEN = /(\*|>>|\|\|\||\]\||\|\[|\[\]|\[>|\(|\)|\{|\}|,|\.|;|\?|!|=>|->|:=|:|\[|\]|\|)/
const SPECIAL_CHARACTER = /(#|%|&|\|\+|-|\.|\/|<|>|@|\^|~|\{|\}|=)/
const IDENTIFIER = /[a-zA-Z_][a-zA-Z0-9_]*/
const NUMBER = /[+-]?[0-9]+/
const BREAK_LINE = /\/\/[^\r\n]*\r?\n/
const SPACE = /[ \t\r\n]+/
const CHAR = /./
const LR_EQUATION = /_._/
const L_EQUATION = /_./
const R_EQUATION = /._/

lexer.rule(COMMENT, (ctx, match) => {
  ctx.ignore()
})
lexer.rule(LR_EQUATION, (ctx, match) => {
  ctx.accept('LR_EQUATION')
})
lexer.rule(L_EQUATION, (ctx, match) => {
  ctx.accept('L_EQUATION')
})
lexer.rule(R_EQUATION, (ctx, match) => {
  ctx.accept('R_EQUATION')
})
lexer.rule(/_/, (ctx, match) => {
  ctx.accept('UNDERLINE')
})
lexer.rule(RESERVED_WORD, (ctx, match) => {
  ctx.accept('RESERVED_WORD')
})
lexer.rule(STRONG_RESERVED_WORD, (ctx, match) => {
  ctx.accept('RESERVED_WORD')
})
lexer.rule(RESERVED_LEXICAL_TOKEN, (ctx, match) => {
  ctx.accept('reserved_lexical_token')
})
lexer.rule(SPECIAL_CHARACTER, (ctx, match) => {
  ctx.accept('SPECIAL_CHARACTER')
})
lexer.rule(IDENTIFIER, (ctx, match) => {
  ctx.accept('id')
})
lexer.rule(NUMBER, (ctx, match) => {
  ctx.accept('number', parseInt(match[0]))
})
lexer.rule(BREAK_LINE, (ctx, match) => {
  ctx.ignore()
})
lexer.rule(SPACE, (ctx, match) => {
  ctx.ignore()
})
lexer.rule(CHAR, (ctx, match) => {
  ctx.accept('char')
})

function LotosLexer (source) {
  // console.log(source)
  lexer.input(source)

  return {
    _tokens: lexer
  }
}

export default LotosLexer
