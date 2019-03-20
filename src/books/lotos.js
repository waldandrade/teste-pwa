
function LotosBook () {
  // Definir o ícone que deve ser exibido em arquivos do tipo LOTOS
  this.lotosIcon = ''

  // Definir o ícone que deve ser exibido em arquivos do tipo LIb
  this.libIcon = ''

  this.GLOBAL_PROC_TITLE = '###GLOBAL#PROC#TITLE###'
  this.SPEC_TITLE = 'SPEC_TITLE' // T�tulo da especifica��o
  this.SPEC_GATE_DEF = 'SPEC_GATE_DEF' // gate definido da especifica��o
  this.PROC_GATE_DEF = 'PROC_GATE_DEF' // gate definido no processo
  this.PROC_INST_NAME = 'PROC_INST_NAME' // gate
  this.VARID = 'VARID'
  this.VARIDDECL = 'VARIDDECL'
  this.SORTTD = 'SORTID'
  this.GATEID = 'GATEID'
  this.PROCID = 'PROCID'
  this.PARTIAL_SYNCHRONIZATION = 'PARTIAL_SYNCHRONIZATION'
  this.HIDING = 'HIDING'
  this.GUARD = 'GUARD'

  this.INTERNAL_EVENT = 'INTERNAL_EVENT'

  // --------------------

  this.RENDEZVOUS = 'RENDEZVOUS_SYMBOL'
  this.KEYWORK = 'KEY_WORD'
  this.ID = 'IDENTIFIER'
  this.COMMENTS = 'COMMENT'
  this.OPERATOR = 'OPERATOR'

  this.SPECIFICATION = 'specification'
  this.PROCESS = 'process'
  this.ENDSPEC = 'endspec'
  this.ENDPROC = 'endproc'
  this.WHERE = 'where'
  this.BEHAVIOR = 'behavior'

  this.EXIT = 'exit'
  this.NOEXIT = 'noexit'
  this.STOP = 'stop'

  this.SEQUENCE_COMPOSITION = ';'
  this.BLOCK_OPEN = '('
  this.BLOCK_CLOSE = ')'
  this.BRACKET_OPEN = '['
  this.BRACKET_CLOSE = ']'
  this.OPTIONAL = '[]'

  // bloco de coment�rio
  this.COMMENT_OPEN = '(*'
  this.COMMENT_CLOSE = '*)'

  // estrutura l�xica do E-LOTOS

  this.LETTER = 'a' + '|' + 'b' + '|' + 'c' + '|' + 'd' + '|' + 'e' + '|' + 'f' + '|' + 'g' + '|' +
  'h' + '|' + 'i' + '|' + 'j' + '|' + 'k' + '|' + 'l' + '|' + 'm' + '|' + 'n' + '|' + 'o' + '|' + 'p' + '|' + 'q' + '|' + 'r' +
  '|' + 's' + '|' + 't' + '|' + 'u' + '|' + 'v' + '|' + 'w' + '|' + 'x' + '|' + 'y' + '|' + 'z'

  this.DIGIT = '0' + '|' + '1' + '|' + '2' + '|' + '3' + '|' + '4' + '|' + '5' + '|' + '6' + '|' + '7' + '|' + '8' + '|' + '9'

  this.NORMAL_CHARACTER = this.LETTER + '|' + this.DIGIT

  // SP space - substitui um coment�rio
  // HT horizontal tab
  // VT vertical tab
  // FF Form Feed
  // NL new line
  // LF line feed
  // CR Carriage Return

  // N�o sei se vai dar certo
  // N�o trata o NL -> Next Line .. isso no caso � quando a nova linha gera o come�o de um novo par�grafo

  this.COMMENT = '(\\(\\*(?:.|[\\n\\r])*?\\*\\))|(\\(\\*(?:.|[\\n\\r])*)'

  // ---------------------------------------------------------------
  this.SEPARATOR = '(' + this.COMMENT + ')' + '|' + this.BLANK_CHARACTER

  this.IDENTIFIER = '[' + this.LETTER + '](_?[' + this.NORMAL_CHARACTER + '])*'

  this.RV_SYMBOL = '\\?' + '|' + '\\!'

  this.RESERVED_WORD = 'accept' + '|' + 'actualizedby' + '|' + 'any' + '|' + 'behaviour' + '|' + 'choice' + '|' + 'endlib' + '|' + 'endproc' + '|' + 'endspec' + '|' +
  'endtype' + '|' + 'eqns' + '|' + 'exit' + '|' + 'for' + '|' + 'forall' + '|' + 'formaleqns' + '|' + 'formalopns' + '|' + 'formalsorts' + '|' + 'hide' + '|' + 'i' + '|' + 'in' + '|' +
  'is' + '|' + 'let' + '|' + 'library' + '|' + 'noexit' + '|' + 'of' + '|' + 'ofsort' + '|' + 'opnnames' + '|' + 'opns' + '|' + 'par' + '|' + 'process' + '|' + 'renamedby' + '|' + 'sortnames' + '|' + 'sorts' + '|' +
  'specification' + '|' + 'stop' + '|' + 'type' + '|' + 'using' + '|' + 'where' + '|' + 'with' + '|' + '\\='

  this.RESERVED_LEXICAL_TOKENS = '\\>\\>' + '|' + '\\|\\|\\|' + '|' + '\\]\\|' + '|' + '\\|\\[' + '|' + '\\[\\]' + '|' + '\\[\\>' + '|' + '\\(' + '|' + '\\)' + '|' + '\\{' + '|' + '\\}' + '|' + '\\,' + '|' + '\\.' + '|' + '\\;' +
  '|' + '\\?' + '|' + '\\!' + '|' + '\\=\\>' + '|' + '\\-\\>' + '|' + '\\:\\=' + '|' + '\\:' + '|' + '\\[' + '|' + '\\]' + '|' + '\\|'

  this.SPECIAL_CHARACTER = '\\#' + '|' + '\\%' + '|' + '\\&' + '|' + '\\*' + '|' + '\\+' + '|' + '\\-' + '|' + '\\.' + '|' + '\\/' + '|' + '\\<' +
  '|' + '\\>' + '|' + '\\@' + '|' + '\\\\' + '|' + '\\^' + '|' + '\\~' + '|' + '\\{' + '|' + '\\}' + '|' + '\\='

  this.EQUATION_OPNS = '([' + this.NORMAL_CHARACTER + ']' + '|' + '[' + this.SPECIAL_CHARACTER + '])+'

  // L = Left, operando vir� � esquerda     R = Right, operando vir� � direita  LR - Operando vir� em ambos os lados
  this.L_EQUATION_OPNS = '_' + this.EQUATION_OPNS
  this.R_EQUATION_OPNS = this.EQUATION_OPNS + '_'
  this.LR_EQUATION_OPNS = '_' + this.EQUATION_OPNS + '_'
  this.UNDERLINE = '_'

  this.OPNS = this.LR_EQUATION_OPNS + '|' + this.L_EQUATION_OPNS + '|' + this.R_EQUATION_OPNS + '|' + this.EQUATION_OPNS + '|' + this.UNDERLINE

  // tipos para os tokens
  this.L_UNDERLINE = 'L_UNDERLINE'
  this.R_UNDERLINE = 'R_UNDERLINE'
  this.OPERATOR_KEY = 'OPERATOR_KEY'

  this.OPERAND_UNDERLINE = 'OPERAND_UNDERLINE'

  this.OPERAND = 'OPERAND'
  this.L_OPERAND = 'LEFT_OPERAND'
  this.R_OPERAND = 'RIGHT_OPERAND'
  this.LR_OPERAND = 'BOTH_SIDE_OPERANDS'
}

// Depois deverei implementar para, antes de qualquer coisa, colocar todos os coment�rios em uma lista de coment�rios
// ... e no c�digo devo substituir todo o coment�rio por (*#*)
