var exec = require( 'child_process' ).exec,
    branch = 'master',
    origin = 'origin',
    message = 'testing the commit message',
    count = 0,
    gulpgit;

gulpgit = {
	/**
	 * squash
	 *
	 * this method will squash the count of commits into a single commit
	 *
	 * @param {number}      count   number of commits to squash
	 * @param {string}      msg     new commit message
	 * @param {Function}    cb      callback when complete
	 */
	squash: function squash( count, msg, cb ){
		var
			self = this,
			command = 'git reset --soft HEAD~' + (count || this.count ) + ' && git commit -m "' + ( msg || this.msg ) + '"';
		return execCommand( command, function( err ){
			self.push(cb);
		});
	},

	msg: function msg( msg ){

		//this.commit( this.msg, function(){
		//	this.push();
		//});

		// this.squash( this.count, this.msg );
		this.message = msg;
		this.count = 0;

		//this.commit( this.msg, function(){
		//	this.push();
		//} );
	},

	branch: function( branch, cb ){
		this.branch = branch;
		var self = this,
		    command = 'git branch -b ' + branch;
		return execCommand( command, function( err, stdout ){
			return cb( err, stdout );
		});
	},

	commit: addFirst(function( msg, cb ){
		var self = this,
		    command = 'git commit -m \"' + this.message + '\"';
		return execCommand( command, function( err, stdout ){
			return cb && cb( err, stdout );
		});
	}),

	add: function( fileArr, cb ){
		var self    = this,
		    command = 'git add .';
		return execCommand( command, function( err, stdout ){
			return cb && cb( err, stdout );
		} );
	},
	/**
	 * push
	 *
	 * this method will push to the master branch
	 *
	 * @param {String}  branch      branch to push to default: master
	 * @param {String}  origin      location to push default: origin
	 */
	push: function push( branch, origin ){
		branch && (this.branch = branch);
		origin && (this.origin = origin);
		var command = 'git push ' + ( this.origin ) + ' ' + ( this.branch );
		return execCommand( command, cb );
	}
};

function addFirst( cb ){
	return function( fn ){
		return gulpgit.add( null, cb );
	}
}

function execCommand( command, cb ){
	return exec( command,
		function( error, stdout, stderr ){
			if( error !== null ){
				console.log( 'exec error: ' + error );
				return cb( error );
			}
			console.log( 'stdout: ' + stdout );
			console.log( 'stderr: ' + stderr );
			cb( null, stdout );
		} );
}

function handleErr(fn){
	return function( err ){
		if( err ){
			return xlog('<red>$1</red>', err);
		}
		return fn.apply(this, Array.prototype.slice.call(arguments, 1));

	}
}

module.exports = gulpgit;