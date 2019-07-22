/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2017-05-22
* Updated at  : 2019-03-30
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const JeefoParser      = require("@jeefo/parser"),
      states_enum      = require("./enums/states_enum"),
      es5_tokenizer    = require("./tokenizer"),
      ignore_comments  = require("./helpers/ignore_comments"),
      es5_ast_nodes    = require("./ast_nodes");

const parser = new JeefoParser("ECMA Script 5", es5_tokenizer, es5_ast_nodes);
Object.keys(states_enum).forEach((key) => {
    parser.state.add(key, states_enum[key], key === "statement");
});

const delimiters = ['{'];

function try_terminate (current_ast_node, parser) {
    if (current_ast_node.end.line < parser.next_token.start.line) {
        parser.terminate(current_ast_node);
    } else {
        parser.throw_unexpected_token();
    }
}

parser.onpreparation = parser => {
    let current_ast_node = null;
    if (parser.current_ast_node !== null && parser.current_ast_node.id !== "Comment") {
        current_ast_node = parser.current_ast_node;
    }
    ignore_comments(parser);

    if (parser.next_token === null || current_ast_node === null) { return; }

    switch (current_ast_node.type) {
        case "Primitive" :
            if (parser.next_token.id === "Identifier" &&
                parser.next_ast_node_definition !== null &&
                parser.next_ast_node_definition.type === "Binary operator") {
                break;
            }

            switch (parser.next_token.id) {
                case "Number" :
                case "Identifier" :
                    try_terminate(current_ast_node, parser);
                    break;
                case "Delimiter" :
                    if (delimiters.includes(parser.next_token.value)) {
                        try_terminate(current_ast_node, parser);
                    }
                    break;
            }
            break;
    }
};

module.exports = parser;








