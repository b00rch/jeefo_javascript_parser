/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : do_while_statement.js
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
	id         : "Do while statement",
	type       : "Statement",
	precedence : 31,

    is         : (token, parser) => parser.current_state === states_enum.statement,
	initialize : (ast_node, current_token, parser) => {
        let inner_comment = null;
        const pre_comment = get_pre_comment(parser);

        // Statement
        parser.prepare_next_state(null, true);
        const statement = parser.get_next_ast_node(precedence_enum.TERMINATION);

        // while keyword
        parser.prepare_next_state(null, true);
        parser.expect("while", parser => parser.next_token.value === "while");
        inner_comment = parser.current_ast_node;

        // Surrounded expression
        parser.prepare_next_state(null, true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const surrounded_expression = get_surrounded_expression(parser);

        // ASI
        parser.prepare_next_state();
        const asi = parser.next_token === null || parser.next_token.value !== ';';

        ast_node.pre_comment   = pre_comment;
        ast_node.statement     = statement;
        ast_node.inner_comment = inner_comment;
        ast_node.do_token      = current_token;
        ast_node.expression    = surrounded_expression;
        ast_node.post_comment  = asi ? null : parser.current_ast_node;
        ast_node.ASI           = asi;
        ast_node.start         = get_start_position(pre_comment, current_token);
        ast_node.end           = asi ? surrounded_expression.end : parser.next_token.end;

        parser.terminate(ast_node);
    }
};
