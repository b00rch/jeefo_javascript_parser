/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal.js
* Created at  : 2019-03-23
* Updated at  : 2019-03-30
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.1.5
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const ASTNodeDefinition      = require("@jeefo/parser/src/ast_node_definition"),
      precedence_enum        = require("../enums/precedence_enum"),
      keyword_definition     = require("../common/keyword_definition"),
      is_expression          = require("../helpers/is_expression"),
      is_property_name       = require("../helpers/is_property_name"),
      get_current_state_name = require("../helpers/get_current_state_name");

// {{{1 Property name
const property_name_definition = new ASTNodeDefinition({
    id         : "Property name",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : keyword_definition.initialize
});

// {{{1 get_property(parser)
function get_property (parser) {
    parser.expect("PropertyName", is_property_name);
    return property_name_definition.generate_new_ast_node(parser);
}

// {{{1 Getter
const getter_definition = new ASTNodeDefinition({
    id         : "Getter",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (ast_node, current_token, parser) => {
        const keyword = keyword_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("expression", true);
        const property = get_property(parser);

        parser.prepare_next_state("delimiter", true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const open_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("delimiter", true);
        parser.expect(')', parser => parser.next_token.value === ')');
        const close_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("block_statement", true);
        parser.expect('{', parser => parser.next_token.value === '{');
        const body = parser.get_next_ast_node(precedence_enum.TERMINATION);

        ast_node.keyword           = keyword;
        ast_node.property          = property;
        ast_node.open_parenthesis  = open_parenthesis;
        ast_node.close_parenthesis = close_parenthesis;
        ast_node.body              = body;
        ast_node.start             = keyword.start;
        ast_node.end               = body.end;

        parser.prepare_next_state("expression", true);
    }
});

// {{{1 Setter
const setter_definition = new ASTNodeDefinition({
    id         : "Setter",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (ast_node, current_token, parser) => {
        const keyword = keyword_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("expression", true);
        const property = get_property(parser);

        parser.prepare_next_state("delimiter", true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const open_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("expression", true);
        parser.expect("identifier", parser => parser.next_ast_node_definition.id === "Identifier");
        const parameter = parser.next_ast_node_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("delimiter", true);
        parser.expect(')', parser => parser.next_token.value === ')');
        const close_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("block_statement", true);
        parser.expect('{', parser => parser.next_token.value === '{');
        const body = parser.get_next_ast_node(precedence_enum.TERMINATION);

        ast_node.keyword           = keyword;
        ast_node.property          = property;
        ast_node.open_parenthesis  = open_parenthesis;
        ast_node.parameter         = parameter;
        ast_node.close_parenthesis = close_parenthesis;
        ast_node.body              = body;
        ast_node.start             = keyword.start;
        ast_node.end               = body.end;

        parser.prepare_next_state("expression", true);
    }
});

// {{{1 Property assignment
const property_assignment = new ASTNodeDefinition({
    id         : "Property assignment",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (ast_node, current_token, parser) => {
        const property = get_property(parser);

        parser.prepare_next_state("delimiter", true);
        parser.expect(':', parser => parser.next_token.value === ':');
        const delimiter = parser.next_ast_node_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("expression", true);
        const initializer = parser.get_next_ast_node(precedence_enum.COMMA);

        ast_node.property    = property;
        ast_node.delimiter   = delimiter;
        ast_node.initializer = initializer;
        ast_node.start       = property.start;
        ast_node.end         = initializer.end;
    }
});

// {{{1 get_members(parser)
function get_members (parser) {
    const members = [];

    parser.prepare_next_state("expression", true);

    LOOP:
    while (true) {
        if (parser.next_token.value === '}') { break; }

        switch (parser.next_token.value) {
            case "get" :
                members.push(getter_definition.generate_new_ast_node(parser));
                break;
            case "set" :
                members.push(setter_definition.generate_new_ast_node(parser));
                break;
            default:
                members.push(property_assignment.generate_new_ast_node(parser));
        }

        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        }

        switch (parser.next_token.value) {
            case ',' :
                parser.change_state("delimiter");
                members.push(parser.next_ast_node_definition.generate_new_ast_node(parser));

                parser.prepare_next_state("expression", true);
                break;
            case '}' :
                break LOOP;
            default:
                parser.throw_unexpected_token();
        }
    }

    return members;
}
// }}}1

module.exports = {
    id         : "Object literal",
    type       : "Primitive",
    precedence : precedence_enum.PRIMITIVE,

    is         : (token, parser) => token.value === '{' && is_expression(parser),
    initialize : (ast_node, current_token, parser) => {
        const expression_name = get_current_state_name(parser);

        parser.change_state("delimiter");

        ast_node.open_curly_bracket  = parser.next_ast_node_definition.generate_new_ast_node(parser);
        ast_node.members             = get_members(parser);
        ast_node.close_curly_bracket = parser.next_ast_node_definition.generate_new_ast_node(parser);
        ast_node.start               = ast_node.open_curly_bracket.start;
        ast_node.end                 = ast_node.close_curly_bracket.end;

        parser.change_state(expression_name);
        parser.prepare_next_ast_node_definition();
    }
};
