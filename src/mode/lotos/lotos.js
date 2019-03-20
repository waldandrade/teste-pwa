/* eslint-disable no-cond-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable eqeqeq */
/* eslint-disable brace-style */
/* eslint-disable no-undef */
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
import CodeMirror from 'codemirror'

(function (mod) {
  if (typeof exports === 'object' && typeof module === 'object') // CommonJS
  { mod(require('codemirror/lib/codemirror')) } else if (typeof define === 'function' && define.amd) // AMD
  { define(['codemirror/lib/codemirror'], mod) } else // Plain browser env
  { mod(CodeMirror) }
})(function (CodeMirror) {
  'use strict'

  CodeMirror.defineMode('lotos', function (config) {
    function words (str) {
      var obj = {}; var words = str.split(' ')
      for (var i = 0; i < words.length; ++i) obj[words[i]] = true
      return obj
    }

    var strongKeywords = words('accept actualizedby any behaviour behavior choice endlib endproc ' +
    'endspec endtype eqns exit for forall formaleqns formalopns formalsorts hide i in is let library ' +
    'noexit of ofsort opnnames opns par process renamedby sortnames sorts specification stop ' +
    'type using where atomic comparedby constructor enumeratedby external implementedby iteratedby printedby')
    var keywords = words('BasicNaturalNumber Bit BitNatRepr BitString Bool Boolean DecDigit DecNatRepr DecString ' +
    'HexDigit HexNatRepr HexString NatRepresentations Nat NaturalNumber OctDigit Octet OctetString OctNatRepr ' +
    'OctString Set String false true and Bit1 Bit2 Bit3 Bit4 Bit5 Bit6 Bit7 Bit8 Card eq ge gt iff implies ' +
    'Includes Insert Ints IsIn IsSubsetOf le Length lt Minus NatNum ne not NotIn or Remove Reverse Succ Union xor')

    var atoms = { 'null': true }

    var isOperatorChar = /[<>+-\/*!?;]|\*\*|==|<>|>=|<=|=>|>>|\[>|\|\||\|\[|\]\||\[\]|\|\|\|/

    function tokenBase (stream, state) {
      var ch = stream.next()
      if (ch == '#' && state.startOfLine) {
        stream.skipToEnd()
        return 'meta'
      }
      if (ch == '(' && stream.eat('*')) {
        state.tokenize = tokenComment
        return tokenComment(stream, state)
      }
      if (/[\[\]{}\(\),\:\.]/.test(ch)) {
        return null
      }
      if (/\d/.test(ch)) {
        stream.eatWhile(/[\w\.]/)
        return 'number'
      }
      if (isOperatorChar.test(ch)) {
        stream.eatWhile(isOperatorChar)
        return 'operator'
      }
      stream.eatWhile(/[\w\$_]/)
      var cur = stream.current()
      if (keywords.propertyIsEnumerable(cur)) return 'keyword'
      if (strongKeywords.propertyIsEnumerable(cur)) return 'strongKeywords'
      if (atoms.propertyIsEnumerable(cur)) return 'atom'
      return 'gate'
    }

    function tokenComment (stream, state) {
      var maybeEnd = false; var ch
      while (ch = stream.next()) {
        if (ch == ')' && maybeEnd) {
          state.tokenize = null
          break
        }
        maybeEnd = (ch == '*')
      }
      return 'comment'
    }

    // Interface

    return {
      startState: function () {
        return {
          tokenize: null,
          indented: 0,
          startOfLine: true,
          prevToken: null
        }
      },

      blockCommentStart: '(*',
      blockCommentEnd: '*)',
      blockCommentContinue: ' * ',

      token: function (stream, state) {
        if (stream.eatSpace()) return null
        var style = (state.tokenize || tokenBase)(stream, state)
        if (style == 'comment' || style == 'meta') return style
        return style
      },

      electricChars: '{}'
    }
  })

  CodeMirror.defineMIME('text/x-lotos', 'lotos')
})
