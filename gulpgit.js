var exec = require( 'child_process' ).exec;

function GulpGit(){}
GulpGit.prototype = {
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
			command = 'git reset --soft HEAD~' + (count || 1) + ' && git commit -m "' + msg + '"';
		return execCommand( command, function( err ){
			self.push(cb);
		});
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
		var command = 'git push ' + ( origin || 'origin') + ' ' + ( branch || 'master');
		return execCommand( command, cb );
	}
};


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

module.exports = new GulpGit;