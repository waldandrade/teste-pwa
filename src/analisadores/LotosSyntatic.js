'use strict'

import Specification from './structure/Specification'
import Process from './structure/Process'

const DATA = 'EXIT_WITH_DATA_PARSING'
const EXIT = 'EXIT_WITHOUT_DATA_PARSING'
const NOEXIT = 'NOEXIT'
const BINARY_OPERATION = 'BINARY_OPERATION'
const PREFIX_OPERATION = 'PREFIX_OPERATION'
const NUMBER = 'NUMBER'

const RESERVED_WORD = 'RESERVED_WORD'
const RESERVED_SORT = 'RESERVED_SORT'
const RESERVED_LEXICAL_TOKEN = 'reserved_lexical_token'
const ID = 'id'

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
    if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ':')) {
      errors.push(new SyntaticExpection(`Need a ":" token, and the given token ${lexer.peek().value} of type ${lexer.peek().value}`, lexer.peek()))
      return specification
    }

    functionType(specification)

    definitionOfTypes(specification)

    return specification
  }

  function libraryList () {
    let libraries = []

    while (true) {
      nextToken()
      if (!actualToken.isA(ID)) {
        if (libraries.length) {
          errors.push(new SyntaticExpection(`Need a "id" token to libraries, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        }
        break
      }
      libraries.push(actualToken)
      nextToken()
      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
        break
      }
    }

    return libraries
  }

  function chargeLibraries (scope, libraries) {
    console.log('deve carregar as libraries')
  }

  function operationList (operations, typeDefinition) {
    let operationToken = {
      operandList: [],
      domain: []
    }

    while (true) {
      nextToken()
      let operand = null
      if (actualToken.isA(BINARY_OPERATION)) {
        operand = {
          value: actualToken.value.substring(1, -1),
          type: BINARY_OPERATION
        }
      } else if (actualToken.isA(NUMBER)) {
        operand = {
          value: actualToken.value,
          type: PREFIX_OPERATION
        }
      } else if (actualToken.isA(ID)) {
        operand = {
          value: actualToken.value,
          type: PREFIX_OPERATION
        }
      } else {
        if (!operations.length) {
          errors.push(new SyntaticExpection(`Expected a word, a value or a binary term '_*_', and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        }
        break
      }

      operationToken.operandList.unshift(operand)
      operationToken.typeDefinition = typeDefinition

      nextToken()

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
        break
      }
    }

    if (!operationToken.operandList.length) {
      return false
    }

    if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ':')) {
      errors.push(new SyntaticExpection(`Expected ':' to define a operation, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
      return false
    }

    while (true) {
      nextToken()

      if (!actualToken.isA(ID) && !actualToken.isA(RESERVED_SORT)) {
        if (operationToken.domain.length) {
          errors.push(new SyntaticExpection(`Expected a word for define the operation domain sorts, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          return false
        } else {
          break
        }
      }

      /**
       * Testar na semântica, se algum operador é binário e tem um dominio de tamanho diferente de 2
       */

      operationToken.domain.push(actualToken)

      nextToken()

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
        break
      }
    }

    if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, '->')) {
      errors.push(new SyntaticExpection(`Expected '->' to define the operation result, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
      return false
    }

    nextToken()

    if (!actualToken.isA(ID) && !actualToken.isA(RESERVED_SORT)) {
      errors.push(new SyntaticExpection(`Expected a word for define the operation codomain, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
      return false
    }

    operationToken.codomain = actualToken

    operations.unshift(operationToken)

    operationList(operations, typeDefinition)
  }

  function typeDefinitionFunctions (scope, typeDefinition) {
    console.log(actualToken)
    console.log(typeDefinition)

    if (actualToken.isA(RESERVED_WORD, 'formalsorts')) {
      nextToken()
      let formalSort = {}
      if (!actualToken.isA(ID)) {
        errors.push(new SyntaticExpection(`Sorts definition needs a "identifier" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }
      formalSort.id = actualToken

      if (!typeDefinition.formalSorts) {
        typeDefinition.formalSorts = []
      }
      typeDefinition.formalSorts.unshift(formalSort)

      nextToken()

      if (actualToken.isA(RESERVED_WORD, 'formalopns')) {
        if (!scope.operationList) {
          scope.formalOperationList = []
        }

        operationList(scope.formalOperationList, typeDefinition)
      }
      return true
    }

    if (actualToken.isA(RESERVED_WORD, 'sorts')) {
      nextToken()
      let sort = {}
      if (!actualToken.isA(ID) && !actualToken.isA(RESERVED_SORT)) {
        errors.push(new SyntaticExpection(`Sorts definition needs a "identifier" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }
      sort.id = actualToken

      if (!typeDefinition.sorts) {
        typeDefinition.sorts = []
      }
      typeDefinition.sorts.unshift(sort)

      nextToken()

      if (actualToken.isA(RESERVED_WORD, 'opns')) {
        if (!scope.operationList) {
          scope.operationList = []
        }

        operationList(scope.operationList, typeDefinition)
      }

      return true
    }
  }

  /**
   * Definições de tipo, importação de bibliotecas, etc
   */
  function definitionOfTypes (scope) {
    nextToken()

    if (actualToken.isA(RESERVED_WORD, 'library')) {
      if (scope.libraryTokens) {
        errors.push(new SyntaticExpection(`Attempting to import libraries multiple times`, actualToken))
        return false
      }

      scope.libraryTokens = libraryList()

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, 'endlib')) {
        errors.push(new SyntaticExpection(`Need a "endlib" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      if (scope.libraryTokens && scope.libraryTokens.length) {
        chargeLibraries(scope, scope.libraryTokens)
      }

      return true
    }

    if (actualToken.isA(RESERVED_WORD, 'type')) {
      if (!scope.types) {
        scope.types = []
      }

      let typeDefinition = {}

      nextToken()
      if (!actualToken.isA(ID) && !actualToken.isA(RESERVED_SORT)) {
        errors.push(new SyntaticExpection(`Type definition needs a "identifier" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      typeDefinition.title = actualToken

      nextToken()

      if (!actualToken.isA(RESERVED_WORD, 'is')) {
        errors.push(new SyntaticExpection(`Expected 'is' after type identifier, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      nextToken()

      if (actualToken.isA('id')) {
        // Is a extended sort
      }

      // Carrega os sorts nas definições de tipo
      if (!typeDefinitionFunctions(scope, typeDefinition)) {
        errors.push(new SyntaticExpection('There was a error in type declaration.', actualToken))
      }

      scope.types.unshift(typeDefinition)

      return true
    }

    if (!definitionOfTypes(scope)) {
      return false
    }
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
    if (actualToken.isA(RESERVED_WORD, 'exit')) {
      if (scope instanceof Process) {
        nextToken()
        if (actualToken.isA(RESERVED_LEXICAL_TOKEN, '(')) {
          scope.functionality = DATA

          scope.functionSorts = functionSorts()

          return true
        }
      }
      scope.functionality = EXIT
      return true
    }

    if (actualToken.isA(RESERVED_WORD, 'noexit')) {
      scope.functionality = NOEXIT
      return true
    }

    errors.push(new SyntaticExpection(`Need a function token like "exit" ou "noexit", and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
    return false
  }

  function gateList () {
    let gates = []

    while (true) {
      nextToken()
      if (!actualToken.isA(ID)) {
        if (gates.length) {
          errors.push(new SyntaticExpection(`Need a "id" token to gatelsit, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        }
        break
      }
      gates.push(actualToken)
      nextToken()
      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
        break
      }
    }

    return gates
  }

  function scopeCheck (token) {
    if (token.isA(RESERVED_WORD, 'specification')) {
      return specification(token)
    }

    if (token.isA(RESERVED_WORD, 'process')) {
      return process(token)
    }

    return null
  }

  function decl (scope) {
    nextToken()
    if (!actualToken.isA(ID)) {
      errors.push(new SyntaticExpection(`Need a "id" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
      return false
    }
    scope.title = actualToken

    nextToken()
    if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, '[')) {
      errors.push(new SyntaticExpection(`Need a "[" token, and the given token ${actualToken.value} of type ${actualToken.type}`, lexer.peek()))
      return false
    }

    scope.visibleGateList = gateList()

    if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ']')) {
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
