var
	readline = require( 'readline' ),
    xlog     = require('./xlog'),
    rl       = readline.createInterface( {
	    input: process.stdin,
	    output: process.stdout
    }),
    askcb    = null,
    _gulp    = null;

var gulpterm = {
	init: function( gulp ){
		_gulp = gulp;
		if( typeof gulp.doneCallback === 'function' ){
			var oldCallback = gulp.doneCallback;
			gulp.doneCallback = function(){
				oldCallback.apply(this, arguments);
				gulpterm.prompt();
			}
		} else {
			gulp.doneCallback = gulpterm.prompt
		}
	},
	add: function( command, obj ){
		commands[ command ] = obj;
	},
	prompt: function( prompt ){
		rl.setPrompt( prompt ? xlog.parse(prompt) : '\x1b[35m>_\x1b[0m ' );
		rl.prompt();
	},
	ask: ask,
	log: xlog
};

var commands = {
	help: {
		help: 'find out more about the terminal',
		cb  : function(){
			var msg = '';
			for( var key in commands ){
				msg += '\n<cyan> + ' + key + ':' + spaces(8, key) + '</cyan> ' + commands[ key ].help;
			}
			xlog( 'you can use this terminal to' + msg );
		}
	}

};


function spaces( len, word ){
	var spaces = '';
	for( var ii = word.length, ll = len ||  8; ii < ll; ii++ ) {
		spaces += " ";
	}
	return spaces;
}

rl.write(xlog.parse('something <purple>something</purple> darkside stuff\n'));
rl.write(xlog.parse('something <purple>something</purple> darkside stuff\n'));

gulpterm.prompt();

rl.on( 'line', function( line ){

	if( typeof askcb === 'function' ){
		askcb(line);
		askcb = null;
		gulpterm.prompt();
	}
	else {

		line.replace(/(\w+)\s*(.*)*/, function( _, command, args ){
			if( commands[ command ] != null ){
				var ret = commands[ command ].cb.apply( this, Array.prototype.slice.call( arguments, 2 ) );
				if(ret === false ){
					return;
				}
			}
			else {
				xlog('unknown command `<cyan>$1</cyan>` please use `<cyan>help</cyan>`', line );
			}

			gulpterm.prompt();

		});
	}
} ).on( 'close', function(){
	console.log( 'Ctrl C detected do some stuff here' );
	setTimeout(function(){
		console.log('closing terminal');
		process.exit( 0 );
	}, 600);
} );

var setPromptAfter = after(function( cb ){
	rl.setPrompt( '\x1b[35m>_\x1b[0m ' );
});

function ask( question, cb ){
	askcb = cb;
	rl.setPrompt( xlog.parse('<cyan>$1</cyan>', question ) );
	rl.prompt();
}

function after( afterFn ){
	return function( fn ){
		fn.apply(this, arguments);
	}
}

module.exports = gulpterm;