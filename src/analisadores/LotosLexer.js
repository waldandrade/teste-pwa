'use strict'

/**
 * Author: Waldney Souza de Andrade
 * Utilizando lexical-parser
 * https://github.com/Eitz/lexical-parser#readme
 */

import Tokenizer from 'tokenizer'

let t = new Tokenizer()
t.addRule(/^(accept|actualizedby|any|behaviour|choice|endlib|endproc|endspec|endtype|eqns|exit|for|forall|formaleqns|formalopns|formalsorts|hide|i|in|is|let|library|noexit|of|ofsort|opnnames|opns|par|process|renamedby|sortnames|sorts|specification|stop|type|using|where|with)$/, 'reserved_word')
t.addRule(/[\n\r\s \t]+/, 'space')
t.addRule(/^(\*|>>|\|\|\||\]\||\|\[|\[\]|\[>|\(|\)|\{|\}|,|\.|;|\?|!|=>|->|:=|:|\[|\]|\|)$/, 'reserved_lexical_token')
t.addRule(/^\(\*.*?\*\)$/m, 'comment')
t.on('token', (token, type) => {
  console.log('token', token)
})

function LotosLexer (source) {
  // console.log(source)
  t.write(source)
}

LotosLexer.prototype = {
  _lines: []
}

export default LotosLexer
