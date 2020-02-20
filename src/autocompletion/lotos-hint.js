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

  var lotosKeywords = ('accept actualizedby any behaviour behavior choice endlib endproc ' +
  'endspec endtype eqns exit for forall formaleqns formalopns formalsorts hide i in is let library ' +
  'noexit of ofsort opnnames opns par process renamedby sortnames sorts specification stop ' +
  'type using where atomic comparedby constructor enumeratedby external implementedby iteratedby printedby' +
  'BasicNaturalNumber Bit BitNatRepr BitString Bool Boolean DecDigit DecNatRepr DecString ' +
    'HexDigit HexNatRepr HexString NatRepresentations Nat NaturalNumber OctDigit Octet OctetString OctNatRepr ' +
    'OctString Set String false true and Bit1 Bit2 Bit3 Bit4 Bit5 Bit6 Bit7 Bit8 Card eq ge gt iff implies ' +
    'Includes Insert Ints IsIn IsSubsetOf le Length lt Minus NatNum ne not NotIn or Remove Reverse Succ Union xor').split(' ')

  function scriptHint (editor, keywords, getToken, options) {
    // Find the token at the cursor
    var cur = editor.getCursor(); var token = getToken(editor, cur)

    if (/\b(?:comment)\b/.test(token.type)) return
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

  function lotosHint (editor, options) {
    return scriptHint(editor, lotosKeywords,
      function (e, cur) {
        return e.getTokenAt(cur)
      }, options)
  }

  CodeMirror.registerHelper('hint', 'lotos', lotosHint)

  function getCompletions (token, context, keywords, options) {
    var found = []; var start = token.string; var global = options && options.globalScope || window
    function maybeAdd (str) {
      if (str.lastIndexOf(start, 0) === 0) found.push(str)
    }

    forEach(keywords, maybeAdd)

    return found
  }
})
