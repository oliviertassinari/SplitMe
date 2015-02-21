'use strict';

// Tasks runner
module.exports = function(grunt) {
  require('time-grunt')(grunt); // Display the elapsed execution time of grunt tasks
  require('jit-grunt')(grunt); // Just In Time plugin loader for grunt

  grunt.initConfig({
    src: {
      dir: 'src',
      js: ['src/**.js']
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
    },

    connect: {
      server: {
        options: {
          base: 'src',
          port: 8000,
          hostname: '*',
          livereload: true,
          open: true
        }
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     * But we don't need the same thing to happen for all the files.
     */
    watch: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true,
        livereloadOnError: false, // Livereload only be triggered if all tasks completed successfully
      },

      js: {
        files: '<%= src.js %>',
        tasks: []
      },
    },
  });

  grunt.registerTask('dev', [
    'connect:server', 'watch',
  ]);

  grunt.registerTask('compile', [
    'clean:compile',
    'copy:compile'
  ]);
};