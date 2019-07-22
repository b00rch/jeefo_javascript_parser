/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-23
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.6.3
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const ASTNodeDefinition             = require("@jeefo/parser/src/ast_node_definition"),
      states_enum                   = require("../enums/states_enum"),
      precedence_enum               = require("../enums/precedence_enum"),
      operator_definition           = require("../common/operator_definition"),
      get_pre_comment               = require("../helpers/get_pre_comment"),
      get_right_value               = require("../helpers/get_right_value"),
      get_start_position            = require("../helpers/get_start_position"),
      get_last_non_comment_ast_node = require("../helpers/get_last_non_comment_ast_node"),
      get_variable_declaration_list = require("../helpers/get_variable_declaration_list");

// {{{1 for_expression_initialize_factory() helper function
function __for_expression_initialize (ast_node, parser) {
    let expression = null, post_comment = null, start;

    if (parser.next_token.value !== ';') {
        parser.post_comment = null;
        expression = parser.get_next_ast_node(precedence_enum.TERMINATION);

        if (expression.id === "Comment") {
            expression = get_last_non_comment_ast_node(parser, true);
            post_comment = parser.current_ast_node;
        } else if (parser.post_comment) {
            post_comment = parser.post_comment;
        }
    } else if (parser.current_ast_node !== null) {
        if (parser.current_ast_node.id === "Comment") {
            post_comment = parser.current_ast_node;
            if (parser.previous_ast_nodes.length === 2) {
                expression = parser.previous_ast_nodes[0];
            }
        } else {
            expression = parser.current_ast_node;
        }
    }

    if (expression) {
        start = expression.start;
    } else if (post_comment !== null) {
        start = post_comment.start;
    } else {
        start = parser.next_token.start;
    }

    parser.expect(';', parser => parser.next_token.value === ';');

    ast_node.expression   = expression;
    ast_node.post_comment = post_comment;
    ast_node.start        = start;
    ast_node.end          = parser.next_token.end;
}

function for_expression_initialize_factory (prepare) {
    return (ast_node, current_token, parser) => {
        prepare(parser);
        __for_expression_initialize(ast_node, parser);
    };
}

// {{{1 Expression no in
const expression_no_in = new ASTNodeDefinition({
    id         : "Expression no in",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : for_expression_initialize_factory(parser => {
        parser.change_state("expression_no_in");
    })
});

// {{{1 get_variable_declaration_list_no_in(parser, pre_comment, var_token)
const variable_declaration_list_no_in = new ASTNodeDefinition({
    id         : "Variable declaration list no in",
    type       : "Declaration",
    precedence : -1,

    is         : () => {},
    initialize : () => {}
});

function get_variable_declaration_list_no_in (parser, pre_comment, var_token) {
    let list = [];
    const ast_node = variable_declaration_list_no_in.generate_new_ast_node(parser);

    if (parser.next_token.value !== ';') {
        parser.change_state("expression_no_in");
        list = get_variable_declaration_list(parser, false);
    }
    parser.expect(';', parser => parser.next_token.value === ';');

    ast_node.pre_comment_of_var = pre_comment;
    ast_node.token              = var_token;
    ast_node.list               = list;
    ast_node.start              = var_token.start;
    ast_node.end                = parser.next_token.end;

    return ast_node;
}

// {{{1 for_expression_condition definition
const for_expression_condition = new ASTNodeDefinition({
    id         : "For expression's condition",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : for_expression_initialize_factory(parser => {
        parser.prepare_next_state("expression", true);
    })
});

// {{{1 get_for_expression_no_in(parser, var_token)
const for_expression_no_in = new ASTNodeDefinition({
    id         : "For expression no in",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : () => {}
});

function get_for_expression_no_in (parser, open_parenthesis, pre_comment, var_token) {
    const ast_node = for_expression_no_in.generate_new_ast_node(parser);

    // init
    let init = null;
    if (var_token) {
        init = get_variable_declaration_list_no_in(parser, pre_comment, var_token);
    } else {
        init = expression_no_in.generate_new_ast_node(parser);
    }

    // condition
    const condition = for_expression_condition.generate_new_ast_node(parser);

    // update
    let update = null;
    parser.prepare_next_state("expression", true);
    if (parser.next_token.value !== ')') {
        parser.post_comment = null;
        update = get_right_value(parser, precedence_enum.TERMINATION);
        parser.current_ast_node = parser.post_comment;
    }

    // close
    parser.expect(')', parser => parser.next_token.value === ')');
    const close_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

    ast_node.open_parenthesis  = open_parenthesis;
    ast_node.initializer       = init;
    ast_node.condition         = condition;
    ast_node.update            = update;
    ast_node.close_parenthesis = close_parenthesis;
    ast_node.start             = open_parenthesis.start;
    ast_node.end               = close_parenthesis.end;

    return ast_node;
}

