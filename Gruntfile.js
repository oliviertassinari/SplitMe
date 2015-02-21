'use strict';

// Tasks runner
module.exports = function(grunt) {
	require('time-grunt')(grunt); // Display the elapsed execution time of grunt tasks
	require('jit-grunt')(grunt); // Just In Time plugin loader for grunt

	grunt.initConfig({
		src: {
			dir: 'src',
			js: ['**/*.js'],
		},

		compile: {
			dir: 'cordova/www'
		},

		/**
		 * The directories to delete when `grunt clean` is executed.
		 */
		clean: {
			compile: [
				'<%= compile.dir %>'
			],
		}
	});

	grunt.registerTask('compile', [
		'clean:compile',
	]);
};