
'use strict';

define('DS/jsBeautify/javascript/tokenEnum', ['DS/jsBeautify/core/tokenEnum'], function (BASETOKEN) {
  var TOKEN = {
    START_EXPR: 'TK_START_EXPR',
    END_EXPR: 'TK_END_EXPR',
    START_BLOCK: 'TK_START_BLOCK',
    END_BLOCK: 'TK_END_BLOCK',
    WORD: 'TK_WORD',
    RESERVED: 'TK_RESERVED',
    SEMICOLON: 'TK_SEMICOLON',
    STRING: 'TK_STRING',
    EQUALS: 'TK_EQUALS',
    OPERATOR: 'TK_OPERATOR',
    COMMA: 'TK_COMMA',
    BLOCK_COMMENT: 'TK_BLOCK_COMMENT',
    COMMENT: 'TK_COMMENT',
    DOT: 'TK_DOT',
    UNKNOWN: 'TK_UNKNOWN',
    START: BASETOKEN.START,
    RAW: BASETOKEN.RAW,
    EOF: BASETOKEN.EOF
  };
  return TOKEN;
});
