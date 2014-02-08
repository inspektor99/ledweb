//Global Grunt settings

var webPath = 'public';
var webdevPath = 'webdev';

var srcPath = webPath + '/src';
var distPath = webPath + '/dist';
var distFile = '<%= pkg.name %>-<%= pkg.version %>';

var jsDistPath = distPath + '/js/' + distFile;
var cssDistPath = distPath + '/css/' + distFile;

var jsSources = [webdevPath + '/js/**/*.js', 'Gruntfile.js'];
var jsOrdered = [
    'ledcontroller.js',
    'ledem.js',
    'main.js'
];

//gotta do this because CWD is only supported for expanded file processing.
var jsSrcOrdered = jsOrdered.slice(0);

var i = 0;
var len = jsSrcOrdered.length;

for (i = 0; i < len; i++) {
    jsSrcOrdered[i] = srcPath + '/' + jsSrcOrdered[i];
}

//clone all js and add gruntfile
var jsDebug = jsOrdered.slice(0);
jsDebug.push('Gruntfile.js');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            options: {
                force: true
            },
            js: [distPath + '/js', srcPath + '/js'],
            css: [distPath + '/css', srcPath + '/css'],
            vendor: webPath + '/vendor/**/*'
        },
        copy: {
            vendor: {
                files: [{
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist/',
                    src: ['**/*', '!**/css/**'],
                    dest: webPath + '/vendor/bootstrap/'
                }, {
                    expand: true,
                    cwd: 'bower_components/jquery/',
                    src: ['jquery.min.*', 'jquery.js'],
                    dest: webPath + '/vendor/jquery/'
                }]
            },
            js: {
                src: webdevPath + '/js/**/*.js',
                dest: srcPath + '/'
            },
            css: {
                src: webdevPath + '/css/**/*',
                dest: srcPath + '/'
            }
        },
        concat: {
            dist: {
                src: jsOrdered,
                dest: jsDistPath + '.js'
            }
        },
        replace: {
            dev: {
                src: webdevPath + '/*.html',
                dest: webPath + '/',
                replacements: [{
                    from: '{{#css}}',
                    to: '<link href="/' + distPath + '/css/' + distFile + '.min.css" type="text/css" rel="stylesheet"/>'
                }, {
                    from: '{{#js}}',
                    to: function(matchedWord) {
                        i = 0;
                        len = jSrcOrdered.length;
                        var src = '';

                        for (i = 0; i < len; i++) {
                            src += '<script src="/' + srcPath + '/' + jsOrdered[i] + '"></script>\n';
                        }
                        return src;
                    }
                }]
            },
            release: {
                src: [webdevPath + '/index.html'],
                dest: webPath + '/',
                replacements: [{
                    from: '{{#css}}',
                    to: '<link href="/' + distPath + '/css/' + distFile + '.min.css" type="text/css" rel="stylesheet"/>'
                }, {
                    from: '{{#js}}',
                    to: '<script src="/' + distPath + '/js/' + distFile + '.min.js"></script>'
                }]
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            my_target: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    sourceMap: true
                },
                files: [{
                    src: jsSrcOrdered,
                    dest: jsDistPath + '.min.js'
                }]
            }
        },
        jshint: {
            options: {
                devel: true, // allows console, alert etc
                undef: true, //no undefined variable (except for ignores) allowed
                unused: 'vars', //no unused vars allowed
                eqeqeq: true, //must always use ===
                //strict: true,
                forin: true,
                curly: true,
                latedef: 'nofunc',
                //quotmark: 'single', // TODO - might be lots of these
                browser: true,
                jquery: true,
                nonstandard: true,
                globals: {
                    //global
                    Led: true,

                    //library globals
                    '_': true,
                    Backbone: true,
                    tinyMCE: true,
                    module: true,
                },
                ignores: []
            },
            dev: {
                src: jsDebug
            },
            release: {
                options: {
                    devel: false // no consoles on release src
                },
                files: {
                    src: jsDebug
                }
            }
        },
        less: {
            options: {
                compress: true,
                sourceMap: true,
                sourceMapFilename: cssDistPath + '.css.map',
                sourceMapURL: distFile + '.css.map',
                sourceMapRootpath: '../../src'
            },
            files: {
                src: webdevPath + '/css/less/Led.less',
                dest: cssDistPath + '.min.css'
            }
        },
        jsbeautifier: {
            options: {},
            files: {
                src: jsDebug
            }
        },
        watch: {
            css: {
                files: webdevPath + '/less/**/*.less', 
                tasks: ['newer:clean:css', 'newer:copy:css', 'newer:less']
            },
            html: {
                files: [webdevPath + '/templates/**/*.html'],
                tasks: ['']
            },
            js: {
                files: jsSources,
                tasks: ['newer:jsbeautifier', 'newer:jshint:dev', 'newer:clean:js', 'newer:copy:js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-text-replace');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');

    // Default task(s).
    grunt.registerTask('default', ['clean:vendor', 'copy:vendor', 'replace:dev', 'watch']);

    grunt.registerTask('release', ['replace:release', 'jsbeautifier', 'jshint:release', 'clean', 'concat', 'copy', 'uglify', 'less']);
};
