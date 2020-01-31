'use strict'

import Tokenizr from 'tokenizr'

let lexer = new Tokenizr()
lexer.reset()

const COMMENT = /(\(\*(?:.|[\n\r])*?\*\))|(\(\*(?:.|[\n\r])*)/
const RESERVED_WORD = /\b(implementedby|specification|actualizedby|enumeratedby|constructor|iteratedby|comparedby|formaleqns|formalopns|formalsorts|behaviour|printedby|renamedby|sortnames|external|behavior|opnnames|endproc|endspec|endtype|library|process|ofsort|noexit|accept|choice|endlib|forall|atomic|sorts|using|where|stop|type|opns|hide|eqns|exit|par|any|for|let|of|in|is|i)\b/
const RESERVED_SORT = /\b(BasicNaturalNumber|NatRepresentations|NaturalNumber|OctetString|OctNatRepr|BitNatRepr|BitString|DecDigit|DecNatRepr|DecString|HexNatRepr|HexString|OctString|OctDigit|Boolean|HexDigit|String|Octet|Bool|Bit|Nat|Set)\b/
// const STRONG_RESERVED_WORD = /(BasicNaturalNumber|Bit|BitNatRepr|BitString|Bool|Boolean|DecDigit|DecNatRepr|DecString|HexDigit|HexNatRepr|HexString|NatRepresentations|Nat|NaturalNumber|OctDigit|Octet|OctetString|OctNatRepr|OctString|Set|String|false|true|and|Bit1|Bit2|Bit3|Bit4|Bit5|Bit6|Bit7|Bit8|Card|eq|ge|gt|iff|implies|Includes|Insert|Ints|IsIn|IsSubsetOf|le|Length|lt|Minus|NatNum|ne|not|NotIn|or|Remove|Reverse|Succ|Union|xor)/
const RESERVED_LEXICAL_TOKEN = /(\(|\)|\{|\}|,|\.|->|:=|:|;|\[|\]|=>)/
const BEHAVIOUR_OPERATION = /(>>|\|\|\||\|\||\]\||\|\[|\[\]|\[>|\?|!)/
const SPECIAL_CHARACTER = /(\*|#|%|&|\\|\+|-|\.|\/|<|>|@|\^|~|\{|\}|=)+/
const IDENTIFIER = /[a-zA-Z_][a-zA-Z0-9_]*/
const NUMBER = /[+-]?[0-9]+/
const BREAK_LINE = /\/\/[^\r\n]*\r?\n/
const SPACE = /[ \t\r\n]+/
const CHAR = /./
const BINARY_OPERATION = /\b_(.+)_\b/

lexer.rule(COMMENT, (ctx, match) => {
  ctx.ignore()
})
lexer.rule(BINARY_OPERATION, (ctx, match) => {
  ctx.accept('BINARY_OPERATION')
})
lexer.rule(BEHAVIOUR_OPERATION, (ctx, match) => {
  ctx.accept('BEHAVIOUR_OPERATION')
})
lexer.rule(RESERVED_LEXICAL_TOKEN, (ctx, match) => {
  ctx.accept('reserved_lexical_token')
})
lexer.rule(SPECIAL_CHARACTER, (ctx, match) => {
  ctx.accept('SPECIAL_CHARACTER')
})
lexer.rule(RESERVED_WORD, (ctx, match) => {
  ctx.accept('RESERVED_WORD')
})
lexer.rule(RESERVED_SORT, (ctx, match) => {
  ctx.accept('RESERVED_SORT')
})
lexer.rule(IDENTIFIER, (ctx, match) => {
  ctx.accept('id')
})
lexer.rule(NUMBER, (ctx, match) => {
  ctx.accept('NUMBER', parseInt(match[0]))
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
  lexer.input(source)
  var errors = []

  return {
    _errors: errors,
    _tokens: lexer
  }
}

export default LotosLexer
