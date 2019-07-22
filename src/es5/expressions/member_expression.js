/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-19
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const operator_definition     = require("../common/operator_definition"),
      is_expression           = require("../helpers/is_expression"),
      prepare_next_expression = require("../helpers/prepare_next_expression");

module.exports = {
    id         : "Member expression",
	type       : "Expression",
	precedence : 19,

    is : (current_token, parser) =>
        is_expression(parser) && current_token.value === '.',

	initialize : (ast_node, current_token, parser) => {
        const object   = parser.current_ast_node;
        const operator = operator_definition.generate_new_ast_node(parser);

        prepare_next_expression(parser, true);
        parser.expect("identifier", parser => parser.next_ast_node_definition.id === "Identifier");
        const property = parser.get_next_ast_node(ast_node.precedence);

        ast_node.object   = object;
        ast_node.operator = operator;
        ast_node.property = property;
        ast_node.start    = object.start;
        ast_node.end      = property.end;
    },
};
