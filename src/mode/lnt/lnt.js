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

  CodeMirror.defineMode('lnt', function (config) {
    function words (str) {
      var obj = {}; var words = str.split(' ')
      for (var i = 0; i < words.length; ++i) obj[words[i]] = true
      return obj
    }

    var strongKeywords = words('any array as assert break by case channel disrupt else elsif end eval for function ' +
  'hide if in is list loop module null of only out par process raise range return select set sorted stop then ' +
  'type use var where while with !bits !card !nat_bits !nat_inf !nat_sup !nat_check !int_bits ' +
  '!int_inf !int_sup !int_check !string_card !comparedby !external !implementedby !iteratedby ' +
  '!printedby !representedby')
    var keywords = words('bool nat int real char string false true abs and and_then card div eq first gcd ge get gt ' +
 'implies index IntToNat is_empty IsLower IsUpper IsAlpha IsAlnum IsDigit IsXDigit last le length lt max ' +
 'min mod NatToInt ne neg not nth or ord or_else pos pred prefix rem rindex scm set sign substr succ suffix ' +
 'ToLower ToUpper update val xor')

    var atoms = { 'null': true }

    var isOperatorChar = /[=<>\|+-\/*?;]|\*\*|==|<>|\/=|<=|>=|=>|\|\||\[\]|->/

    function tokenBase (stream, state) {
      var ch = stream.next()
      if (ch == '#' && state.startOfLine) {
        stream.skipToEnd()
        return 'meta'
      }
      if (ch == '"' || ch == "'") {
        state.tokenize = tokenString(ch)
        return state.tokenize(stream, state)
      }
      if (ch == '(' && stream.eat('*')) {
        state.tokenize = tokenComment
        return tokenComment(stream, state)
      }
      if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
        return null
      }
      if (/\d/.test(ch)) {
        stream.eatWhile(/[\w\.]/)
        return 'number'
      }
      if (ch == '/') {
        if (stream.eat('/')) {
          stream.skipToEnd()
          return 'comment'
        }
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
      return 'variable'
    }

    function tokenString (quote) {
      return function (stream, state) {
        var escaped = false; var next; var end = false
        while ((next = stream.next()) != null) {
          if (next == quote && !escaped) { end = true; break }
          escaped = !escaped && next == '\\'
        }
        if (end || !escaped) state.tokenize = null
        return 'string'
      }
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
      lineComment: '--',

      token: function (stream, state) {
        if (stream.eatSpace()) return null
        var style = (state.tokenize || tokenBase)(stream, state)
        if (style == 'comment' || style == 'meta') return style
        return style
      },

      electricChars: '{}'
    }
  })

  CodeMirror.defineMIME('text/x-lnt', 'lnt')
})
