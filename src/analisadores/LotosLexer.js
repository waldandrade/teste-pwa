'use strict'

import Tokenizr from 'tokenizr'

function LexExpection (message, text, column, line) {
  this.reason = message
  this.name = 'LexExpection'
  this.column = column
  this.line = line
}

const COMMENT = /(\(\*(?:.|[\n\r])*?\*\))|(\(\*(?:.|[\n\r])*)/
const RESERVED_WORD = /\b(implementedby|specification|actualizedby|enumeratedby|constructor|iteratedby|comparedby|formaleqns|formalopns|formalsorts|behaviour|printedby|renamedby|sortnames|external|behavior|opnnames|endproc|endspec|endtype|library|process|ofsort|noexit|accept|choice|endlib|forall|atomic|sorts|using|where|stop|type|opns|hide|eqns|exit|par|any|for|let|of|in|is|i)\b/
const RESERVED_SORT = /\b(BasicNaturalNumber|NatRepresentations|NaturalNumber|OctetString|OctNatRepr|BitNatRepr|BitString|DecDigit|DecNatRepr|DecString|HexNatRepr|HexString|OctString|OctDigit|Boolean|HexDigit|String|Octet|Bool|Bit|Nat|Set)\b/
const RESERVED_LEXICAL_TOKEN = /(\(|\)|\{|\}|,|\.|->|:=|:|;|\[|\]|=>)/
const BEHAVIOUR_OPERATION = /(>>|\|\|\||\|\||\]\||\|\[|\[\]|\[>|\?|!)/
const SPECIAL_CHARACTER = /(\*|#|%|&|\\|\+|-|\.|\/|<|>|@|\^|~|\{|\}|=)+/
const IDENTIFIER = /[a-zA-Z_][a-zA-Z0-9_]*/
const NUMBER = /0|[1-9][0-9]*\b/
const BREAK_LINE = /\/\/[^\r\n]*\r?\n/
const SPACE = /[ \t\r\n]+/
const BINARY_OPERATION = /\b_(.+)_\b/

class LotosLexer {
  constructor (source, hint) {
    this._errors = []
    this._lexer = new Tokenizr()
    this._lexer.reset()
    this._source = source
    this.__terminated = false
    this._lexer.rule(COMMENT, (ctx, match) => {
      ctx.ignore()
    })
    this._lexer.rule(BINARY_OPERATION, (ctx, match) => {
      ctx.accept('BINARY_OPERATION')
    })
    this._lexer.rule(BEHAVIOUR_OPERATION, (ctx, match) => {
      ctx.accept('BEHAVIOUR_OPERATION')
    })
    this._lexer.rule(RESERVED_LEXICAL_TOKEN, (ctx, match) => {
      ctx.accept('reserved_lexical_token')
    })
    this._lexer.rule(SPECIAL_CHARACTER, (ctx, match) => {
      ctx.accept('SPECIAL_CHARACTER')
    })
    this._lexer.rule(RESERVED_WORD, (ctx, match) => {
      ctx.accept('RESERVED_WORD')
    })
    this._lexer.rule(RESERVED_SORT, (ctx, match) => {
      ctx.accept('RESERVED_SORT')
    })
    this._lexer.rule(IDENTIFIER, (ctx, match) => {
      ctx.accept('id')
    })
    this._lexer.rule(NUMBER, (ctx, match) => {
      ctx.accept('NUMBER', parseInt(match[0]))
    })
    this._lexer.rule(BREAK_LINE, (ctx, match) => {
      ctx.ignore()
    })
    this._lexer.rule(SPACE, (ctx, match) => {
      ctx.ignore()
    })
    this._lexer.rule(/.+/, (ctx, match) => {
      let info = ctx.info()
      console.log(1)
      this._errors.push(new LexExpection(`Unknown term ${match[0]}`, match[0], info.column, info.line))
      ctx.ignore()
    })
    this._lexer.finish((ctx) => {
      hint.errors = (hint.errors || []).concat(this._errors)
    })
    this._lexer.input(this._source)
  }

  _errors
  _lexer
  _terminated

  get terminated () {
    return this._terminated
  }

  set terminated (t) {
    this._terminated = t
  }

  set lexer (l) {
    this._lexer = l
  }

  get lexer () {
    return this._lexer
  }

  get errors () {
    return this._errors
  }
}

export default LotosLexer
