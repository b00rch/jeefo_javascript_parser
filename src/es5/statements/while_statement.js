/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : while_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-23
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum               = require("../enums/states_enum"),
      precedence_enum           = require("../enums/precedence_enum"),
      get_pre_comment           = require("../helpers/get_pre_comment"),
      get_start_position        = require("../helpers/get_start_position"),
      get_surrounded_expression = require("../helpers/get_surrounded_expression");

module.exports = {
	id         : "While statement",
	type       : "Statement",
	precedence : 31,

    is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : (ast_node, current_token, parser) => {
        const pre_comment = get_pre_comment(parser);

        // Surrounded expression
        parser.prepare_next_state(null, true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const surrounded_expression = get_surrounded_expression(parser);

        // Statement
        parser.prepare_next_state(null, true);
        const statement = parser.get_next_ast_node(precedence_enum.TERMINATION);

        ast_node.expression  = surrounded_expression;
        ast_node.statement   = statement;
        ast_node.pre_comment = pre_comment;
        ast_node.start       = get_start_position(pre_comment, current_token);
        ast_node.end         = statement.end;
    }
};
