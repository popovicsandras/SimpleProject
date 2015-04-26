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


        clean: ['<%= config.dist %>', '.tmp'],
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'www/styles/styles.css': [
                        '<%= config.bower %>/bootstrap/dist/css/bootstrap.css',
                        '<%= config.bower %>/bootstrap/dist/css/bootstrap-theme.css',
                        '.tmp/styles.css'
                    ]
                }
            }
        },

        less: {
            options: {
                paths: ['<%= config.app %>/styles']
            },
            dist: {
                files: {
                    '.tmp/styles.css': '<%= config.app %>/styles/styles.less'
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
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.bower %>/bootstrap/fonts',
                        src: ['*'],
                        dest: '<%= config.dist %>/fonts',
                        filter: 'isFile'
                    }
                ]
            },
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/scripts',
                        src: ['**/*'],
                        dest: '<%= config.dist %>/scripts',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.bower %>',
                        src: ['**/*'],
                        dest: '<%= config.dist %>/bower_components',
                        filter: 'isFile'
                    },
                    {
                        src: '<%= config.app %>/index.html',
                        dest: '<%= config.dist %>/index.html'
                    },
                    {
                        src: '<%= config.bower %>/requirejs/require.js',
                        dest: '<%= config.dist %>/scripts/require.js'
                    }
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    name: 'main',
                    baseUrl: '<%= config.app %>/scripts',
                    mainConfigFile: '<%= config.app %>/scripts/config.js',
                    out: '<%= config.dist %>/scripts/main.js',
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
                    dest: '<%= config.dist %>/scripts/require.js'
                },{
                    src: '<%= config.dist %>/scripts/main.js',
                    dest: '<%= config.dist %>/scripts/main.js'
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

    grunt.registerTask('serve', 'Starting webserver', function(target) {

        if (target === 'dist') {
            return grunt.task.run(['build:dist', 'connect:server']);
        } else {
            return grunt.task.run(['build', 'connect:server']);
        }
    });

    grunt.registerTask('build', 'Build the application', function(target) {

        if (target === 'dist') {
            return grunt.task.run([
                'clean',
                'less',
                'cssmin',
                'htmlmin',
                'copy:fonts',
                'requirejs',
                'uglify'
            ]);
        } else {
            return grunt.task.run([
                'clean',
                'less',
                'cssmin',
                'copy:fonts',
                'copy:dev'
            ]);
        }
    });

    grunt.registerTask('default', ['serve']);
};