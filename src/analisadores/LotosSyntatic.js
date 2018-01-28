'use strict'

import Specification from './structure/Specification'
import Process from './structure/Process'

const DATA = 'EXIT_WITH_DATA_PARSING'
const EXIT = 'EXIT_WITHOUT_DATA_PARSING'
const NOEXIT = 'NOEXIT'

function SyntaticExpection (message, token) {
  this.message = message
  this.name = 'SyntaticExpection'
  this.column = token.column
  this.line = token.line
}

function LotosSyntatic (lexer) {
  let raiz = null
  let errors = []
  let actualToken = null

  function nextToken () {
    actualToken = lexer.token()
  }

  function process (token) {
    let process = new Process()

    specification.token = token

    return process
  }

  function specification (token) {
    let specification = new Specification()
    specification.token = token

    decl(specification)

    nextToken()
    if (!actualToken.isA('reserved_lexical_token', ':')) {
      errors.push(new SyntaticExpection(`Need a ":" token, and the given token ${lexer.peek().value} of type ${lexer.peek().value}`, lexer.peek()))
      return specification
    }

    functionType(specification)

    definitionOfTypes()

    return specification
  }

  function definitionOfTypes () {
    nextToken()
  }

  function functionSorts () {
    nextToken()

    /**
     * TODO
     * Construir a estrutura das funcionalidades do processo
     *
     * he functionality of a process is the set of tuples of results it can produce; for example:
     * process DIVIDE [source] (Divisor : Nat_ Sort) : exit (Int_ Sort, Nat0_ Sort) :=
     * has functionality:
     * Int_ Sort  Nat 0 _ Sort
     * generally speaking, if the behaviour expressions combined by some operator can terminate, their functionality
     * must be the same; for example, P1 and P2 must have the same functionality in the following cases:
     */
  }

  /**
   *
   * @param {Verifica se o processo é exit ou noexit, e se for um processo, verifica os sorts} scope
   */
  function functionType (scope) {
    nextToken()
    if (actualToken.isA('RESERVED_WORD', 'exit')) {
      if (scope instanceof Process) {
        nextToken()
        if (actualToken.isA('reserved_lexical_token', '(')) {
          scope.functionality = DATA

          scope.functionSorts = functionSorts()

          return true
        }
      }
      scope.functionality = EXIT
      return true
    }

    if (actualToken.isA('RESERVED_WORD', 'noexit')) {
      scope.functionality = NOEXIT
      return true
    }

    errors.push(new SyntaticExpection(`Need a function token like "exit" ou "noexit", and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
    return false
  }

  function gateList () {
    let gateList = []

    while (true) {
      nextToken()
      if (!actualToken.isA('id')) {
        if (gateList.length) {
          errors.push(new SyntaticExpection(`Need a "id" token to gatelsit, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        }
        break
      }
      gateList.push(actualToken)
      nextToken()
      if (!actualToken.isA('reserved_lexical_token', ',')) {
        break
      }
    }

    return gateList
  }

  function scopeCheck (token) {
    if (token.isA('RESERVED_WORD', 'specification')) {
      return specification(token)
    }

    if (token.isA('RESERVED_WORD', 'process')) {
      return process(token)
    }

    return null
  }

  function decl (scope) {
    nextToken()
    if (!actualToken.isA('id')) {
      errors.push(new SyntaticExpection(`Need a "id" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
      return false
    }
    scope.title = actualToken

    nextToken()
    if (!actualToken.isA('reserved_lexical_token', '[')) {
      errors.push(new SyntaticExpection(`Need a "[" token, and the given token ${actualToken.value} of type ${actualToken.type}`, lexer.peek()))
      return false
    }

    scope.visibleGateList = gateList()

    if (!actualToken.isA('reserved_lexical_token', ']')) {
      errors.push(new SyntaticExpection(`Need a "]" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
      return false
    }

    return true
  }

  // currentToken()

  nextToken()
  raiz = scopeCheck(actualToken)

  if (!raiz) {
    errors.push(new SyntaticExpection(`Specifications need start with "process" or "specification"`, 1, 1, actualToken))
  }

  return {
    _errors: errors,
    raiz: raiz
  }
}

export default LotosSyntatic
