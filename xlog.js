var
	colors = {
	    none  : 8,
	    white: 0,
	    red  : 1,
	    green: 2,
	    yellow: 3,
	    blue  : 4,
	    purple: 5,
	    cyan  : 6,
	    grey  : 60,
	    black : 67
    },
    styles = {
	    primary: {
		    bg   : 'none',
		    color: 'blue'
	    },
	    error  : {
		    bg   : 'red',
		    color: 'white'
	    },
	    info   : {
		    bg   : 'cyan',
		    color: 'black'
	    },
	    muted  : {
		    bg   : 'black',
		    color: 'grey'
	    }
    },
	current = {
		bg   : 0,
		color: 0
	};

function xlog( msg ){
	console.log( xlog.parse.apply( this, arguments ) );
}

xlog.add = function( style ){
	for( var key in style ){
		styles[ key ] = style[ key ];
	}
};

xlog.parse = function xlogParse( text, rest ){
	var args = Array.prototype.slice.call( arguments, 1 ),
	    out  = text.replace( /<(\/)*(bg-)*([a-z-]+)>/gmi, function( _, end, bg, color ){
		    if( color in styles ){
			    current.bg = end
				    ? 48
				    : colors[ styles[ color ].bg ] + 40;
			    current.color = end
				    ? 38
				    : colors[ styles[ color ].color ] + 30;

		    }
		    else {
			    if( colors[ color ]){
				    if( bg ){
					    current.bg = end
						    ? 48
						    : colors[ color ] + 40;
				    } else {
					    current.color = end
						    ? 38
						    : colors[ color ] + 30;
				    }
			    }
			    else {
				    return _;
			    }
		    }

		    return '\x1b[' + current.bg + 'm' + '\x1b[' + current.color + 'm';

	    } ) + '\x1b[0m ';

	if( args.length ){
		out = args.reduce( function( ret, arg, ii ){
			return ret.replace( new RegExp( '\\$' + (ii + 1) ), arg );
		}, out );
	}

	return out;
};

module.exports = xlog;