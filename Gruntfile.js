module.exports = function(grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            app: 'src',
            bower: 'src/bower_components',
            dist: 'www'
        },


        connect: {
            options: {
                port: 8000,
                hostname: '0.0.0.0'
            },
            server: {
                options: {
                    port: '<%= connect.options.port %>',
                    hostname: '*',
                    base: 'www',
                    keepalive: true,
                    open: true
                }
            },
            test: {
                options: {
                    port: '<%= connect.options.port + 1 %>',
                    livereload: false,
                    base: [
                        'test',
                        '<%= config.app %>'
                    ]
                }
            },
            'test-server': {
                options: {
                    open: 'http://localhost:<%= connect.test.options.port %>',
                    port: '<%= connect.test.options.port %>',
                    base: '<%= connect.test.options.base %>',
                    keepalive: true
                }
            }
        },


        clean: ['<%= config.dist %>'],
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'www/assets/styles.css': [
                        '<%= config.bower %>/bootstrap/dist/css/bootstrap.css',
                        '<%= config.bower %>/bootstrap/dist/css/bootstrap-theme.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'www/index.html': 'src/index.html'
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    name: 'main',
                    baseUrl: '<%= config.app %>/scripts',
                    mainConfigFile: '<%= config.app %>/config.js',
                    out: '<%= config.dist %>/assets/main.js',
                    done: function(done, output) {
                        var duplicates = require('rjs-build-analysis').duplicates(output);

                        if (Object.keys(duplicates).length > 0) {
                            grunt.log.subhead('Duplicates found in requirejs build:');
                            for (var key in duplicates) {
                                grunt.log.error(duplicates[key] + ': ' + key);
                            }
                            return done(new Error('r.js built duplicate modules, please check the excludes option.'));
                        } else {
                            grunt.log.success('No duplicates found!');
                        }

                        done();
                    }
                }
            }
        },
        uglify: {
            main: {
                files: [{
                    src: '<%= config.bower %>/requirejs/require.js',
                    dest: '<%= config.dist %>/assets/require.js'
                },{
                    src: '<%= config.dist %>/assets/main.js',
                    dest: '<%= config.dist %>/assets/main.js'
                }]
            }
        },


        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'test/{,**/}*.js',
                'src/scripts/{,**/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html'],
                    log: true
                }
            }
        }
    });

    grunt.registerTask('test', 'Unit testing', function(target) {

        if (target === 'serve') {
            return grunt.task.run(['jshint', 'connect:test-server']);
        } else {
            return grunt.task.run(['jshint', 'connect:test', 'mocha']);
        }
    });

    grunt.registerTask('build', ['clean', 'cssmin', 'htmlmin', 'requirejs', 'uglify']);
    grunt.registerTask('default', ['build', 'connect:server']);
};