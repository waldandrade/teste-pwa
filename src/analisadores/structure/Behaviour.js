'use strict'

class Behaviour {
  // Declaração do processo
  _processDeclaration

  // Array of gates
  _parsingGates

  // Operator
  _operator

  // TypeBehaviour
  _leftBehaviour

  // TypeBehaviour
  _rightBehaviour

  _identifier

  _values

  _guard

  set processDeclaration (pDeclaration) {
    this._processDeclaration = pDeclaration
  }

  get processDeclaration () {
    return this._processDeclaration
  }

  set guard (guard) {
    this._guard = guard
  }

  get guard () {
    return this._guard
  }

  set values (values) {
    this._values = values
  }

  get values () {
    return this._values
  }

  set identifier (identifier) {
    this._identifier = identifier
  }

  get identifier () {
    return this._identifier
  }

  set parsingGates (parsingGates) {
    this._parsingGates = parsingGates
  }

  get parsingGates () {
    return this._parsingGates
  }

  set operator (operator) {
    this._operator = operator
  }

  get operator () {
    return this._operator
  }

  set leftBehaviour (expression) {
    this._leftBehaviour = expression
  }

  get leftBehaviour () {
    return this._leftBehaviour
  }

  set rightBehaviour (expression) {
    this._rightBehaviour = expression
  }

  get rightBehaviour () {
    return this._rightBehaviour
  }
}

export default Behaviour
