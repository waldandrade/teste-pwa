/* eslint-disable no-undef */
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
import CodeMirror from 'codemirror'

(function (mod) {
  if (typeof exports === 'object' && typeof module === 'object') {
    mod(require('codemirror/lib/codemirror'))
  } else if (typeof define === 'function' && define.amd) {
    define(['codemirror/lib/codemirror'], mod)
  } else {
    mod(CodeMirror)
  }
})(function (CodeMirror) {
  'use strict'
  // declare global: LNTLINT

  function validator (text, options) {
    if (!window.LOTOSLINT) {
      if (window.console) {
        window.console.error('Error: window.LOTOSLINT not defined, CodeMirror linting cannot run.')
      }
      return []
    }
    // JSHint error.character actually is a column index, this fixes underlining on lines using tabs for indentation
    if (!options.indent) {
      options.indent = 1
    } // JSHint default value is 4
    LOTOSLINT(text, options, options.globals)
    var errors = LOTOSLINT.data().errors; var result = []
    if (errors) parseErrors(errors, result)
    return result
  }

  CodeMirror.registerHelper('lint', 'lotos', validator)

  function parseErrors (errors, output) {
    for (var i = 0; i < errors.length; i++) {
      var error = errors[i]
      if (error) {
        if (error.line <= 0) {
          if (window.console) {
            window.console.warn('Cannot display JSHint error (invalid line ' + error.line + ')', error)
          }
          continue
        }

        var start = error.character - 1; var end = start + 1
        if (error.evidence) {
          var index = error.evidence.substring(start).search(/.\b/)
          if (index > -1) {
            end += index
          }
        }

        // Convert to format expected by validation service
        var hint = {
          message: error.reason,
          severity: error.code ? (error.code.startsWith('W') ? 'warning' : 'error') : 'error',
          from: CodeMirror.Pos(error.line - 1, start),
          to: CodeMirror.Pos(error.line - 1, end)
        }

        output.push(hint)
      }
    }
  }
})
