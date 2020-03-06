'use strict'

class Channel {
  constructor (type, dispatchEvent /* Function */, syncEnv, gates, process) {
    this._syncEnv = syncEnv
    this._type = type
    this._gates = gates
    this._process = process
    this._event = null
    this._dispatchEvent = dispatchEvent
  }
  // DeclaraÃ§Ã£o do processo
  _type
  _event
  _gates
  _syncEnv

  newEvent (gate) {
    this._dispatchEvent(gate)
  }

  get syncEnv () {
    return this._syncEnv
  }

  get process () {
    return this._process
  }

  get gates () {
    return this._gates
  }

  get type () {
    return this._type
  }

  set event (gate) {
    this._event = gate
  }

  get event () {
    return this._event
  }
}

export default Channel