// {{{1 get_for_in_expression(parser, var_token, identifier)
const for_in_expression = new ASTNodeDefinition({
    id         : "For in expression",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : () => {}
});

const for_in_variable_declaration = new ASTNodeDefinition({
    id         : "For in variable declaration",
    type       : "Declaration",
    precedence : -1,

    is         : () => {},
    initialize : () => {}
});

function get_for_in_expression (parser, open_parenthesis, pre_comment, var_token, identifier) {
    let ast_node;

    if (var_token) {
        // For in variable declaration
        ast_node = for_in_variable_declaration.generate_new_ast_node(parser);

        const operator = operator_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("expression", true);
        parser.post_comment = null;
        const init = get_right_value(parser, ast_node.precedence);

        ast_node.open_parenthesis   = open_parenthesis;
        ast_node.pre_comment_of_var = pre_comment;
        ast_node.token              = var_token;
        ast_node.identifier         = identifier;
        ast_node.operator           = operator;
        ast_node.initializer        = init;
        ast_node.pre_comment        = pre_comment;
    } else {
        // For in expression
        ast_node = for_in_expression.generate_new_ast_node(parser);

        const operator = operator_definition.generate_new_ast_node(parser);
        parser.prepare_next_state("expression", true);

        parser.post_comment = null;
        const init = get_right_value(parser, ast_node.precedence);
        parser.current_ast_node = parser.post_comment;

        ast_node.open_parenthesis = open_parenthesis;
        ast_node.identifier       = identifier;
        ast_node.operator         = operator;
        ast_node.initializer      = init;
    }

    parser.expect(')', parser => parser.next_token.value === ')');
    parser.current_ast_node = parser.post_comment;
    const close_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

    ast_node.close_parenthesis = close_parenthesis;
    ast_node.start             = open_parenthesis.start;
    ast_node.end               = close_parenthesis.end;

    return ast_node;
}
// }}}1

function get_for_expression (parser) {
    const open_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);
    parser.post_comment = null;
    parser.prepare_next_state("expression", true);

    const pre_comment = get_pre_comment(parser);

    const var_token = parser.next_token.value === "var" ? parser.next_token : null;

    if (var_token) {
        parser.prepare_next_state("expression", true);
    }

    if (parser.next_token.value !== ';' && parser.next_ast_node_definition !== null) {
        if (parser.next_token.value === ')') {
            parser.throw_unexpected_token("Missing expression");
        }
        const first_ast_node_token = parser.next_token;
        const first_ast_node = parser.next_ast_node_definition.generate_new_ast_node(parser);
        parser.prepare_next_state("expression", true);

        if (parser.next_token.value === "in") {
            const next_token  = parser.next_token;
            parser.next_token = first_ast_node_token;
            parser.expect("identifier", () => first_ast_node.id === "Identifier");
            parser.next_token = next_token;

            return get_for_in_expression(parser, open_parenthesis, pre_comment, var_token, first_ast_node);
        }

        parser.previous_ast_nodes = [first_ast_node];
        if (parser.current_ast_node) {
            parser.previous_ast_nodes.push(parser.current_ast_node);
        } else {
            parser.current_ast_node = first_ast_node;
        }
    }

    return get_for_expression_no_in(parser, open_parenthesis, pre_comment, var_token);
}

module.exports = {
    id         : "For statement",
    type       : "Statement",
	precedence : 31,

    is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : (ast_node, current_token, parser) => {
        const pre_comment = get_pre_comment(parser);

        parser.prepare_next_state("delimiter", true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const expression = get_for_expression(parser);

        parser.prepare_next_state(null, true);
        const statement = parser.get_next_ast_node(precedence_enum.TERMINATION);

        ast_node.pre_comment = pre_comment;
        ast_node.token       = current_token;
        ast_node.expression  = expression;
        ast_node.statement   = statement;
        ast_node.start       = get_start_position(pre_comment, current_token);
        ast_node.end         = statement.end;
    }
};
