/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : try_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-23
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum        = require("../enums/states_enum"),
      precedence_enum    = require("../enums/precedence_enum"),
      get_pre_comment    = require("../helpers/get_pre_comment"),
      get_start_position = require("../helpers/get_start_position");

module.exports = function register_try_statement (es5_ast_nodes) {
    // {{{1 Catch parameter
    es5_ast_nodes.register_ast_node_definition({
        id         : "Catch parameter",
        type       : "Primitive",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.catch_parameter,
        initialize : (ast_node, current_token, parser) => {
            parser.change_state("delimiter");
            const open_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

            parser.prepare_next_state("expression", true);
            if (parser.next_token.value === ')') {
                parser.throw_unexpected_token("Missing identifier");
            }

            parser.expect("identifier", parser => parser.next_ast_node_definition.id === "Identifier");
			const identifier = parser.next_ast_node_definition.generate_new_ast_node(parser);

            parser.prepare_next_state("delimiter", true);
            parser.expect(')', parser => parser.next_token.value === ')');
            const close_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

            ast_node.open_parenthesis  = open_parenthesis;
            ast_node.identifier        = identifier;
            ast_node.close_parenthesis = close_parenthesis;
            ast_node.start             = get_start_position(open_parenthesis.pre_comment, current_token);
            ast_node.end               = close_parenthesis.end;
        }
    });

    // {{{1 Catch block
    es5_ast_nodes.register_reserved_word("catch", {
        id         : "Catch block",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.try_statement,
        initialize : (ast_node, current_token, parser) => {
            const pre_comment = get_pre_comment(parser);

            // Parameter
            parser.prepare_next_state("catch_parameter", true);
            parser.expect('(', parser => parser.next_token.value === '(');
            const parameter = parser.get_next_ast_node(precedence_enum.TERMINATION);

            // Block statement
            parser.prepare_next_state("block_statement", true);
            parser.expect('{', parser => parser.next_token.value === '{');
			const block = parser.next_ast_node_definition.generate_new_ast_node(parser);

            ast_node.parameter   = parameter;
            ast_node.block       = block;
            ast_node.pre_comment = pre_comment;
            ast_node.start       = get_start_position(pre_comment, current_token);
            ast_node.end         = block.end;
        }
    });

    // {{{1 Finally block
    es5_ast_nodes.register_reserved_word("finally", {
        id         : "Finally block",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.try_statement,
        initialize : (ast_node, current_token, parser) => {
            let pre_comment = get_pre_comment(parser), block;

            parser.prepare_next_state("block_statement", true);
            parser.expect('{', parser => parser.next_token.value === '{');
            block = parser.get_next_ast_node(precedence_enum.TERMINATION);

            ast_node.block       = block;
            ast_node.pre_comment = pre_comment;
            ast_node.start       = get_start_position(pre_comment, current_token);
            ast_node.end         = block.end;
        }
    });
    // }}}1

    es5_ast_nodes.register_reserved_word("try", {
        id         : "Try statement",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.statement,
        initialize : (ast_node, current_token, parser) => {
            const pre_comment = get_pre_comment(parser);
            let handler = null, finalizer = null, block;

            parser.prepare_next_state("block_statement", true);
            parser.expect('{', parser => parser.next_token.value === '{');
            block = parser.get_next_ast_node(precedence_enum.TERMINATION);

            parser.prepare_next_state("try_statement", true);
            if (parser.next_ast_node_definition !== null && parser.next_ast_node_definition.id === "Catch block") {
                handler = parser.get_next_ast_node(precedence_enum.TERMINATION);
                parser.prepare_next_state("try_statement");
            }

            if (parser.next_ast_node_definition !== null && parser.next_ast_node_definition.id === "Finally block") {
                finalizer = parser.get_next_ast_node(precedence_enum.TERMINATION);
            }

            parser.expect("catch or finally after try", () => handler !== null || finalizer !== null);

            ast_node.block       = block;
            ast_node.handler     = handler;
            ast_node.finalizer   = finalizer;
            ast_node.pre_comment = pre_comment;
            ast_node.start       = get_start_position(pre_comment, current_token);
            ast_node.end         = finalizer ? finalizer.end : handler.end;

            if (! parser.is_terminated) {
                parser.terminate(ast_node);
            }
        }
    });
};
