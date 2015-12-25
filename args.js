console.log(JSON.stringify( process.argv.slice(2) ));

var processargs = process.argv.slice( 2 ),
	args = {
		process: {
			__bin: process.argv[ 0 ],
			__dirname: process.argv[ 1 ]
		},
		vars: {}
	};

for( var ii = 0, ll = processargs.length; ii < ll; ii++ ) {
	var match;
	if( (match = processargs[ ii ].match( /^--(\w+)/ ) ) ){
		args.vars[ match[ 1 ] ] = processargs[ ++ii ];
	}
}

module.exports = args;