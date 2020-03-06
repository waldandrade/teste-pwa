'use strict'

class Behaviour {
  // Declaração do processo
  _processDeclaration

  // Array of gates
  _parsingGates

  // Operator
  _operand
  _variacao

  // TypeBehaviour
  _leftBehaviour

  // TypeBehaviour
  _rightBehaviour

  _identifier

  _values

  _guard

  _gate

  set gate (gt) {
    this._gate = gt
  }

  get gate () {
    return this._gate
  }

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

  set variacao (variacao) {
    this._variacao = variacao
  }

  get variacao () {
    return this._variacao
  }

  set parsingGates (parsingGates) {
    this._parsingGates = parsingGates
  }

  get parsingGates () {
    return this._parsingGates
  }

  set operand (operand) {
    this._operand = operand
  }

  get operand () {
    return this._operand
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
