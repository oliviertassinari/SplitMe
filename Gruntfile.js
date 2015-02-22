'use strict';

// Tasks runner
module.exports = function(grunt) {
  require('time-grunt')(grunt); // Display the elapsed execution time of grunt tasks
  require('jit-grunt')(grunt); // Just In Time plugin loader for grunt

  grunt.initConfig({
    src: {
      dir: 'src',
      js: '**/*.js',
      less: '**/*.less',
    },

    build: {
      dir: 'build'
    },

    compile: {
      dir: 'cordova/www'
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      build: [
        '<%= build.dir %>'
      ],

      compile: [
        '<%= compile.dir %>'
      ],
    },

    /**
     * The `copy` task just copies files from A to B.
     */
    copy: {
      build: {
        files: [{
          cwd: '<%= src.dir %>',
          src: ['**/*.png', '!components/**'],          
          dest: '<%= build.dir %>',
          expand: true
        }]
      },
      compile: {
        files: [{
          cwd: '<%= build.dir %>',
          src: ['**'],
          dest: '<%= compile.dir %>',
          expand: true
        }]
      },
    },

    connect: {
      server: {
        options: {
          base: '<%= build.dir %>',
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
        files: '<%= src.dir %>/<%= src.js %>',
        tasks: []
      },
    },

    index: {
      build: {
        indexSrc: '<%= src.dir %>/index.html',
        indexDest: '<%= build.dir %>/index.html',
        src: [
          '<%= build.dir %>/**/*.css',
          '<%= build.dir %>/**/*.js',
        ],
        remove: '<%= build.dir %>/',
      },
    },

    browserify: {
      options: {
        extensions: ['.jsx'],
        transform: ['reactify']
      },
      build: {
        src: '<%= src.dir %>/app.jsx',
        dest: '<%= build.dir %>/app.js'
      }
    },

    less: {
      build: {
        files: {
          '<%= build.dir %>/material-ui.css': '<%= src.dir %>/<%= src.less %>'
        },
        options: {
          cleancss: true,
        }
      },
    },
  });

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index template', function() {
    var remove = this.data.remove;

    var filesSrc = this.filesSrc.map(function (file) {
      return file.replace(remove, '');
    });

    function filter(files, regex) {
      return files.filter(function(file) {
        return file.match(regex);
      });
    }

    var scripts = filter(filesSrc, /\.js$/);
    var styles = filter(filesSrc, /\.css$/);

    grunt.file.copy(this.data.indexSrc, this.data.indexDest, {
      process: function(contents) {
        return grunt.template.process(contents, {
          data: {
            scripts: scripts,
            styles: styles
          }
        });
      }
    });
  });

  grunt.registerTask('dev', [
    'build', 'connect:server', 'watch',
  ]);

  grunt.registerTask('build', [
    'clean:build',
    'less:build',
    'browserify:build',
    'copy:build',
    'index:build'
  ]);

  grunt.registerTask('compile', [
    'clean:compile',
    'copy:compile'
  ]);

  grunt.registerTask('default', ['build', 'compile']);
};