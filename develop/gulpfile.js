'use strict';

var gulp = require('gulp'),
	// gulp shorthand
    $ 			= require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    del   		= require('del'),
    argv        = require('yargs').argv,
    hbsfy       = require('browserify-handlebars'),
    ifElse      = require('gulp-if-else'),
    gulpif      = require('gulp-if'),
    fileinclude = require('gulp-file-include'),
    runSequence = require('run-sequence'),
    svgSprite = require('gulp-svg-sprite'),
    addsrc      = require('gulp-add-src'),
    wiredep     = require('wiredep').stream,
    php = require('gulp-connect-php'),
    app 		= 'app',
    server      = 'localhost',
    port   		= 9000,
    wip 		= '/full',
    proj 		= {
    	app: 'app',
        config: app + '/config',
        images: app + '/images',
        svg: app + '/images/svg',
        svg_sprite: '/images/svg_sprite.svg',
    	fonts: app + '/fonts',
    	php: app + '/php',
    	sass: app + '/sass',
    	js: app + '/js',
        json: app + '/json',
        page_templates: app + '/page_templates',
    	templates: app + '/templates',
    	gulptmp: 'gulptmp',
    	gulpdist: 'gulpdist',
        vendor: '/js/vendor',
        modernizr: '/modernizr.js',
        bower: 'bower_components'
    };

gulp.task('fileinclude', function () {
    return gulp.src([proj.page_templates + '/**/*.html'])
        .pipe($.plumber(function (error) {
            $.util.beep();
            $.util.log($.util.colors.red(error));
            this.emit('end');
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        /* disable for now, reserved for future use */
        /*.pipe(wiredep({
            directory: proj.bower,
            bowerJson: require('./bower.json'),
            ignorePath: /^(\.\.\/)*\.\./,
            exclude: ['jquery' ]
        })) */
        .pipe(gulpif(argv.deploy,
            gulp.dest(proj.gulpdist),
            gulp.dest(proj.gulptmp)
        ))
        .pipe($.size())
        .pipe(gulpif(!argv.deploy, $.livereload()))
});


gulp.task('jscs', function () {
     return gulp.src([proj.js + '/**/*.js',
        '!' + proj.js + '/vendor/**/*.js'
        ])
        .pipe($.jscs({
            fix: true
         }))
        .pipe($.notify({
            title: 'JSCS',
            message: 'JSCS Passed'
        }))
        .pipe(gulp.dest('app/scripts/'));
 });

/*
    https://github.com/linnovate/mean/blob/master/.jshintrc
*/
gulp.task('lint', function () {
    return gulp.src([proj.js + '/**/*.js',
            '!' + proj.vendor + '/**/*.js'
        ])
        .pipe($.plumber())
        .pipe($.jshint({
            globals: {
               console: true,
               jQuery: true,
               require: false
            },
            strict : true,
            sub: true,
            white: false,
            bitwise: true,
            curly: true,
            eqeqeq: true,
            latedef: true,
            forin: true,
            immed: true,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            regexp: true,
            trailing: true,
            undef: false,
            unused: false
        }))
        .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('browserify', function () {
    return gulp.src([
            proj.js + '/app.js',
            '!' + proj.vendor + '/**/*.js'
        ])
        //.pipe($.jshint())
        //.pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.browserify({
            transform: ['debowerify', hbsfy]
        }))
        .pipe(gulpif(argv.deploy, $.uglify()))
        .pipe($.rename({basename: 'bundle', extname: '.min.js'}))
        .pipe(gulpif(!argv.deploy, $.livereload()))
        .pipe(gulpif(argv.deploy,
            gulp.dest(proj.gulpdist + '/js'),
            gulp.dest(proj.gulptmp + '/js')
        ));
});

gulp.task('sass:develop', function () {
    gulp.src([
            proj.sass + '/**/*.scss',
            '!' + proj.sass + '/sprite/**/*.scss'
        ])
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 6,
            outputStyle: 'compact'
        }))
        .on("error", $.notify.onError(function (error) {
            return "Error: " + error.message;
         }))
        .pipe($.postcss([
            require('autoprefixer')({browsers: ['ie >= 9', 'last 2 version']})
        ]))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(proj.gulptmp + '/css'))
        .pipe($.size())
        .pipe(gulpif(!argv.deploy, $.livereload()))
});

