/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-redeclare */
/* eslint-disable no-use-before-define */
import CodeMirror from 'codemirror'

(function (mod) {
  if (typeof exports === 'object' && typeof module === 'object') {
    mod(require('codemirror/lib/codemirror'))
  // eslint-disable-next-line no-undef
  } else if (typeof define === 'function' && define.amd) {
    // eslint-disable-next-line no-undef
    define(['codemirror/lib/codemirror'], mod)
  } else {
    mod(CodeMirror)
  }
})(function (CodeMirror) {
  var Pos = CodeMirror.Pos

  function forEach (arr, f) {
    for (var i = 0, e = arr.length; i < e; ++i) f(arr[i])
  }

  var lntKeywords = ('any array as assert break by case channel disrupt else elsif end eval for function ' +
  'hide if in is list loop module null of only out par process raise range return select set sorted stop then ' +
  'type use var where while with !bits !card !nat_bits !nat_inf !nat_sup !nat_check !int_bits ' +
  '!int_inf !int_sup !int_check !string_card !comparedby !external !implementedby !iteratedby ' +
  '!printedby !representedby bool nat int real char string false true abs and and_then card div eq first gcd ge get gt ' +
 'implies index IntToNat is_empty IsLower IsUpper IsAlpha IsAlnum IsDigit IsXDigit last le length lt max ' +
 'min mod NatToInt ne neg not nth or ord or_else pos pred prefix rem rindex scm set sign substr succ suffix ' +
 'ToLower ToUpper update val xor').split(' ')

  function scriptHint (editor, keywords, getToken, options) {
    // Find the token at the cursor
    var cur = editor.getCursor(); var token = getToken(editor, cur)

    if (/\b(?:string|comment)\b/.test(token.type)) return
    var innerMode = CodeMirror.innerMode(editor.getMode(), token.state)
    token.state = innerMode.state

    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = { start: cur.ch,
        end: cur.ch,
        string: '',
        state: token.state,
        type: token.string === '.' ? 'property' : null
      }
    } else if (token.end > cur.ch) {
      token.end = cur.ch
      token.string = token.string.slice(0, cur.ch - token.start)
    }

    var tprop = token
    // If it is a property, find out what it is a property of.
    while (tprop.type === 'property') {
      tprop = getToken(editor, Pos(cur.line, tprop.start))
      if (tprop.string !== '.') return
      tprop = getToken(editor, Pos(cur.line, tprop.start))
      if (!context) var context = []
      context.push(tprop)
    }
    return { list: getCompletions(token, context, keywords, options),
      from: Pos(cur.line, token.start),
      to: Pos(cur.line, token.end) }
  }

  function lntHint (editor, options) {
    return scriptHint(editor, lntKeywords,
      function (e, cur) {
        return e.getTokenAt(cur)
      }, options)
  }

  CodeMirror.registerHelper('hint', 'lnt', lntHint)

  function getCompletions (token, context, keywords, options) {
    var found = []; var start = token.string; var global = options && options.globalScope || window
    function maybeAdd (str) {
      if (str.lastIndexOf(start, 0) === 0) found.push(str)
    }

    forEach(keywords, maybeAdd)

    return found
  }
})
