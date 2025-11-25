'use strict';

define('DS/jsBeautify/html/tokenEnum', ['DS/jsBeautify/core/tokenEnum'], function (BASETOKEN) {
  var TOKEN = {
    TAG_OPEN: 'TK_TAG_OPEN',
    TAG_CLOSE: 'TK_TAG_CLOSE',
    ATTRIBUTE: 'TK_ATTRIBUTE',
    EQUALS: 'TK_EQUALS',
    VALUE: 'TK_VALUE',
    COMMENT: 'TK_COMMENT',
    TEXT: 'TK_TEXT',
    UNKNOWN: 'TK_UNKNOWN',
    START: BASETOKEN.START,
    RAW: BASETOKEN.RAW,
    EOF: BASETOKEN.EOF
  };
  return TOKEN;
});
