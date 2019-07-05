'use strict'

import Specification from './structure/Specification'
import Process from './structure/Process'
import Behaviour from './structure/Behaviour'

const DATA = 'EXIT_WITH_DATA_PARSING'
const EXIT = 'EXIT_WITHOUT_DATA_PARSING'
const NOEXIT = 'NOEXIT'
const BINARY_OPERATION = 'BINARY_OPERATION'
const PREFIX_OPERATION = 'PREFIX_OPERATION'
const NUMBER = 'NUMBER'

const RESERVED_WORD = 'RESERVED_WORD'
const RESERVED_SORT = 'RESERVED_SORT'
const RESERVED_LEXICAL_TOKEN = 'reserved_lexical_token'
const BEHAVIOUR_OPERATION = 'BEHAVIOUR_OPERATION'
const ID = 'id'

const SPECIAL_CHARACTER = 'SPECIAL_CHARACTER'

const OP_PARENTHESIS = 'OP_PARENTHESIS'
const OP_PROCESS_INSTANTIATION = 'OP_PROCESS_INSTANTIATION'
const OP_OPERATION = 'OP_OPERATION'
const OP_PALALLELISM = 'OP_PALALLELISM'
const OP_ACTION_PREFIX = 'OP_ACTION_PREFIX'
const OP_HIDING_EVENT = 'OP_HIDING_EVENT'
const OP_EXIT = 'OP_EXIT'

