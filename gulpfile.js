var
	gulp        = require( 'gulp' ),
    args        = require( 'yargs' ).argv,
    git         = require( 'gulp-git' ),
    gulpgit     = require('./gulpgit'),
	xlog        = require( './xlog' ),
	gulpterm    = require( './gulp-term' ),
	margs       = require('./args'),
    _commit     = args.commit || 'initial commit',
    _branch     = args.branch,
    remote      = args.remote || 'origin';

xlog.add({
	test: {
		bg: 'purple',
		color: 'white'
	}
});

xlog('<red>' + JSON.stringify( margs, 0, 2 ) + '</red>');

//if( !msg ){
//	throw new Error( 'Please use the --msg flag to specify a commit message' );
//}
//
//if( !branch ){
//	throw new Error( 'Please use the --branch flag to specify a branch to push to' );
//}
//
//if( branch === 'master' ){
//	throw new Error( 'You cannot use this script to push to master, Do it manually' );
//}

gulp.task( 'save', function(){
	gulpgit.commit( null, function(){
		xlog( '<blue>commited</blue>' );
		gulpterm.prompt();
	});
} );

gulpterm.init( gulp );

gulpterm.add( 'test', {
	help: 'test adding commands from instance',
	cb: function( arg ){
		gulpterm.log( '<blue>arg: </blue><cyan>$1</cyan>', arg );
	}
});

gulpterm.add('push', {
	help: 'push your changes to git',
	cb  : function(){
		gulpterm.log( '<cyan>git push origin $1</cyan>', _branch );
	}
});

gulpterm.add('commit', {
	help: 'change your commit message `<purple>commit {{commit message}}</purple>`',
	cb  : function( message ){
		gulpgit.commit( message, function(){
			gulpterm.log( '<cyan>git commit -m `$1`</cyan>', _commit );
			gulpterm.prompt();
		});
	}
});

gulpterm.add('branch', {
	help: 'change your commit branch `<purple>branch {{branch}}</purple>`',
	cb  : function( branch ){
		if( !branch ){
			gulpterm.ask( 'please specify a branch', function( branch ){
				_branch = branch;
				gulpterm.log( 'answer: ' + branch );
			} );
			return false;
		}
		else {
			_branch = branch;
			gulpterm.log( '<cyan>git branch -b `$1`</cyan>', _branch );
		}
	}
});

gulpterm.add('cls', {
	help: 'clear the console `<purple>cls</purple>`',
	cb: function(){
		gulpterm.log('\u001B[2J\u001B[0;0f');
	}
});

gulpterm.add('cl', {
	help: 'clear the console `<purple>cls</purple>`',
	cb: function(){
		gulpterm.log( '\u001B[2K' );
		return false;
	}
});

gulpterm.add('prompt', {
	help: 'change the prompt in the terminal',
	cb: function( prompt ){
		gulpterm.prompt(prompt);
		return false;
	}
});

gulpterm.add('update', {
	help: 'commit and push to your branch `<purple>update</purple>`',
	cb  : function( commit ){
		commit && (_commit = commit);
		gulpterm.log( '<cyan>git commit -m `$1`</cyan>', _commit );
	}
});

gulp.task( 'default', function(){

	//git.checkout( branch, { args: '-b' }, function( err ){
	//	if( err ) throw err;
	//} );

	gulp.watch([
		'./index.html'
	], [ 'save' ] );

} );

//
//for( var ii = 30, ll = 149; ii < ll; ii++){
//	console.log( 'color: ' + ii + '\x1b['+ ii +'m', 'sometext', '\x1b[0m' );
//}

//xlog( '[<cyan>$1</cyan>] <cyan>success:</cyan> you did something right for once <info>info</info>', 200);
//xlog( '[<red>500</red>] <red>error:  </red> you fucked up' );