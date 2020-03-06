'use strict'

const BINARY_OPERATION = 'BINARY_OPERATION'
const OP_PROCESS_INSTANTIATION = 'OP_PROCESS_INSTANTIATION'
const OP_ACTION_PREFIX = 'OP_ACTION_PREFIX'
const OP_HIDING_EVENT = 'OP_HIDING_EVENT'
// const DATA = 'EXIT_WITH_DATA_PARSING'
// const EXIT = 'EXIT_WITHOUT_DATA_PARSING'
const NOEXIT = 'NOEXIT'

function SemanticExpection (message, token) {
  this.reason = message
  this.name = 'SemanticExpection'
  this.column = token.column
  this.line = token.line
}

function LotosSemantic (syntaticTree) {
  let errors = []

  function duplicatedTypes (typeList) {
    var i = 0
    while (i < typeList.length) {
      var j = i + 1
      while (j < typeList.length) {
        if (typeList[i].title.value === typeList[j].title.value) {
          errors.push(new SemanticExpection(`Duplicated type "${typeList[i].title.value}"`, typeList[i].title))
        }
        j++
      }
      i++
    }
  }

  function duplicatedSort (sorts) {
    var i = 0
    while (i < sorts.length) {
      var j = i + 1
      while (j < sorts.length) {
        if (sorts[i].id.value === sorts[j].id.value) {
          errors.push(new SemanticExpection(`Duplicated sorts "${sorts[i].id.value}"`, sorts[i].id))
        }
        j++
      }
      i++
    }
  }

  function extendedSorts (original, extendedTypes, sorts, opns) {
    extendedTypes.forEach(element => {
      var found = syntaticTree.types.find(otherTypes => {
        return otherTypes.title.value === element.value
      })
      if (found) {
        found.overridedBy = original
        if (found.sorts) {
          sorts.push(found.sorts)
        }
        if (found.opns) {
          found.opns.forEach(o => opns.unshift(o))
        }
        if (found.extendedTypes && found.extendedTypes.length) {
          extendedSorts(original, found.extendedTypes, sorts, opns)
        }
      }
    })
  }

  function generateSortAndOpnsList (type) {
    type.sortList = []
    if (type.extendedTypes && type.extendedTypes.length && !type.overridedBy) {
      if (!type.opns) {
        type.opns = []
      }
      extendedSorts(type, type.extendedTypes, type.sortList, type.opns)
    } else {
      if (type.sorts) type.sortList.push(type.sorts)
    }
  }

  /*
   * Verifica os tipos de dados utilizados nos operadores e equações
   * - Verificar os Sorts das variáveis declaradas, e se está funcionando bem quando tem mais de um tipo de variável
   */
  function sortsAndOperationIsCorrect (typeDef) {
    let type = typeDef.overridedBy || typeDef
    if (type.opns && type.opns.length) {
      type.opns.forEach(opns => {
        if (opns.operand.type === BINARY_OPERATION) {
          if (opns.domain.length !== 2) {
            errors.push(new SemanticExpection(`The operation "${opns.operand.value}" is BINARY, but you have ${opns.domain.length} domains`, opns.operand.token))
          }
        }
        if (opns.domain && opns.domain.length) {
          opns.domain.forEach(domain => {
            var found = type.sortList.find(sort => {
              return sort.id.value === domain.value
            })
            if (!found) {
              errors.push(new SemanticExpection(`Sort not found "${domain.value}"`, domain))
            }
          })
        }
        if (opns.codomain) {
          var found = type.sortList.find(sort => {
            return sort.id.value === opns.codomain.value
          })
          if (!found) {
            errors.push(new SemanticExpection(`Sort not found "${opns.codomain.value}"`, opns.codomain))
          }
        }
      })
    }
    if (type.eqns) {
      if (type.eqns.variables) {
        type.eqns.variables.forEach(variable => {
          var found = type.sortList.find(sort => {
            return sort.id.value === variable.sort.value
          })
          if (!found) {
            errors.push(new SemanticExpection(`Sort not found "${variable.sort.value}"`, variable.sort))
          }
        })
      }

      type.eqns.equationGroups.forEach(equationGroup => {
        var ofsort = type.sortList.find(sort => {
          return sort.id.value === equationGroup.ofsort.value
        })
        if (!ofsort) {
          errors.push(new SemanticExpection(`Sort not found "${equationGroup.ofsort.value}"`, equationGroup.ofsort))
        }

        equationGroup.equationExpressions.forEach(equation => {
          let operation = null
          if (equation.domain.operator) {
            operation = type.opns.find(op => {
              return op.operand.value === equation.domain.operator.value
            })
            if (!operation) {
              errors.push(new SemanticExpection(`Operation not found "${equation.domain.operator.value}"`, equation.domain.operator))
            }
            if (operation) {
              if (operation.codomain.value !== equationGroup.ofsort.value) {
                errors.push(new SemanticExpection(`Operator results in a sort "${operation.codomain.value}" and must result in "${equationGroup.ofsort.value}"`, equation.domain.operator))
              }
            }
          } else {
            operation = type.opns.find(op => {
              return op.operand.value === equation.domain.firstTerm.token.value
            })
            if (!operation) {
              errors.push(new SemanticExpection(`Operation not found "${equation.domain.firstTerm.token.value}"`, equation.domain.firstTerm.token))
            }
            if (operation) {
              if (operation.codomain.value !== equationGroup.ofsort.value) {
                errors.push(new SemanticExpection(`Operator results in a sort "${operation.codomain.value}" and must result in "${equationGroup.ofsort.value}"`, equation.domain.firstTerm.token))
              }
            }
          }
        })
      })
    }
  }

  function checkDuplicatedVariables (equation) {
    var i = 0
    while (i < equation.variables.length) {
      var j = i + 1
      while (j < equation.variables.length) {
        if (equation.variables[i].id.value === equation.variables[j].id.value) {
          errors.push(new SemanticExpection(`Duplicated variables "${equation.variables[i].id.value}"`, equation.variables[i].id))
        }
        j++
      }
      i++
    }
  }

  function termInVariables (term, variables) {
    return variables.find(variable => {
      return variable.id.value === term.value
    })
  }

  function valueExists (value, typeDef) {
    let type = typeDef.overridedBy || typeDef
    if (type && type.opns && type.opns.length) {
      var found = type.opns.find(opns => {
        return opns.operand.value === value
      })
      if (found) {
        return found
      }
    }
    return null
  }

  function termInOpns (term, opns) {
    return opns.find(oper => {
      return oper.operand.value === term.value
    })
  }

  function equationTermExists (operator, firstTerm, secondTerm, variables, opns) {
    if (operator) {
      let operation = termInOpns(operator, opns)

      if (!operation) {
        errors.push(new SemanticExpection(`Unknown term "${operator.value}"`, operator))
      }

      if (operation && firstTerm) {
        equationTermExists(null, firstTerm, null, variables, opns)
      }
      if (operation && secondTerm) {
        equationTermExists(null, secondTerm, null, variables, opns)
      }
    } else if (firstTerm.token) {
      let variable = termInVariables(firstTerm.token, variables)
      let operation = termInOpns(firstTerm.token, opns)

      if (!variable && !operation) {
        errors.push(new SemanticExpection(`Unknown term "${firstTerm.token.value}"`, firstTerm.token))
      }

      if (operation && firstTerm.arguments && firstTerm.arguments.length) {
        if (operation.domain.length !== firstTerm.arguments.length) {
          errors.push(new SemanticExpection(`Operation "${firstTerm.token.value}", expect ${operation.domain.length} arguments and got ${firstTerm.arguments.length}.`, firstTerm.token))
        }
        firstTerm.arguments.forEach(arg => {
          equationTermExists(arg.operator, arg.firstTerm, arg.secondTerm, variables, opns)
        })
      }
    } else {
      equationTermExists(firstTerm.operator, firstTerm.firstTerm, firstTerm.secondTerm, variables, opns)
    }
  }

  function checkEquationTermsExists (equationGroup, variables, opns) {
    equationGroup.equationExpressions.forEach(equation => {
      equationTermExists(equation.domain.operator, equation.domain.firstTerm, equation.domain.secondTerm, variables, opns)
      equationTermExists(equation.image.operator, equation.image.firstTerm, equation.image.secondTerm, variables, opns)
    })
  }

  function extractSortsFromOperator (operator, firstTerm, opnsList) {
    return (opnsList || []).filter(opns => {
      return opns.operand.value === (operator ? operator.value : firstTerm.token.value)
    })
  }

  function checkTermValue (term, operatorDad, domain, position, variables, expressionErrors) {
    let termSort = syntaticTree.sorts.find(sort =>
      sort.id.value === domain[position].value
    )
    var termToken = term.operator || term.token
    let foundTerm = syntaticTree.operationList.find(opnsArg => {
      return opnsArg.operand.value === termToken.value && opnsArg.codomain.value === termSort.id.value
    })
    if (!foundTerm) {
      expressionErrors.push(new SemanticExpection(`Value ${termToken.value} was not accepted by operation "${operatorDad.value}", that expect a ${termSort.id.value} at position ${position + 1}.`, termToken))
      return false
    } else if (term.operator) {
      return evaluateExpression(term.operator, term.firstTerm, term.secondTerm, foundTerm.domain, termSort.type, variables, expressionErrors)
    } else if (term.arguments) {
      if (term.arguments.length !== foundTerm.domain.length) {
        errors.push(new SemanticExpection(`Operation "${term.token.value}", expect ${foundTerm.domain.length} arguments and got ${term.arguments.length}.`, term.token))
      }
      let errorInArgs = false
      term.arguments.forEach((arg, index) => {
        var argToken = arg.operator || arg.firstTerm.token
        let foundArg = syntaticTree.operationList.find(opnsArg => {
          return opnsArg.operand.value === argToken.value && opnsArg.codomain.value === foundTerm.domain[index].value
        })
        if (!foundArg) {
          errors.push(new SemanticExpection(`Argument ${argToken.value} not found with the sort "${foundTerm.domain[index].value}".`, argToken))
          errorInArgs = true
        } else {
          let argCheck = evaluateExpression(arg.operator, arg.firstTerm, arg.secondTerm, foundArg.domain, termSort.type, variables, expressionErrors)
          if (!argCheck) {
            errorInArgs = true
          }
        }
      })
      return !errorInArgs
    }
  }

  function evaluateExpression (operator, firstTerm, secondTerm, domain, typeDefinition, variables, expressionErrors) {
    let hasError = false
    if (operator) {
      var foundFirstTerm = checkTermValue(firstTerm, operator, domain, 0, variables, expressionErrors)
      if (!foundFirstTerm) hasError = true

      var foundSecondTerm = checkTermValue(secondTerm, operator, domain, 1, variables, expressionErrors)
      if (!foundSecondTerm) hasError = true
    } else {
      let argLengh = firstTerm.arguments ? firstTerm.arguments.length : 0
      let domainLengh = domain ? domain.length : 0
      if (argLengh !== domainLengh) {
        expressionErrors.push(new SemanticExpection(`Operation "${firstTerm.token.value}", expect ${domainLengh} arguments and got ${argLengh}.`, firstTerm.token))
        return false
      }
      if (argLengh > 0) {
        firstTerm.arguments.forEach((arg, index) => {
          let argSort = syntaticTree.sorts.find(sort =>
            sort.id.value === domain[index].value
          )
          var argToken = arg.operator || arg.firstTerm.token
          let foundArg = argSort.type.opns.find(opnsArg => {
            return opnsArg.operand.value === argToken.value
          })
          if (!foundArg && variables && variables.length && arg.firstTerm && !arg.firstTerm.arguments) {
            foundArg = variables.find(v => {
              return v.imagem.value === arg.firstTerm.token.value && v.dominio.value === argSort.id.value
            })
          }
          if (!foundArg) {
            expressionErrors.push(new SemanticExpection(`Value ${argToken.value} was not found with sort "${argSort.id.value}", required at ${index + 1} position of function "${firstTerm.token.value}".`, argToken))
            hasError = true
            return
          }
          /**
           * Guardando o operador computado
           */
          arg.sortData = foundArg
          var argValue = evaluateExpression(arg.operator, arg.firstTerm, arg.secondTerm, foundArg.domain, argSort.type, variables, expressionErrors)
          if (!argValue) {
            hasError = true
          }
        })
      }
    }
    return !hasError
  }

  function checkBehaviours (behaviour, processList, visibleGates, hidingGates, functionality, sorts, importedVariables) {
    let variables = importedVariables ? importedVariables.map(iv => iv) : []
    if (behaviour.operand === 'OP_EXIT' || behaviour.operand === 'OP_STOP') {
      if (behaviour.operand === 'OP_EXIT' && functionality === NOEXIT) {
        errors.push(new SemanticExpection(`'exit' event is not allowed in 'noexit' processes.`, behaviour.identifier))
      }
    } else if (behaviour.identifier) {
      var found = null
      var helper = 'Term'
      if (behaviour.operand === OP_PROCESS_INSTANTIATION) {
        helper = 'Process'
        found = processList.find(process => {
          return process.title.value === behaviour.identifier.value
        })

        behaviour.parsingGates.forEach(pGate => {
          var searchGate = visibleGates.find(gate => {
            return gate.value === pGate.value
          })

          if (!searchGate && hidingGates.length) {
            searchGate = hidingGates.find(gate => {
              return gate.value === pGate.value
            })
          }

          if (!searchGate) {
            errors.push(new SemanticExpection(`Unknown Parsing Action Gate "${pGate.value}"`, pGate))
          }
        })

        if (found) {
          if (found.visibleGateList && found.visibleGateList.length && behaviour.parsingGates.length !== found.visibleGateList.length) {
            errors.push(new SemanticExpection(`Process "${behaviour.identifier.value}", expect ${found.visibleGateList.length} Action Gates and got ${behaviour.parsingGates.length}.`, behaviour.identifier))
          }

          let parametersSize = found.parameters ? found.parameters.length : 0
          let valuesSize = behaviour.values ? behaviour.values.length : 0

          if (parametersSize !== valuesSize) {
            errors.push(new SemanticExpection(`Process "${found.title.value}", expect ${parametersSize} parameters and got ${valuesSize}.`, behaviour.identifier))
          }

          /** testar */
          behaviour.leftBehaviour = found.behaviour
          behaviour.processDeclaration = found

          if (behaviour.values && behaviour.values.length) {
            behaviour.values.forEach((value, index) => {
              if (value.sort) {
                let valueFound = sorts.find(sort => {
                  return sort.id.value === value.sort.value
                })
                if (!valueFound) {
                  errors.push(new SemanticExpection(`Sort not found "${value.sort.value}"`, value.sort))
                }
                if (valueFound && found.parameters && found.parameters[index]) {
                  if (value.sort.value !== found.parameters[index].dominio.value) {
                    errors.push(new SemanticExpection(`Process "${behaviour.identifier.value}" expects a sort "${found.parameters[index].dominio.value}" at "${index + 1}" position, and got "${value.sort.value}"`, value.sort))
                  }
                }
                if (valueFound) {
                  let valueToken = value.operator || value.firstTerm.token
                  if (!valueExists(valueToken.value, valueFound.type)) {
                    errors.push(new SemanticExpection(`The value "${valueToken.value}" don't exists in sort "${value.sort.value}"`, value.sort))
                  }
                }
              } else {
                let opnsReferences = extractSortsFromOperator(value.operator, value.firstTerm, syntaticTree.operationList)
                if (!opnsReferences || !opnsReferences.length) {
                  if (variables && variables.length && value.firstTerm && !value.firstTerm.arguments) {
                    let variable = variables.find(v => {
                      return v.imagem.value === value.firstTerm.token.value
                    })
                    if (!variable) {
                      errors.push(new SemanticExpection(`The variable "${value.firstTerm.token.value}" was not found in behaviour context`, value.firstTerm.token))
                    } else {
                      value.opnsReferences = [variable]
                    }
                  } else {
                    let parameterToken = value.operator || value.firstTerm.token
                    errors.push(new SemanticExpection(`The value "${parameterToken.value}" was not recognized in any sort`, parameterToken))
                  }
                } else {
                  let foundOpnsReferencefromProcessParameters = opnsReferences.find(o => {
                    return o.codomain.value === found.parameters[index].dominio.value
                  })
                  if (!foundOpnsReferencefromProcessParameters) {
                    let parameterToken = value.operator || value.firstTerm.token
                    errors.push(new SemanticExpection(`The value "${parameterToken.value}" was not recognized in "${found.parameters[index].dominio.value}" sort`, parameterToken))
                  } else {
                    evaluateExpression(value.operator, value.firstTerm, value.secondTerm, foundOpnsReferencefromProcessParameters.domain, foundOpnsReferencefromProcessParameters.typeDefinition, variables, errors)
                    value.opnsReferences = [foundOpnsReferencefromProcessParameters]
                  }
                }
              }
            })
          }
        }
      } else if (behaviour.operand === OP_ACTION_PREFIX) {
        helper = 'Action Gate'
        found = visibleGates.find(gate => {
          return gate.value === behaviour.identifier.value
        })

        if (!found && hidingGates.length) {
          found = hidingGates.find(gate => {
            return gate.value === behaviour.identifier.value
          })
        }

        behaviour.gate = found

        if (behaviour.parameters && behaviour.parameters.length > 0) {
          behaviour.parameters.forEach(parameter => {
            if (parameter.imagem) {
              /** testar se o id já existe nas variaveis */
              if (variables) {
                var foundInVariables = variables.find(variable => {
                  return variable.imagem.value === parameter.imagem.value
                })
                if (foundInVariables) {
                  errors.push(new SemanticExpection(`The variable "${parameter.imagem.value}" was declared before`, parameter.imagem))
                }
              }

              /** testar se o dominio existe como sort */
              var valueFound = (syntaticTree.sorts || []).find(sort => {
                return sort.id.value === parameter.dominio.value
              })
              if (!valueFound) {
                errors.push(new SemanticExpection(`Sort not found "${parameter.dominio.value}"`, parameter.dominio))
              }

              /** adicionar as variaveis */
              if (!variables) variables = []
              variables.push(parameter)
            } else {
              let opnsReferences = extractSortsFromOperator(parameter.operator, parameter.firstTerm, syntaticTree.operationList)
              /**
               * Encontro as referências de operação possível
               */
              if (!opnsReferences || !opnsReferences.length) {
                if (variables && variables.length && parameter.firstTerm && !parameter.firstTerm.arguments) {
                  let variable = variables.find(v => {
                    return v.imagem.value === parameter.firstTerm.token.value
                  })
                  if (!variable) {
                    errors.push(new SemanticExpection(`The variable "${parameter.firstTerm.token.value}" was not found in behaviour context`, parameter.firstTerm.token))
                  } else {
                    parameter.opnsReferences = [variable]
                  }
                } else {
                  var parameterToken = parameter.operator || parameter.firstTerm.token
                  errors.push(new SemanticExpection(`The value "${parameterToken.value}" was not recognized in any sort`, parameterToken))
                }
              } else {
              /**
               * Precisa criar uma função que faz o evaluate do valor para cada uma das operações encontradas, considerando o sort dessa operação
               */
                parameter.opnsReferences = []
                var expressionErrors = []
                opnsReferences.forEach(opnsReference => {
                  var expressionValue = evaluateExpression(parameter.operator, parameter.firstTerm, parameter.secondTerm, opnsReference.domain, opnsReference.typeDefinition, variables, expressionErrors)
                  if (expressionValue === true) {
                    parameter.opnsReferences.push(opnsReference)
                  }
                })
                if (parameter.opnsReferences.length === 0 && expressionErrors.length > 0) {
                  expressionErrors.forEach(err => {
                    errors.push(err)
                  })
                }
              }
            }
          })
        }
        if (behaviour.rightBehaviour) {
          checkBehaviours(behaviour.rightBehaviour, processList, visibleGates, hidingGates, functionality, sorts, variables)
        }
      } else if (behaviour.operand === OP_HIDING_EVENT) {
        if (behaviour.rightBehaviour) {
          checkBehaviours(behaviour.rightBehaviour, processList, visibleGates, hidingGates, functionality, sorts, variables)
        }
      }

      if (!found && behaviour.operand !== OP_HIDING_EVENT) {
        errors.push(new SemanticExpection(`Unknown ${helper} "${behaviour.identifier.value}"`, behaviour.identifier))
      }
    } else {
      if (behaviour.leftBehaviour) {
        checkBehaviours(behaviour.leftBehaviour, processList, visibleGates, hidingGates, functionality, sorts, importedVariables)
      }
      if (behaviour.rightBehaviour) {
        checkBehaviours(behaviour.rightBehaviour, processList, visibleGates, hidingGates, functionality, sorts, importedVariables)
      }
    }
  }

  function checkProcess (process, dadProcessList) {
    if (process.parameters && process.parameters.length) {
      process.parameters.forEach(parameter => {
        var valueFound = (syntaticTree.sorts || []).find(sort => {
          return sort.id.value === parameter.dominio.value
        })
        if (!valueFound) {
          errors.push(new SemanticExpection(`Sort not found "${parameter.dominio.value}"`, parameter.dominio))
        }
      })
    }
    let visibleProcessList = (process.processList || []).slice(0)
    if (dadProcessList && dadProcessList.length) {
      dadProcessList.forEach(dadProcess => {
        if (!visibleProcessList.find(p => {
          return p.title.value === dadProcess.title.value
        })) {
          visibleProcessList.unshift(dadProcess)
        }
      })
    }
    checkBehaviours(process.behaviour, visibleProcessList, process.visibleGateList || [], process.hidingGates || [], process.functionality, syntaticTree.sorts, process.parameters)
    if (process.processList && process.processList.length > 0) {
      process.processList.forEach(subprocess => {
        checkProcess(subprocess, visibleProcessList)
      })
    }
  }

  function checkSpecification (syntaticTree) {
    let visibleProcessList = (syntaticTree.processList || []).slice(0)
    checkBehaviours(syntaticTree.behaviour, visibleProcessList,
      syntaticTree.visibleGateList || [], syntaticTree.hidingGates || [],
      syntaticTree.functionality, syntaticTree.sorts)
    if (syntaticTree.processList && syntaticTree.processList.length > 0) {
      syntaticTree.processList.forEach(process => {
        checkProcess(process, visibleProcessList)
      })
    }
  }

  function startSemanticAnalysis () {
    if (syntaticTree.types) {
      duplicatedTypes(syntaticTree.types)
    }
    if (syntaticTree.sorts) {
      duplicatedSort(syntaticTree.sorts)
    }
    if (syntaticTree.types) {
      syntaticTree.types.forEach((type) => {
        generateSortAndOpnsList(type)
        sortsAndOperationIsCorrect(type)
        if (type.eqns && type.eqns.variables) {
          checkDuplicatedVariables(type.eqns)
        }
        if (type.eqns && type.eqns.equationGroups) {
          type.eqns.equationGroups.forEach(equationGroup => {
            checkEquationTermsExists(equationGroup, type.eqns.variables,
              type.overridedBy ? type.overridedBy.opns : type.opns)
          })
        }
      })
    }
    checkSpecification(syntaticTree)
  }

  return {
    _errors: errors,
    start: startSemanticAnalysis
  }
}

export default LotosSemantic
