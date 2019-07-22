/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_variable_declarator.js
* Created at  : 2019-03-15
* Updated at  : 2019-03-29
* Author      : jeefo
* Purpose     : Hiding long named variables and make it simple short named
*             : function for easier to use.
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const ASTNodeDefinition        = require("@jeefo/parser/src/ast_node_definition"),
      precedence_enum         = require("../enums/precedence_enum"),
      operator_definition     = require("../common/operator_definition"),
      get_right_value         = require("./get_right_value"),
      get_start_position      = require("./get_start_position"),
      prepare_next_expression = require("./prepare_next_expression");

// {{{1 variable_declarator_ast_node_definition
const variable_declarator_ast_node_definition = new ASTNodeDefinition({
    id         : "Variable declarator",
    type       : "Declarator",
    precedence : 31,

    is         : () => {},
    initialize : (ast_node, current_token, parser) => {
        const identifier = parser.current_ast_node;

        let init         = null,
            operator     = null,
            post_comment = null;

        if (parser.next_token === identifier.token) {
            parser.prepare_next_ast_node_definition();
        }

        if (parser.next_token !== null) {
            switch (parser.next_token.value) {
                case '=' :
                    if (parser.current_ast_node !== null && parser.current_ast_node.id === "Identifier") {
                        parser.current_ast_node = null;
                    }
                    operator = operator_definition.generate_new_ast_node(parser);

                    prepare_next_expression(parser, true);

                    parser.post_comment = null;
                    init = get_right_value(parser, precedence_enum.COMMA);
                    if (parser.next_token !== null) {
                        post_comment = parser.post_comment;
                    }
                    break;
                case ',' :
                case ';' :
                    if (parser.current_ast_node.id === "Comment") {
                        post_comment = parser.current_ast_node;
                    }
                    break;
                default:
                    parser.throw_unexpected_token();
            }
        }

        ast_node.identifier   = identifier;
        ast_node.initializer  = init;
        ast_node.operator     = operator;
        ast_node.post_comment = post_comment;
        ast_node.start        = get_start_position(identifier.comment, identifier);
        ast_node.end          = post_comment ? post_comment.end : init ? init.end : identifier.end;
    }
});
// }}}1

function get_variable_declarator (parser) {
    if (parser.current_ast_node === null || parser.current_ast_node.id === "Comment") {
        parser.expect("identifier", parser => parser.next_ast_node_definition.id === "Identifier");
        parser.current_ast_node = parser.next_ast_node_definition.generate_new_ast_node(parser);
    }

    return variable_declarator_ast_node_definition.generate_new_ast_node(parser);
}

module.exports = get_variable_declarator;
