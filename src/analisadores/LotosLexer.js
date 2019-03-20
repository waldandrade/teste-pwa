'use strict'

var events = require('events')

/**
 * @param {*} source
 *  Código fonte
 *
 */
function LotosLexer (source) {
  var lines = source

  // substitui qualquer tipo de caractere de nova linha, por \n, por fim dá um split afim de gerar um array de linhas.
  if (typeof lines === 'string') {
    lines = lines
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
  }

  this.emitter = new events.EventEmitter()
  this.source = source
  this.setLines(lines)
  this.prereg = true

  this.line = 0
  this.char = 1
  this.from = 1
  this.input = ''
  this.inComment = false
  this.context = []
  this.templateStarts = []

  console.log(lines)
}

LotosLexer.prototype = {
  _lines: [],

  // verificar forma de utilizar o store (vuex) para máquina de estados do analisador
  setLines: function (val) {
    this._lines = val
    // state.lines = this._lines;
  }
}

export default LotosLexer
