'use strict';

// Tasks runner
module.exports = function(grunt) {
	require('time-grunt')(grunt); // Display the elapsed execution time of grunt tasks
	require('jit-grunt')(grunt); // Just In Time plugin loader for grunt

	grunt.initConfig({
		src: {
			dir: 'src',
			js: ['**/*.js']
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
		},

		/**
		 * The `copy` task just copies files from A to B.
		 */
		copy: {
			compile: {
				files: [{
					cwd: '<%= src.dir %>/',
					src: ['*'],
					dest: '<%= compile.dir %>/',
					expand: true
				}]
			},
		}
	});

	grunt.registerTask('compile', [
		'clean:compile',
		'copy:compile'
	]);
};