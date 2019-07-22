/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_operators.js
* Created at  : 2019-01-28
* Updated at  : 2019-03-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const capitalize                    = require("jeefo_utils/string/capitalize"),
      states_enum                   = require("../enums/states_enum"),
      is_expression                 = require("../helpers/is_expression"),
      get_pre_comment               = require("../helpers/get_pre_comment"),
      get_start_position            = require("../helpers/get_start_position"),
      get_last_non_comment_ast_node = require("../helpers/get_last_non_comment_ast_node");

module.exports = function register_unary_operators (es5_ast_nodes) {
    const is_expression_state = (token, parser) => {
        return is_expression(parser) && get_last_non_comment_ast_node(parser) === null;
    };

    const skeleton_expression_definition = {
        type : "Unary operator",
        is   : is_expression_state,
    };

    // {{{1 New expression (18, 19)
    es5_ast_nodes.register_reserved_word("new", {
		id         : "New expression",
        type       : "Unary operator",
        precedence : 18,

        is         : is_expression_state,
        initialize : (ast_node, current_token, parser) => {
            const pre_comment = get_pre_comment(parser);

            let state_name = "expression";
            if (parser.current_state === states_enum.expression_no_in) {
                state_name = "expression_no_in";
            }
            parser.prepare_next_state(state_name, true);
            const expression = parser.get_next_ast_node(ast_node.precedence);
            if (expression.id === "Function call expression") {
                ast_node.precedence = 19;
            }

            ast_node.token       = current_token;
            ast_node.expression  = expression;
            ast_node.pre_comment = pre_comment;
            ast_node.start       = get_start_position(pre_comment, current_token);
            ast_node.end         = expression.end;
        }
    });

    // {{{1 void, typeof, delete expression (16)
    // precedence
    skeleton_expression_definition.precedence = 16;

    // initialize
    skeleton_expression_definition.initialize = (ast_node, current_token, parser) => {
        let state_name = "expression";
        if (parser.current_state === states_enum.expression_no_in) {
            state_name = "expression_no_in";
        }
        parser.prepare_next_state("expression", true);

        ast_node.token    = current_token;
        ast_node.argument = parser.get_next_ast_node(ast_node.precedence);
        ast_node.start    = current_token.start;
        ast_node.end      = ast_node.argument.end;
    };

    ["void", "typeof", "delete"].forEach(keyword => {
        skeleton_expression_definition.id = `${ capitalize(keyword) } operator`;
        es5_ast_nodes.register_reserved_word(keyword, skeleton_expression_definition);
    });

    // {{{1 unary prefix operators (16)
    const unary_prefix_operators = [
        {
            id : "Logical not",
            is : (token, parser) => {
                if (is_expression_state(null, parser)) {
                    return token.value === "!";
                }
                return false;
            }
        },
        {
            id : "Bitwise not",
            is : (token, parser) => {
                if (is_expression_state(null, parser)) {
                    return token.value === "~";
                }
                return false;
            }
        },
        {
            id : "Prefix increment",
            is : (token, parser) => {
                if (token.value === "++") {
                    return is_expression_state(null, parser);
                }
                return false;
            }
        },
        {
            id : "Prefix decrement",
            is : (token, parser) => {
                if (is_expression_state(null, parser)) {
                    return token.value === "--";
                }
                return false;
            }
        },
        {
            id : "Positive plus",
            is : (token, parser) => {
                if (is_expression_state(null, parser)) {
                    return token.value === "+";
                }
                return false;
            }
        },
        {
            id : "Negation minus",
            is : (token, parser) => {
                if (is_expression_state(null, parser)) {
                    return token.value === "-";
                }
                return false;
            }
        },
    ];

    unary_prefix_operators.forEach(operator => {
        skeleton_expression_definition.id = `${ operator.id } operator`;
        skeleton_expression_definition.is = operator.is;
        es5_ast_nodes.register_ast_node_definition(skeleton_expression_definition);
    });

    // {{{1 Post increment, Post decrement (17)
    const postfix_operators = [
        {
            id : "increment",
            is : (token, parser) => {
                // No line termination
                if (token.value === "++" && is_expression(parser)) {
                    const last_ast_node = get_last_non_comment_ast_node(parser);
                    return last_ast_node !== null && last_ast_node.end.line === token.start.line;
                }
                return false;
            }
        },
        {
            id : "decrement",
            is : (token, parser) => {
                if (token.value === "--" && is_expression(parser)) {
                    const last_ast_node = get_last_non_comment_ast_node(parser);
                    return last_ast_node !== null && last_ast_node.end.line === token.start.line;
                }
                return false;
            }
        }
    ];

    skeleton_expression_definition.precedence = 17;
    skeleton_expression_definition.initialize = (ast_node, current_token, parser) => {
        ast_node.token    = current_token;
        ast_node.argument = parser.current_ast_node;
        ast_node.start    = ast_node.argument.start;
        ast_node.end      = current_token.end;
    };

    postfix_operators.forEach(operator => {
        skeleton_expression_definition.id = `Postfix ${ operator.id } operator`;
        skeleton_expression_definition.is = operator.is;
        es5_ast_nodes.register_ast_node_definition(skeleton_expression_definition);
    });
    // }}}1
};
