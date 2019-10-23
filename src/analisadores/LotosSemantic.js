'use strict'

const BINARY_OPERATION = 'BINARY_OPERATION'

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

  function extendedSorts (extendedTypes, sorts, opns) {
    extendedTypes.forEach(element => {
      var found = syntaticTree.types.find(otherTypes => {
        return otherTypes.title.value === element.value
      })
      if (found) {
        if (found.sorts) {
          sorts.push(found.sorts)
        }
        if (opns) {
          if (found.opns && found.opns.length) {
            found.opns.forEach(foundOpns => opns.push(foundOpns))
          }
        }
        if (found.extendedTypes && found.extendedTypes.length) {
          extendedSorts(found.extendedTypes, sorts, opns)
        }
      }
    })
  }

  function generateSortAndOpnsList (type) {
    type.sortList = []
    if (type.sorts) {
      type.sortList.push(type.sorts)
    }
    if (type.extendedTypes && type.extendedTypes.length) {
      extendedSorts(type.extendedTypes, type.sortList, type.opns)
    }
  }

  /*
   * Verifica os tipos de dados utilizados nos operadores e equações
   * - Verificar os Sorts das variáveis declaradas, e se está funcionando bem quando tem mais de um tipo de variável
   */
  function sortsNotExists (type) {
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
                // console.log(operation)
                errors.push(new SemanticExpection(`Operator results in a sort "${operation.codomain.value}" and must result in "${equationGroup.ofsort.value}"`, equation.domain.operator))
              }
            }
          } else {
            operation = type.opns.find(op => {
              return op.operand.value === equation.domain.firstTerm.value
            })
            if (!operation) {
              errors.push(new SemanticExpection(`Operation not found "${equation.domain.firstTerm.value}"`, equation.domain.firstTerm))
            }
            if (operation) {
              if (operation.codomain.value !== equationGroup.ofsort.value) {
                // console.log(operation)
                errors.push(new SemanticExpection(`Operator results in a sort "${operation.codomain.value}" and must result in "${equationGroup.ofsort.value}"`, equation.domain.firstTerm))
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

  function termInOpns (term, opns) {
    return opns.find(oper => {
      return oper.operand.value === term.value
    })
  }

  function equationTermExists (term, opFirstTerm, opSecondTerm, args, variables, opns) {
    let variable = termInVariables(term, variables)
    let operation = termInOpns(term, opns)
    if (!variable && !operation) {
      // console.log('variables', variables)
      errors.push(new SemanticExpection(`Unknown term "${term.value}"`, term))
    }
    if (operation && args && args.length) {
      if (operation.domain.length !== args.length) {
        errors.push(new SemanticExpection(`Operation "${term.value}", expect ${operation.domain.length} arguments and got ${args.length}.`, term))
      }
      args.forEach(arg => {
        equationTermExists(arg.firstTerm, null, null, null, variables, opns)
      })
    }
    if (operation && opFirstTerm) {
      equationTermExists(opFirstTerm, null, null, null, variables, opns)
    }
    if (operation && opSecondTerm) {
      equationTermExists(opSecondTerm, null, null, null, variables, opns)
    }
  }

  function checkEquationTermsExists (equationGroup, variables, opns) {
    equationGroup.equationExpressions.forEach(equation => {
      if (equation.domain.operator) {
        equationTermExists(equation.domain.operator, equation.domain.firstTerm, equation.domain.secondTerm, null, variables, opns)
      } else {
        equationTermExists(equation.domain.firstTerm, null, null, equation.domain.firstTermArguments, variables, opns)
      }
      if (equation.image.operator) {
        /**
         * Verificar quando a expressão é um parenteses e pegar o conteudo interno.
         * Pensar na possibilidade de gerar um código intermediário a ser executado para a simulação
         * Verificar o que vem nos termos quando se trata de um expressâo como termo de uma expressão
         */
        if (equation.image.operator.value === 'or') {
          console.log('or')
        }
        equationTermExists(equation.image.operator, equation.image.firstTerm, equation.image.secondTerm, null, variables, opns)
      } else {
        equationTermExists(equation.image.firstTerm, null, null, equation.image.firstTermArguments, variables, opns)
      }
    })
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
        sortsNotExists(type)
        if (type.eqns && type.eqns.variables) {
          checkDuplicatedVariables(type.eqns)
        }
        if (type.eqns && type.eqns.equationGroups) {
          type.eqns.equationGroups.forEach(equationGroup => {
            checkEquationTermsExists(equationGroup, type.eqns.variables, type.opns)
          })
        }
      })
    }
  }

  return {
    _errors: errors,
    start: startSemanticAnalysis
  }
}

export default LotosSemantic
