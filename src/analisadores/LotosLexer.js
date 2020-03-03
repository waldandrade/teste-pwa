'use strict'

import Tokenizr from 'tokenizr'

const COMMENT = /(\(\*(?:.|[\n\r])*?\*\))|(\(\*(?:.|[\n\r])*)/
const RESERVED_WORD = /\b(implementedby|specification|actualizedby|enumeratedby|constructor|iteratedby|comparedby|formaleqns|formalopns|formalsorts|behaviour|printedby|renamedby|sortnames|external|behavior|opnnames|endproc|endspec|endtype|library|process|ofsort|noexit|accept|choice|endlib|forall|atomic|sorts|using|where|stop|type|opns|hide|eqns|exit|par|any|for|let|of|in|is|i)\b/
const RESERVED_SORT = /\b(BasicNaturalNumber|NatRepresentations|NaturalNumber|OctetString|OctNatRepr|BitNatRepr|BitString|DecDigit|DecNatRepr|DecString|HexNatRepr|HexString|OctString|OctDigit|Boolean|HexDigit|String|Octet|Bool|Bit|Nat|Set)\b/
const RESERVED_LEXICAL_TOKEN = /(\(|\)|\{|\}|,|\.|->|:=|:|;|\[|\]|=>)/
const BEHAVIOUR_OPERATION = /(>>|\|\|\||\|\||\]\||\|\[|\[\]|\[>|\?|!)/
const SPECIAL_CHARACTER = /(\*|#|%|&|\\|\+|-|\.|\/|<|>|@|\^|~|\{|\}|=)+/
const IDENTIFIER = /[a-zA-Z_][a-zA-Z0-9_]*/
const NUMBER = /\b0|[1-9][0-9]*\b/
const BREAK_LINE = /\/\/[^\r\n]*\r?\n/
const SPACE = /[ \t\r\n]+/
const BINARY_OPERATION = /\b_(.+)_\b/

function LotosLexer (source, hint) {
  this.lexer = new Tokenizr()
  let _source = source
  this.lexer.rule(COMMENT, (ctx, match) => {
    ctx.ignore()
  })
  this.lexer.rule(BINARY_OPERATION, (ctx, match) => {
    ctx.accept('BINARY_OPERATION')
  })
  this.lexer.rule(BEHAVIOUR_OPERATION, (ctx, match) => {
    ctx.accept('BEHAVIOUR_OPERATION')
  })
  this.lexer.rule(RESERVED_LEXICAL_TOKEN, (ctx, match) => {
    ctx.accept('reserved_lexical_token')
  })
  this.lexer.rule(SPECIAL_CHARACTER, (ctx, match) => {
    ctx.accept('SPECIAL_CHARACTER')
  })
  this.lexer.rule(RESERVED_WORD, (ctx, match) => {
    ctx.accept('RESERVED_WORD')
  })
  this.lexer.rule(RESERVED_SORT, (ctx, match) => {
    ctx.accept('RESERVED_SORT')
  })
  this.lexer.rule(IDENTIFIER, (ctx, match) => {
    ctx.accept('id')
  })
  this.lexer.rule(NUMBER, (ctx, match) => {
    ctx.accept('NUMBER', parseInt(match[0]))
  })
  this.lexer.rule(BREAK_LINE, (ctx, match) => {
    ctx.ignore()
  })
  this.lexer.rule(SPACE, (ctx, match) => {
    ctx.ignore()
  })
  this.lexer.rule(/\S\w*/, (ctx, match) => {
    ctx.accept('LEXICAL_ERROR')
  })
  this.lexer.input(_source)
}

export default LotosLexer
