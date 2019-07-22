/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2019-03-27
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum        = require("../enums/states_enum"),
      get_pre_comment    = require("../helpers/get_pre_comment"),
      get_start_position = require("../helpers/get_start_position");

module.exports = function register_primitives (es5_ast_nodes) {
    const skeleton_ast_node_definition = {
        type       : "Primitive",
        precedence : 31,
        initialize : (ast_node, current_token, parser) => {
            ast_node.pre_comment = get_pre_comment(parser);
            ast_node.token       = current_token;
            ast_node.start       = get_start_position(ast_node.pre_comment, current_token);
            ast_node.end         = current_token.end;
        }
    };

    const is_primitive_factory = condition => {
        return (current_token, parser) => {
            switch (parser.current_state) {
                case states_enum.expression :
                case states_enum.expression_no_in :
                    return condition(current_token, parser);
            }
            return false;
        };
    };

    const make_primitive_definition = (() => {
        const is_primitive_keywords = is_primitive_factory(() => true);
        return id => {
            skeleton_ast_node_definition.id = id;
            skeleton_ast_node_definition.is = is_primitive_keywords;
            return skeleton_ast_node_definition;
        };
    })();

    // Comment
    es5_ast_nodes.register_ast_node_definition({
        id         : "Comment",
        type       : "Primitive",
        precedence : 32,

        is         : token => token.id === "Comment",
        initialize : (ast_node, current_token, parser) => {
            let previous_comment = null;

            if (parser.current_ast_node && parser.current_ast_node.id === "Comment") {
                previous_comment = parser.current_ast_node;
            }

            ast_node.value            = current_token.comment;
            ast_node.is_inline        = current_token.is_inline;
            ast_node.previous_comment = previous_comment;
            ast_node.start            = current_token.start;
            ast_node.end              = current_token.end;
        }
    });

    // Primitive key words
    es5_ast_nodes.register_reserved_word("null"            , make_primitive_definition("Null literal"));
    es5_ast_nodes.register_reserved_word("undefined"       , make_primitive_definition("Undefined literal"));
    es5_ast_nodes.register_reserved_words(["true", "false"], make_primitive_definition("Boolean literal"));

    // Identifier
    skeleton_ast_node_definition.id = "Identifier";
    skeleton_ast_node_definition.is = is_primitive_factory((token, parser) => {
        return token.id                                     === "Identifier" &&
               parser.ast_nodes.reserved_words[token.value] === undefined;
    });
    es5_ast_nodes.register_ast_node_definition(skeleton_ast_node_definition);

    // Number literal
    skeleton_ast_node_definition.id = "Numeric literal";
    skeleton_ast_node_definition.is = is_primitive_factory(token => token.id === "Number");
    es5_ast_nodes.register_ast_node_definition(skeleton_ast_node_definition);

    // String literal
    skeleton_ast_node_definition.id = "String literal";
    skeleton_ast_node_definition.is = is_primitive_factory(token => token.id === "String");
    es5_ast_nodes.register_ast_node_definition(skeleton_ast_node_definition);

    // literals
    es5_ast_nodes.register_ast_node_definition(require("./array_literal"));
    es5_ast_nodes.register_ast_node_definition(require("./object_literal"));
    es5_ast_nodes.register_ast_node_definition(require("./regular_expression_literal"));
};