gulp.task('sass:deploy', function () {
    gulp.src([proj.sass + '/**/*.scss'])
        .pipe($.sass({
            precision: 6,
            outputStyle: 'compressed'
        }))
        .pipe($.postcss([
            require('autoprefixer')({browsers: ['ie >= 9', 'last 2 version']})
        ]))
        .pipe(gulp.dest(proj.gulpdist + '/css'))
        .pipe($.size());
});

/* svg_sprite */
gulp.task('svg_sprite', function () {
    return gulp.src(proj.svg + '/**/*.svg')
        //.pipe($.svgo())
        .pipe(svgSprite({
            "mode": {
                "css": {
                    "spacing": {
                        "padding": 5
                    },
                    "dest": './',
                    "layout": "diagonal",
                    "sprite": ifElse(argv.deploy, 
                        function () { 
                            return proj.gulpdist + proj.svg_sprite;
                        },
                        function () { 
                           return proj.gulptmp + proj.svg_sprite;
                        }),
                    "bust": false,
                    "render": {
                        "scss": {
                            "dest": proj.sass + '/sprite/_svg_sprite.scss',
                            "template": proj.sass + "/sprite/_svg_template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest('./'));
});

/* svg2png */
gulp.task('svg2png', ['svg_sprite'], function () {
    var path = ifElse(argv.deploy,
        function () { 
           return proj.gulpdist;
        },
        function () { 
           return proj.gulptmp;
        });
    return gulp.src([
            path + proj.svg_sprite
        ])
        .pipe($.svg2png())
        .pipe(gulp.dest(path + '/images'));
});

/* spriteSmith */
gulp.task('png_sprite', function (cb) {
    // Generate our spritesheet
    var spriteData = gulp.src([
            proj.images  + '/*.png',
            '!' + proj.images + '/favicon.png',
            '!' + proj.images + '/header.png',,
            '!' + proj.svg + '/*.svg'
        ])
        .pipe($.spritesmith({
            imgName: '../images/png_sprite.png',
            cssName: '_png_sprite.scss',
            cssTemplate: proj.sass + '/handlebars/handlebarsInheritance.scss.handlebars'
        }));

    // Pipe image stream through image optimizer and onto disk
    spriteData.img
        .pipe($.imagemin())
        .pipe(gulpif(argv.deploy,
            gulp.dest(proj.gulpdist + '/images'),
            gulp.dest(proj.gulptmp + '/images')
        ));

    // Pipe CSS stream through CSS optimizer and onto disk
    spriteData.css
      //.pipe($.csso())
      .pipe(gulp.dest(proj.sass + '/sprite'))
      .on('end', cb);
});

gulp.task('assets_include', function () {
    return runSequence(
        //'sass:deploy', 
        'browserify',
        'fileinclude'
    );
});

gulp.task('copy_images', function () {
    return gulp.src([
            proj.images + '/**/*(*.jpg)',
            '!' + proj.svg + '/*.svg'
        ])
        .pipe(gulpif(argv.deploy,
            gulp.dest(proj.gulpdist + '/images'),
            gulp.dest(proj.gulptmp + '/images')
        ));
});

gulp.task('copy_php', function () {
    return gulp.src([
            proj.php + '/**/*.php'
        ])
        .pipe(gulpif(argv.deploy,
            gulp.dest(proj.gulpdist + '/php'),
            gulp.dest(proj.gulptmp + '/php')
        ));
});

gulp.task('copy_fonts', function () {
    return gulp.src([
            // bootstrap glyphicon
            //proj.bower + '/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular*(*.svg|*.eot|*.woff|*.woff2|*.ttf)'
            proj.fonts + '/glyphicons-regular*(*.svg|*.eot|*.woff|*.woff2|*.ttf)',
            proj.fonts + '/glyphicons-halflings-regular*(*.svg|*.eot|*.woff|*.woff2|*.ttf)'
        ])
        .pipe($.rename(function (path) {
            path.basename = 'glyphicons-regular';
        }))
        .pipe(gulpif(argv.deploy,
            gulp.dest(proj.gulpdist + '/fonts'),
            gulp.dest(proj.gulptmp + '/fonts')
        ));
});

gulp.task('copy_data', function () {
    gulp.src([
            proj.config + '/dot_htaccess'
        ])
        .pipe($.rename(function (path) {
            path.basename = '.htaccess';
        }))
        .pipe(gulpif(argv.deploy,
            gulp.dest(proj.gulpdist),
            gulp.dest(proj.gulptmp)
        ));
    return gulp.src([
            proj.json + '/**/*.json'
        ])
        .pipe(gulpif(argv.deploy,
            gulp.dest(proj.gulpdist + '/json'),
            gulp.dest(proj.gulptmp + '/json')
        ));
});
gulp.task('copy_vendor', function () {
    gulp.src([
            proj.bower + '/bootstrap/dist/css/bootstrap.css',
            proj.bower + '/jquery-ui/themes/base/jquery-ui.css'
        ])
        .pipe($.rename(function (path) {
            path.basename = '_' + path.basename;
            path.extname = '.scss';
        }))
        .pipe(gulp.dest(proj.sass + '/vendor'));
});

gulp.task('php', function() {
    php.server({
        port: 1234,
        base: proj.php
    });
});

gulp.task('server', function () {
    
    var path = ifElse(argv.deploy,
        function () { 
           return proj.gulpdist + '/';
        },
        function () { 
           return proj.gulptmp + '/';
        });

    $.connect.server({
    	root: path,
    	port: port,
    	livereload: true
    });

    require('opn')('http://' + server + ':' + port + wip);
});

/*
    UPDATE Modernizr
    - bower update modernizr
    - gulp custom-modernizr

*/
gulp.task('assets:modernizr', function() {
  return gulp.src([
    proj.gulpdist + '/css/app.css',
    proj.gulpdist + '/js/bundle.min.js'
  ]).pipe(
      $.modernizr({
        options: [
          'addTest',                   /* Add custom tests */
          'fnBind',                    /* Use function.bind */
          'html5printshiv',            /* HTML5 support for IE */
          'setClasses',                /* Add CSS classes to root tag */
          'testProp'                   /* Test for properties */
        ]
      }))
    .pipe(addsrc.append(proj.bower + '/respond/dest/respond.src.js'))
    .pipe($.concat('modernizr.js'))
    .pipe(gulpif(argv.deploy, $.uglify()))
    .pipe(gulpif(argv.deploy,
        gulp.dest(proj.gulpdist + proj.vendor), 
        gulp.dest(proj.gulptmp + proj.vendor)
    ));
});

gulp.task('wiredep', function () {
    gulp.src([
        app + proj.vendor + '/codyhouse-modernizr.js'
    ])
    .pipe($.rename(function (path) {
        path.basename = 'modernizr';
    }))
    .pipe(gulpif(argv.deploy,
        gulp.dest(proj.gulpdist + proj.vendor), 
        gulp.dest(proj.gulptmp + proj.vendor)
    ));
});

gulp.task('build', function () {
    return gulp.src('')
        .pipe($.shell([
            'gulp wiredep --deploy',
            'gulp copy_data --deploy',
            'gulp copy_php --deploy',
            'gulp copy_images --deploy',
            'gulp copy_fonts --deploy',
            'gulp browserify --deploy',
            'gulp fileinclude --deploy',
            'gulp sass:deploy'
        ], {
            maxBuffer: 4000
        }));
});

gulp.task('watch', ['wiredep', 'copy_php', 'copy_data', 'copy_images', 'png_sprite', 'copy_fonts', 'browserify', 'fileinclude', 'sass:develop'], function () {


    $.livereload.listen();

    gulp.watch([proj.page_templates + '/**/*.html'], ['fileinclude']);
    gulp.watch([proj.templates + '/**/*.hbs'], ['browserify']);
    gulp.watch([proj.sass + '/**/*.scss'], ['sass:develop']);
    gulp.watch([proj.js + '/**/*.js'], ['browserify']);
    gulp.watch([proj.php + '/**/*.php'], ['copy_php']);
    gulp.watch([proj.images + '/**', '!' + proj.images + '/svg/*.svg'], ['png_sprite', 'copy_images']);

});

gulp.task('clean', del.bind(null, [proj.gulptmp, proj.gulpdist]));