/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tokenizer.js
* Created at  : 2017-05-23
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var tokenizer = require("../es5/tokenizer").clone();
	
// TemplateLiteral {{{1
tokenizer.register({
	is     : function (character) { return character === '`'; },
	protos : {
		type       : "BackTick",
		precedence : 1,
		initialize : function (character, streamer) {
			this.type  = this.type;
			this.start = streamer.get_cursor();
			this.end   = streamer.end_cursor();
		},
	},
}).

// Arrow function punctuator {{{1
register({
	is : function (character, streamer) {
		return character === '=' && streamer.peek(streamer.cursor.index + 1) === '>';
	},
	protos : {
		type       : "ArrowFunctionPunctuator",
		precedence : 21,
		initialize : function (character, streamer) {
			this.type     = this.type;
			this.operator = this.value = "=>";
			this.start    = streamer.get_cursor();

			streamer.move_right(1);
			this.end = streamer.end_cursor();
		},
	},
});
// }}}1

module.exports = tokenizer;