function SyntaticExpection (message, token) {
  this.reason = message
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

  function parameterList () {
    let parameterList = []
    while (true) {
      nextToken()
      let parameter = {
        imagem: null,
        dominio: null
      }
      if (!actualToken.isA(ID)) {
        break
      }
      parameter.imagem = actualToken
      nextToken()
      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ':')) {
        errors.push(new SyntaticExpection(`Need a ":" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
        return null
      }
      nextToken()
      if (!actualToken.isA(ID)) {
        errors.push(new SyntaticExpection(`Need a "id" token to this identifiers list, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        break
      }
      parameter.dominio = actualToken
      parameterList.push(parameter)

      nextToken()

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
        break
      }
    }

    return parameterList
  }

  function createProcess (token) {
    let process = new Process()

    process.token = token
    decl(process)
    nextToken()

    if (actualToken.isA(RESERVED_LEXICAL_TOKEN, '(')) {
      process.parameters = parameterList()
      console.log('TESTANDO', process.parameters)
      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ')')) {
        errors.push(new SyntaticExpection(`Need a ")" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
        return process
      }
      nextToken()
    }

    if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ':')) {
      errors.push(new SyntaticExpection(`Need a ":" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
      return process
    }
    functionType(process)
    nextToken()

    if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ':=')) {
      errors.push(new SyntaticExpection(`Need a ":=" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
      return process
    }
    nextToken()

    process.bahaviour = behaviour(new Behaviour())

    if (actualToken.isA(RESERVED_WORD, 'where')) {
      nextToken()
      process.processList = []
      while (true) {
        if (!actualToken.isA(RESERVED_WORD, 'process')) {
          break
        }
        let processDeclaration = createProcess()
        if (!processDeclaration) {
          break
        }
        process.processList.push(processDeclaration)
      }
    }

    if (!actualToken.isA(RESERVED_WORD, 'endproc')) {
      errors.push(new SyntaticExpection(`Need a "endproc" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
      return process
    }

    nextToken()

    return process
  }

  function valueList () {
    let values = []

    while (true) {
      // Definindo as expressões que formam a equação, no nível maior '0'
      let value = evaluateExpression(0)

      if (!value) {
        break
      }

      if (actualToken.isA(RESERVED_WORD, 'of')) {
        nextToken()

        if (!actualToken.isA(ID)) {
          errors.push(new SyntaticExpection(`Need a "id" token to this identifiers list, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          break
        }
        nextToken()
      }

      values.push(value)

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
        break
      }
    }

    return values
  }

  function behaviour (expression) {
    if (actualToken.isA(RESERVED_LEXICAL_TOKEN, '(')) {
      nextToken()
      expression.operand = OP_PARENTHESIS

      expression.rightBehaviour = behaviour(new Behaviour())

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ')')) {
        errors.push(new SyntaticExpection(`Need a ")" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return null
      }

      nextToken()
    } else if (actualToken.isA(ID) || actualToken.isA(RESERVED_WORD, 'i')) {
      expression.identifier = actualToken
      nextToken()
      if (actualToken.isA(RESERVED_LEXICAL_TOKEN, '[')) {
        expression.operand = OP_PROCESS_INSTANTIATION
        expression.parsingGates = identifierList()

        if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ']')) {
          errors.push(new SyntaticExpection(`Need a "]" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          return null
        }
        nextToken()

        if (actualToken.isA(RESERVED_LEXICAL_TOKEN, '(')) {
          // Não precisa chamar nextToken foi já é executada em evaluateExpression

          expression.values = valueList()

          if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ')')) {
            errors.push(new SyntaticExpection(`Need a ")" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
            return null
          }

          nextToken()
        }
      } else {
        if (expression.identifier.isA(RESERVED_WORD, 'i')) {
          expression.operand = OP_HIDING_EVENT
        } else {
          expression.operand = OP_ACTION_PREFIX
        }
        if (actualToken.isA(BEHAVIOUR_OPERATION, '!') || actualToken.isA(BEHAVIOUR_OPERATION, '?')) {
          let parameterList = []
          while (true) {
            if (actualToken.isA(BEHAVIOUR_OPERATION, '!')) {
              // Definindo as expressões que formam a equação, no nível maior '0'
              let value = evaluateExpression(0)

              if (!value) {
                break
              }

              parameterList.push(value)
            } else if (actualToken.isA(BEHAVIOUR_OPERATION, '?')) {
              nextToken()
              let parameter = {
                imagem: null,
                dominio: null
              }
              if (!actualToken.isA(ID)) {
                break
              }
              parameter.imagem = actualToken
              nextToken()
              if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ':')) {
                errors.push(new SyntaticExpection(`Need a ":" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
                return null
              }
              nextToken()
              if (!actualToken.isA(ID)) {
                errors.push(new SyntaticExpection(`Need a "id" token to this identifiers list, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
                break
              }
              parameter.dominio = actualToken
              parameterList.push(parameter)

              nextToken()
            }
            if (!actualToken.isA(BEHAVIOUR_OPERATION, '!') && !actualToken.isA(BEHAVIOUR_OPERATION, '?')) {
              break
            }
          }
          expression.parameters = parameterList
        }

        if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ';')) {
          errors.push(new SyntaticExpection(`Need a ";" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          return null
        }

        nextToken()
        expression.rightBehaviour = behaviour(new Behaviour())
      }
    }

    if (actualToken.isA(BEHAVIOUR_OPERATION)) {
      let operationalExpression = new Behaviour()
      if (actualToken.isA(BEHAVIOUR_OPERATION, '|[') || actualToken.isA(BEHAVIOUR_OPERATION, '|||') || actualToken.isA(BEHAVIOUR_OPERATION, '||')) {
        operationalExpression.operator = OP_PALALLELISM
        if (actualToken.isA(BEHAVIOUR_OPERATION, '|[')) {
          operationalExpression.parsingGates = identifierList()
          if (!actualToken.isA(BEHAVIOUR_OPERATION, ']|')) {
            errors.push(new SyntaticExpection(`Need a "]|" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
            return null
          }
        }
      } else {
        operationalExpression.operator = OP_OPERATION
      }
      operationalExpression.leftBehaviour = expression
      nextToken()
      operationalExpression.rightBehaviour = behaviour(new Behaviour())
      return operationalExpression
    } else {
      return expression
    }
  }

  function createSpecification (token) {
    let specification = new Specification()
    specification.token = token

    decl(specification)

    nextToken()
    if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ':')) {
      errors.push(new SyntaticExpection(`Need a ":" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
      return specification
    }

    functionType(specification)

    definitionOfTypes(specification)

    if (!actualToken.isA(RESERVED_WORD, 'behaviour')) {
      errors.push(new SyntaticExpection(`Need a "behaviour" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
      return specification
    }

    nextToken()

    if (actualToken.isA(RESERVED_WORD, 'hide')) {
      specification.hidingGates = identifierList()

      if (!actualToken.isA(RESERVED_WORD, 'in')) {
        errors.push(new SyntaticExpection(`Need a "in" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
        return specification
      }

      nextToken()
    }

    specification.bahaviour = behaviour(new Behaviour())

    if (!actualToken.isA(RESERVED_WORD, 'where')) {
      errors.push(new SyntaticExpection(`Need a "where" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
      return specification
    }

    nextToken()

    specification.processList = []
    while (true) {
      if (!actualToken.isA(RESERVED_WORD, 'process')) {
        break
      }
      let processDeclaration = createProcess()
      if (!processDeclaration) {
        break
      }
      specification.processList.push(processDeclaration)
    }

    if (!actualToken.isA(RESERVED_WORD, 'endspec')) {
      errors.push(new SyntaticExpection(`Need a "endspec" token, and the given token ${actualToken.value} of type ${actualToken.value}`, actualToken))
      return specification
    }
    nextToken()

    return specification
  }

  // Method used to create a list of identifiers
  // libraryList
  // freeVariableList
  function identifierList () {
    let identifiers = []

    while (true) {
      nextToken()
      if (!actualToken.isA(ID)) {
        if (identifiers.length) {
          errors.push(new SyntaticExpection(`Need a "id" token to this identifiers list, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        }
        break
      }
      identifiers.push(actualToken)
      nextToken()
      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
        break
      }
    }

    return identifiers
  }

  function chargeLibraries (scope, libraries) {
    console.log('deve carregar as libraries')
  }

  function evaluateExpressionList () {
    let expressions = []

    while (true) {
      let expression = evaluateExpression()

      if (!expression) {
        errors.push(new SyntaticExpection(`We can not evaluate the expression starting with the token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        break
      }

      expressions.push(expression)

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
        break
      }
    }

    return expressions
  }

  function evaluateExpression (level) {
    nextToken()

    let expression = {
      firstTerm: null,
      operator: null,
      secondTerm: null,
      level: level
    }

    level++

    if (actualToken.isA(RESERVED_LEXICAL_TOKEN, '(')) {
      expression.firstTerm = evaluateExpression(level)

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ')')) {
        errors.push(new SyntaticExpection(`Expected ')' token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      nextToken()
    } else {
      if (!actualToken.isA(ID) && !actualToken.isA(NUMBER)) {
        return false
      }

      expression.firstTerm = actualToken

      nextToken()

      if (actualToken.isA(RESERVED_LEXICAL_TOKEN, '(')) {
        expression.firstTermArguments = evaluateExpressionList()

        if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ')')) {
          errors.push(new SyntaticExpection(`Expected ')' token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          return false
        }

        nextToken()
      }
    }

    // TODO: lembrar de validar as operações no sort apropriado, na análise semântica
    if (actualToken.isA(ID) || actualToken.isA(NUMBER) || (actualToken.isA(SPECIAL_CHARACTER) && actualToken.value !== '=')) {
      expression.operator = actualToken
      nextToken()

      if (actualToken.isA(RESERVED_LEXICAL_TOKEN, '(')) {
        expression.secondTerm = evaluateExpression(level)

        if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ')')) {
          errors.push(new SyntaticExpection(`Expected ')' token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          return false
        }

        nextToken()
      } else {
        if (!actualToken.isA(ID) && !actualToken.isA(NUMBER)) {
          errors.push(new SyntaticExpection(`Expected a identifier or a number for the second term of the expression, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          return false
        }

        expression.secondTerm = actualToken

        nextToken()

        if (actualToken.isA(RESERVED_LEXICAL_TOKEN, '(')) {
          expression.firstTermArguments = evaluateExpressionList()

          if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ')')) {
            errors.push(new SyntaticExpection(`Expected ')' token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
            return false
          }

          nextToken()
        }
      }
    }

    return expression
  }

  function equationsExpressionList () {
    let equationExpressions = []

    while (true) {
      var equationExpression = {
        conditionalList: [],
        domain: {},
        image: {}
      }

      // Definindo as expressões que formam a equação, no nível maior '0'
      equationExpression.domain = evaluateExpression(0)

      if (!equationExpression.domain) {
        break
      }

      if (!actualToken.isA(SPECIAL_CHARACTER, '=')) {
        equationExpression.conditionalList.unshift(equationExpression.domain)
        equationExpression.domain = {}

        while (true) {
          if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
            break
          }

          let condition = evaluateExpression(0)

          if (!condition) {
            return false
          }

          equationExpression.conditionalList.unshift(condition)
        }

        if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, '=>')) {
          errors.push(new SyntaticExpection(`Expected '=>' token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          return false
        }

        // Definindo as expressões que formam a equação, no nível maior '0'
        equationExpression.domain = evaluateExpression(0)

        if (!equationExpression.domain) {
          errors.push(new SyntaticExpection(`Can't find a expression.`, actualToken))
          return false
        }
      }

      equationExpression.image = evaluateExpression(0)

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ';')) {
        errors.push(new SyntaticExpection(`Expected ';' token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      equationExpressions.push(equationExpression)
    }

    return equationExpressions
  }

  function renameOperationsList (renamedOperations, typeDefinition) {
    while (true) {
      let renamedOperation = {
        operand: {},
        source: {}
      }

      if (actualToken.isA(BINARY_OPERATION)) {
        renamedOperation.operand = {
          value: actualToken.value.substring(1, -1),
          type: BINARY_OPERATION
        }
      } else if (actualToken.isA(NUMBER)) {
        renamedOperation.operand = {
          value: actualToken.value,
          type: PREFIX_OPERATION
        }
      } else if (actualToken.isA(ID)) {
        renamedOperation.operand = {
          value: actualToken.value,
          type: PREFIX_OPERATION
        }
      } else {
        if (!renamedOperations.length) {
          errors.push(new SyntaticExpection(`Expected a word, a value or a binary term '_*_', and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        }
        break
      }

      nextToken()

      if (!actualToken.isA(RESERVED_WORD, 'for')) {
        errors.push(new SyntaticExpection(`Expected 'for' token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      nextToken()

      if (actualToken.isA(BINARY_OPERATION)) {
        renamedOperation.source = {
          value: actualToken.value.substring(1, -1),
          type: BINARY_OPERATION
        }
      } else if (actualToken.isA(NUMBER)) {
        renamedOperation.source = {
          value: actualToken.value,
          type: PREFIX_OPERATION
        }
      } else if (actualToken.isA(ID)) {
        renamedOperation.source = {
          value: actualToken.value,
          type: PREFIX_OPERATION
        }
      } else {
        errors.push(new SyntaticExpection(`Expected a word, a value or a binary term '_*_', and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        break
      }

      nextToken()

      renamedOperations.unshift(renamedOperation)
    }
  }

  function renameSortsList (renamedSorts, typeDefinition) {
    while (true) {
      let renamedSort = {
        sort: {},
        source: {}
      }

      if (!actualToken.isA(ID)) {
        if (!renamedSorts.length) {
          errors.push(new SyntaticExpection(`Renamed sort needs a "sort" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          return false
        } else {
          break
        }
      }

      renamedSort.sort = actualToken

      nextToken()

      if (!actualToken.isA(RESERVED_WORD, 'for')) {
        errors.push(new SyntaticExpection(`Expected 'for' token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      nextToken()

      if (!actualToken.isA(ID) && !actualToken.isA(RESERVED_SORT)) {
        errors.push(new SyntaticExpection(`Sorts definition source needs a "sort" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      nextToken()

      renamedSorts.unshift(renamedSort)
    }
  }

  /*
   * Lembrar de escrever uma justificativa para a checagem de tipos (inclusive a existência deles) ter ficado na análise semântica
   */
  function equationList (equations, typeDefinition) {
    while (true) {
      let equation = {}
      if (!actualToken.isA(RESERVED_WORD, 'forall')) {
        return false
      }

      equation.freeVariables = identifierList()

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ':')) {
        errors.push(new SyntaticExpection(`Expected ':' token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      nextToken()

      if (!actualToken.isA(ID) && !actualToken.isA(RESERVED_SORT)) {
        errors.push(new SyntaticExpection(`Sorts definition needs a "sort" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      equation.sort = actualToken.value

      nextToken()

      while (true) {
        if (!actualToken.isA(RESERVED_WORD, 'ofsort')) {
          return false
        }

        nextToken()

        if (!actualToken.isA(ID) && !actualToken.isA(RESERVED_SORT)) {
          errors.push(new SyntaticExpection(`Sorts definition needs a "sort" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
          return false
        }

        equation.equationExpressions = equationsExpressionList()

        if (!equation.equationExpressions) {
          return false
        }

        equations.unshift(equation)
      }
    }
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
    }

    if (actualToken.isA(RESERVED_WORD, 'formalopns')) {
      if (!scope.operationList) {
        scope.formalOperationList = []
      }

      operationList(scope.formalOperationList, typeDefinition)
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

      if (!scope.sorts) {
        scope.sorts = []
      }
      sort.type = typeDefinition
      scope.sorts.unshift(sort)

      nextToken()
    }

    if (actualToken.isA(RESERVED_WORD, 'opns')) {
      if (!scope.operationList) {
        scope.operationList = []
      }

      operationList(scope.operationList, typeDefinition)
    }

    if (actualToken.isA(RESERVED_WORD, 'eqns')) {
      if (!scope.equationList) {
        scope.equationList = []
      }

      // chamarei o nextToken aqui, para ajuste na recursividade no método
      nextToken()
      equationList(scope.equationList, typeDefinition)
    }

    return true
  }

  function typeRenamingFunctions (scope, typeDefinition) {
    if (actualToken.isA(RESERVED_WORD, 'sortnames')) {
      if (!scope.renamedSorts) {
        scope.renamedSorts = []
      }

      nextToken()
      renameSortsList(scope.renamedSorts, typeDefinition)
    }

    if (actualToken.isA(RESERVED_WORD, 'opnnames')) {
      if (!scope.renamedOperations) {
        scope.renamedOperations = []
      }

      nextToken()
      renameOperationsList(scope.renamedOperations, typeDefinition)
    }

    return true
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

      scope.libraryTokens = identifierList()

      if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, 'endlib')) {
        errors.push(new SyntaticExpection(`Need a "endlib" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }

      if (scope.libraryTokens && scope.libraryTokens.length) {
        chargeLibraries(scope, scope.libraryTokens)
      }
    } else if (actualToken.isA(RESERVED_WORD, 'type')) {
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

      // Is a extended sort
      while (true) {
        nextToken()
        if (!actualToken.isA('id') && !actualToken.isA(RESERVED_SORT)) {
          break
        }

        if (!typeDefinition.extendedSorts) {
          typeDefinition.extendedSorts = []
        }

        typeDefinition.extendedSorts.push(actualToken)

        nextToken()

        if (!actualToken.isA(RESERVED_LEXICAL_TOKEN, ',')) {
          break
        }
      }

      if (actualToken.isA(RESERVED_WORD, 'renamedby') && typeDefinition.extendedSorts && typeDefinition.extendedSorts.length === 1) {
        nextToken()

        if (!typeRenamingFunctions(scope, typeDefinition)) {
          errors.push(new SyntaticExpection('There was a error in type declaration.', actualToken))
        }
      } else {
        // Carrega os sorts nas definições de tipo
        if (!typeDefinitionFunctions(scope, typeDefinition)) {
          errors.push(new SyntaticExpection('There was a error in type declaration.', actualToken))
        }
      }

      scope.types.unshift(typeDefinition)

      if (!actualToken.isA(RESERVED_WORD, 'endtype')) {
        errors.push(new SyntaticExpection(`Expected 'endtype' ending the type definition block, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
        return false
      }
    } else {
      return false
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
      return createSpecification(token)
    }

    if (token.isA(RESERVED_WORD, 'process')) {
      return createProcess(token)
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
      errors.push(new SyntaticExpection(`Need a "[" token, and the given token ${actualToken.value} of type ${actualToken.type}`, actualToken))
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