// ignore:start
if (require.main === module) {

// {{{1 print
const print_ast_node = (ast_node, is_expression) => {
    if (!ast_node || ! ast_node.start || ! ast_node.end) {
        console.log(ast_node);
        throw new Error(1);
    }
    console.log(`code: \`${ parser.tokenizer.streamer.substring_from_token(ast_node) }\``);
    console.log(ast_node.to_string());

    switch (ast_node.type) {
        case "Declarator" :
            print_ast_node(ast_node.identifier, true);
            if (ast_node.init) {
                print_ast_node(ast_node.init, true);
            }
            if (ast_node.left_comment) {
                print_ast_node(ast_node.left_comment, true);
            }
            if (ast_node.right_comment) {
                print_ast_node(ast_node.right_comment, true);
            }
            console.log(" NEXT ----------------------------------------");
            break;
        case "Declaration" :
            switch (ast_node.id) {
                case "Varaible delcaration" :
                    ast_node.declarations.forEach(declarator => {
                        print_ast_node(declarator, true);
                    });
                    break;
            }
            break;
        case "Statement" :
            switch (ast_node.id) {
                case "Expression statement" :
                    print_ast_node(ast_node.expression, true);
                    if (ast_node.pre_comment) {
                        print_ast_node(ast_node.pre_comment, true);
                    }
                    if (ast_node.post_comment) {
                        print_ast_node(ast_node.post_comment, true);
                    }
                    break;
                case "Return statement" :
                    if (ast_node.argument) {
                        print_ast_node(ast_node.argument, true);
                    }
                    if (ast_node.pre_comment) {
                        print_ast_node(ast_node.pre_comment, true);
                    }
                    break;
            }
            break;
        case "Binary operator" :
            print_ast_node(ast_node.left, true);
            print_ast_node(ast_node.right, true);
            if (ast_node.comment) {
                print_ast_node(ast_node.comment, true);
            }
            break;
        case "Primitive" :
            if (ast_node.id === "Primitive wrapper") {
                print_ast_node(ast_node.value, true);
            }
            break;
        default:
            console.log(222, ast_node.type);
    }

    if (! is_expression) {
        console.log("\n[END] -------------------------------------------------------\n");
    }
};
// }}}1

/*
parser.throw_unexpected_token = function () {
console.log(parser);
console.log("throw");
process.exit();
};
*/

const fs = require("fs");
const source = fs.readFileSync("./test", "utf8");
const ast_nodes = parser.parse(source);

console.log("===========================");
ast_nodes.forEach(ast_node => print_ast_node(ast_node));
//console.log(parser.ast_nodes.get_reserved_words());

if (true) {
    process.exit();
}

let zz = `
delete ZZ.ff;
typeof x;
throw z,a,b;
switch (tokens[i].type) {
    case "Number":
    case "Identifier":
        if (tokens[i - 1].end.index === tokens[i].start.index) {
            this.name += tokens[i].value;
        } else {
            break LOOP;
        }
        break;
    case "SpecialCharacter":
        switch (tokens[i].value) {
            case '$':
            case '_':
                if (tokens[i - 1].end.index === tokens[i].start.index) {
                    this.name += tokens[i].value;
                } else {
                    break LOOP;
                }
                break;
            default:
                break LOOP;
        }
        break;
    default:
        break LOOP;
}
for (var i = 0; i < 5; ++i) {
    zz = as, gg = aa;
}
for (;;) {
    zz = as, gg = aa;
}
for (var a in b) {
    zz = as, gg = aa;
}
{
    var a = c + b.c * d - f, z = rr;
}
++a;
a++;
o = { a_1 : 99, $b : 2 };
[1,2,3];
{};
new Fn(1.2E2,2,3);
PP.define("IS_NULL", function (x) { return x === null;   }, true);
instance.define("IS_OBJECT" , function (x) { return x !== null && typeof x === "object"; } , true);
instance.define("ARRAY_EXISTS" , function (arr, x) { return arr.indexOf(x) >= 0; } , true);

return {
    pre : (link && link.pre) ? link.pre : null,
    /**
     * Compiles and re-adds the contents
     */
    post : function(scope, element) {
        // Compile the contents
        if (! compiledContents) {
            compiledContents = $compile(contents);
        }
        // Re-add the compiled contents to the element
        compiledContents(scope, function(clone) {
            element.append(clone);
        });

        // Call the post-linking function, if any
        if (link && link.post) {
            link.post.apply(null, arguments);
        }
    }
};
var fields           = form.fields.filter(function (f) { return f; }),
    violations       = form.violations,
    oversighted_type = form.oversighted_type,
    total_fields     = fields.length + 4, // oversighted_type, violations, title, num_attachments
    counter          = 0;
(function check_condition () {
    if (is_canceled) { return; }
    var result = callback();

    if (result) {
        deferred.resolve();
    } else if ((Date.now() + interval) < end_time) {
        setTimeout(check_condition, interval);
    } else {
        deferred.reject();
    }
}());
var EXTRACT_FILENAME = /filename[^;\\n=]*=((?:['\\"]).*?\\2|[^;\\n]*)/g;
var HOST_CONSTRUCTOR_REGEX = /^\[object .+?Constructor\]$/; // 40
match    = match[0].match(/filename="([^"\\\\]*(?:\\.[^"\\\\]*)*)"/i);
filename = (match && match[1]) ? decodeURI(match[1]) : fallback_filename;
$ngRedux.connect(function () {
    var state = $ngRedux.getState();
    if (state.backdrop) {
        $element.css({
            bottom  : 0,
            opacity : 0.6,
        });
    } else {
        $element.css({
            bottom  : "100%",
            opacity : 0,
        });
    }

    return { backdrop : state.backdrop };
})(dumb_state);
return {
    'collapse-handler-right'          : ! folder.is_loading && ! folder.is_collapsed,
    'icon-spin4 animate-spin'         : folder.is_loading,
    'icon-right-dir collapse-handler' : ! folder.is_loading
};
size = (size / divider);

define([], function () {
    function compare_by_id (a, b) {
        var result = 0;
        if (a.conclusion_id < b.conclusion_id) {
            result = -1;
        } else if (a.conclusion_id > b.conclusion_id) {
            result = 1;
        }
        return result;
    }
    function compare_by_string (a, b) { return a.rate.localeCompare(b.rate); }
});

this.REGEX_FLAGS.indexOf(flags_value.charAt(i)) !== -1 && flags.indexOf(flags_value.charAt(i)) === -1;
`;
zz = 1;
}
// ignore:end
