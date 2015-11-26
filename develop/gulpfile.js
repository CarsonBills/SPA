'use strict';

var gulp = require('gulp'),
	// gulp shorthand
    $ 			= require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    requireDir  = require( 'require-dir' ),
    del   		= require('del'),
    argv        = require('yargs').argv,
    hbsfy       = require('browserify-handlebars'),
    ifElse      = require('gulp-if-else'),
    gulpif      = require('gulp-if'),
    fileinclude = require('gulp-file-include'),
    htmlreplace = require('gulp-html-replace'),
    modifyCssUrls = require('gulp-modify-css-urls'),
    runSequence = require('run-sequence'),
    svgSprite = require('gulp-svg-sprite'),
    addsrc      = require('gulp-add-src'),
    wiredep     = require('wiredep').stream,
    php = require('gulp-connect-php'),
    server      = 'localhost',
    port   		= 9000,
    app         = 'app_',
    deploy      = 'deploy/',
    app_nr      = 'nr',
    app_iig     = 'iig',
    wip 		= '/full',

    fs = require('fs'),
    s3 = require('gulp-s3'),
    CF_APP_URL = "http://d2ybxpb8b9c7qj.cloudfront.net/",
    CF_ASSETS_URL = "http://dk93p46l5vp3c.cloudfront.net/",
    awsHeaders = {'x-amz-acl': 'public-read'},

    settings 		= {
        modernizr: '/modernizr.js',
        bower: 'bower_components/',
        app_css: 'app.css',
        app_js: 'bundle.min.js',
        app_config: app + app_nr + '/config/',
        app_fonts: app + app_nr + '/fonts/',
        app_php: app + app_nr + '/php/',
        app_js_vendor: app + app_nr + '/js/vendor/',

        vendor: '/vendor/',
        page_templates: '/page_templates/',
        templates: '/templates/',
        sass: '/sass/',
        sass_sprite: '/sass/sprite/',
        images: '/images/',
        fonts: '/fonts/',
        php: '/php/',
        css: '/css/',
        js: '/js/',
        js_logger: '/js/logger/',
        js_vendor: '/js/vendor/',
        json: '/json/',
        svg: '/images/svg/',
        sprite: '/sprite/',
        svg_sprite: '/images/svg_sprite.svg',
        prod: '_prod',
        dev: '_dev'
    };



var site = process.env.SITE || 'iig';

function getHTMLAssets(path) {
    return {
        css: {
            src: path +'/css/app.css',
            tpl: '<link rel="stylesheet" href="%s">'
        },
        js: {
            src: [path + '/js/vendor/modernizr.js', path + '/js/bundle.min.js'],
            tpl: '<script src="%s"></script>'
        },
        icon: {
            src: [path + '/images/favicon.png'],
            tpl: '<link rel="icon" type="image/png" href="%s">'
        }
    }
}

gulp.task('fileinclude', function () {
    var assets = ifElse(argv.prod,
        function () { 
            return getHTMLAssets(CF_APP_URL + site);
        },
        function () { 
           return getHTMLAssets('');
        });

    return gulp.src([app + site +  settings.page_templates + 'index.html'])
        .pipe($.plumber(function (error) {
            $.util.beep();
            $.util.log($.util.colors.red(error));
            this.emit('end');
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlreplace(assets))
        .pipe(gulpif(argv.prod,
            gulp.dest(deploy + site + settings.prod),
            gulp.dest(deploy + site + settings.dev)
        ))
        .pipe($.size())
        .pipe($.notify({
            message: 'site: ' + site + ' fileinclude done'
        }))
        .pipe(gulpif(!argv.prod, $.livereload()))
});

gulp.task('sass:develop', function () {
    gulp.src([
            app + site + settings.sass + '**/*.scss',
            '!' + app + site + settings.sass_sprite + '**/*.scss'
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
        .pipe(gulp.dest(deploy + site + settings.dev + settings.css))
        .pipe($.notify({
            message: 'site: ' + site + ' Sass:Develop done'
        }))
        .pipe($.size())
        .pipe(gulpif(!argv.prod, $.livereload()))
});

gulp.task('sass:production', function () {
    gulp.src([app + site + settings.sass + '**/*.scss'])
        .pipe($.sass({
            precision: 6,
            outputStyle: 'compact'
        }))
        .pipe(modifyCssUrls({
            modify: function (url, filePath) {
                return site + url;
            },
            prepend: CF_APP_URL
        }))
        .pipe($.postcss([
            require('autoprefixer')({browsers: ['ie >= 9', 'last 2 version']})
        ]))
        .pipe($.csso())
        .pipe(gulp.dest(deploy + site + settings.prod + settings.css))
        .pipe($.size());
});

/* spriteSmith */
gulp.task('png_sprite', function (cb) {
    // Generate our spritesheet

    var images = app + site + settings.images,
        spriteData = gulp.src([
            images  + '/*.png',
            '!' + images + 'favicon.png',
            '!' + images + 'header.png',
            '!' + images + 'header_pattern.png',
            '!' + app + site + settings.svg + '*.svg'
        ])
        .pipe($.spritesmith({
            imgName: '/images/png_sprite.png',
            cssName: '_png_sprite.scss',
            cssTemplate: app + site + settings.sass + 'handlebars/handlebarsInheritance.scss.handlebars'
        }));

    // Pipe image stream through image optimizer and onto disk
    spriteData.img
        .pipe($.imagemin())
        .pipe(gulpif(argv.prod,
            gulp.dest(deploy + site + settings.prod + settings.images),
            gulp.dest(deploy + site + settings.dev + settings.images)
        ));

    // Pipe CSS stream through CSS optimizer and onto disk
    spriteData.css
      //.pipe($.csso())
      .pipe(gulp.dest(app + site + settings.sass + settings.sprite))
      .on('end', cb);
});

/* svg_sprite */
gulp.task('svg_sprite', function () {
    return gulp.src(app + site + settings.svg + '**/*.svg')
        //.pipe($.svgo())
        .pipe(svgSprite({
            "mode": {
                "css": {
                    "spacing": {
                        "padding": 5
                    },
                    "dest": './',
                    "layout": "diagonal",
                    "sprite": ifElse(argv.prod, 
                        function () { 
                            return deploy + site + settings.prod + settings.svg_sprite;
                        },
                        function () { 
                            return deploy + site + settings.dev + settings.svg_sprite;
                        }),
                    "bust": false,
                    "render": {
                        "scss": {
                            "dest": app + site + settings.sass_sprite + '_svg_sprite.scss',
                            "template": app + site + settings.sass_sprite +  "_svg_template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest('./'));
});

/* svg2png */
gulp.task('svg2png', ['svg_sprite'], function () {
    var path = ifElse(argv.prod,
        function () { 
           return deploy + site + settings.prod;
        },
        function () { 
           return deploy + site + settings.dev;
        });
    return gulp.src([
            path + settings.svg_sprite
        ])
        .pipe($.svg2png())
        .pipe(gulp.dest(path + settings.images));
});

gulp.task('copy_images', function () {
    var images = app + site + settings.images,
        svg = app + site + settings.svg;

    return gulp.src([
            images + '**/*(*.jpg)',
            images + 'favicon.png',
            images + 'header_pattern.png',
            '!' + svg + '*.svg'
        ])
        .pipe(gulpif(argv.prod,
            gulp.dest(deploy + site + settings.prod + settings.images),
            gulp.dest(deploy + site + settings.dev + settings.images)   
        ));
});

gulp.task('copy_php', function () {
    return gulp.src([
            settings.app_php + '**/*.php'
        ])
        .pipe(gulpif(argv.prod,
            gulp.dest(deploy + site + settings.prod + settings.php),
            gulp.dest(deploy + site + settings.dev + settings.php)   
        ));
});

gulp.task('copy_fonts', function () {
    return gulp.src([
            // bootstrap glyphicon
            //proj.bower + '/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular*(*.svg|*.eot|*.woff|*.woff2|*.ttf)'
            settings.app_fonts + 'glyphicons-regular*(*.svg|*.eot|*.woff|*.woff2|*.ttf)',
            settings.app_fonts + 'glyphicons-halflings-regular*(*.svg|*.eot|*.woff|*.woff2|*.ttf)'
        ])
        .pipe($.rename(function (path) {
            path.basename = 'glyphicons-regular';
        }))
        .pipe(gulpif(argv.prod,
            gulp.dest(deploy + site + settings.prod + settings.fonts),
            gulp.dest(deploy + site + settings.dev + settings.fonts) 
        ));
});

gulp.task('copy_data', function () {
    gulp.src([
            settings.app_config + 'dot_htaccess'
        ])
        .pipe($.rename(function (path) {
            path.basename = '.htaccess';
        }))
        .pipe(gulpif(argv.prod,
            gulp.dest(deploy + site + settings.prod),
            gulp.dest(deploy + site + settings.dev) 
        ));
    return gulp.src([
            app + site + settings.json + '**/*.json'
        ])
        .pipe(gulpif(argv.prod,
            gulp.dest(deploy + site + settings.prod + settings.json),
            gulp.dest(deploy + site + settings.dev + settings.json) 
        ));
});

gulp.task('copy_vendor', function () {
    gulp.src([
            settings.bower + 'bootstrap/dist/css/bootstrap.css',
            settings.bower + 'jquery-ui/themes/base/jquery-ui.css'
        ])
        .pipe($.rename(function (path) {
            path.basename = '_' + path.basename;
            path.extname = '.scss';
        }))
        .pipe(gulp.dest(app + site + settings.sass + settings.vendor));
});

gulp.task('wiredep', function () {
    gulp.src([
        //settings.app_js_vendor + 'codyhouse-modernizr.js'
        //settings.app_js_vendor + 'modernizr-custom.min.js'
        app + site + settings.js_vendor + 'modernizr.js'
    ])
    .pipe($.rename(function (path) {
        path.basename = 'modernizr';
    }))
    .pipe(gulpif(argv.prod,
        gulp.dest(deploy + site + settings.prod + settings.js_vendor),
        gulp.dest(deploy + site + settings.dev + settings.js_vendor) 
    ));
});

/*
    UPDATE Modernizr
    - bower update modernizr
    - gulp customize:modernizr
    - 
*/
gulp.task('customize:modernizr', function() {
    return gulp.src([
        deploy + site + settings.dev + settings.css + settings.app_css,
        deploy + site + settings.dev + settings.js + settings.app_js
    ]).pipe(
        $.modernizr({
        options: [
            'prefixes',
            'hasEvent',
            'mq',
            'testProp',
            'testStyles',
            'setClasses',
            'addTest',
            'html5printshiv'
        ],
        excludeTests: [
            'hidden'
        ],
        tests : [
            'blobconstructor',
            'localstorage',
            'csstransforms',
            'csstransforms3d',
            'preserve3d'
        ]})
    )
    //.pipe(addsrc.append(settings.bower + '/respond/dest/respond.src.js'))
    .pipe($.concat('modernizr.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(app + site + settings.js_vendor));
});

gulp.task('browserify', function () {
    var logger = ifElse(argv.prod,
        function () { 
           return 'production.js';
        },
        function () { 
           return 'develop.js';
        });
    return gulp.src([
            app + site + settings.js + 'app.js',
            '!' + app + site + settings.js_vendor + '**/*.js'
        ])
        //.pipe($.jshint())
        //.pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.inject(
            gulp.src([app + site + settings.js_logger + logger], {read: true}), {
                transform: function (filepath, file) {
                    return file.contents.toString('utf8');
                },
                starttag: '/* inject:logger */',
                endtag: '/* endinject */',
                removeTags: true
            }
        ))
        .pipe($.browserify({
            transform: ['debowerify', hbsfy]
        }))
        .pipe(gulpif(argv.prod, $.uglify()))
        .pipe($.rename({basename: 'bundle', extname: '.min.js'}))
        .pipe(gulpif(!argv.prod, $.livereload()))

        .pipe($.notify({
            message: 'site: ' + site + ' Browserify done'
        }))
        .pipe(gulpif(argv.prod,
            gulp.dest(deploy + site + settings.prod + settings.js),
            gulp.dest(deploy + site + settings.dev + settings.js) 
        ));
});


gulp.task('jscs', function () {
    return gulp.src([app + site + settings.js + '**/*.js',
            '!' + app + site + settings.js_vendor + '**/*.js'
        ])
        .pipe($.jscs({
            fix: true
         }))
        .pipe($.notify({
            title: 'JSCS',
            message: 'JSCS Passed'
        }))
        .pipe(gulpif(argv.prod,
            gulp.dest(deploy + site + settings.prod + settings.js),
            gulp.dest(deploy + site + settings.dev + settings.js) 
        ));
 });

/*
    https://github.com/linnovate/mean/blob/master/.jshintrc
*/
gulp.task('lint', function () {

    return gulp.src([app + site + settings.js + '**/*.js',
            '!' + app + site + settings.js_vendor + '**/*.js'
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

gulp.task('php', function() {
    php.server({
        port: 1234,
        base: app + site + settings.php
    });
});

gulp.task('server', function () {
    
    var path = ifElse(argv.prod,
        function () { 
           return deploy + site + settings.prod + '/';
        },
        function () { 
           return deploy + site + settings.dev + '/';
        });

    $.connect.server({
    	root: path,
    	port: port,
    	livereload: true
    });

    require('opn')('http://' + server + ':' + port + wip);
});

gulp.task('build', function () {
    return gulp.src('')
        .pipe($.shell([
            'gulp wiredep --prod',
            'gulp copy_data --prod',
            'gulp copy_php --prod',
            'gulp svg2png --prod',
            'gulp copy_images --prod',
            'gulp copy_fonts --prod',
            'gulp browserify --prod',
            'gulp fileinclude --prod',
            'gulp sass:production'
        ], {
            maxBuffer: 4000
        }));
});

gulp.task('watch', ['wiredep', 'copy_php', 'copy_data', 'copy_images', 'png_sprite', 'svg2png', 'copy_fonts', 'browserify', 'fileinclude', 'sass:develop'], function (e) {

    $.livereload.listen();

    gulp.watch([app + site + settings.page_templates + '**/*.html'], ['fileinclude']);
    gulp.watch([app + site + settings.templates + '**/*.hbs'], ['browserify']);
    gulp.watch([app + site + settings.sass + '**/*.scss'], ['sass:develop']);
    gulp.watch([app + site + settings.js_inject + '**/*.js'], ['browserify']);
    gulp.watch([app + site + settings.js + '**/*.js'], ['browserify']);
    gulp.watch([app + site + settings.php + '**/*.php'], ['copy_php']);
    gulp.watch([app + site + settings.images + '**', '!' + settings.svg + '*.svg'], ['png_sprite', 'copy_images']);

});

gulp.task('clean', del.bind(null, [deploy + 'iig_dev/*', deploy + 'iig_prod/*', deploy + 'nr_dev/*', deploy + 'nr_prod/*']));

gulp.task('default', function () {
    console.log("## Norton Reader ##");
    console.log("SITE=nr gulp watch");
    console.log("SITE=nr gulp build");
    console.log("## IIG ##");
    console.log("SITE=iig gulp watch");
    console.log("SITE=iig gulp build");
});

gulp.task('upload:nr_s3', [], function() {
    var nortonreaderassets = JSON.parse(fs.readFileSync('/Volumes/wwn_vault/nortonreaderassets.json')),
    nortonappreaderiig = JSON.parse(fs.readFileSync('/Volumes/wwn_vault/nortonappreaderiig.json')),
    NR = 'nr';

    // use 'gulp --select' to upload only the srouces here 
    if (argv.select) {
        return gulp.src([

            deploy + NR + settings.prod + '/**',
            '!' + deploy + NR + settings.prod + '/index.html',
            '!' + deploy + NR + settings.prod + settings.fonts + '**',
            '!' + deploy + NR + settings.prod + settings.json + '**',
            '!' + deploy + NR + settings.prod + settings.php + '**',
            '!' + deploy + NR + settings.prod + settings.images + '**'
        ])
        .pipe($.s3(nortonappreaderiig, {
            uploadPath: "/nr/",
            headers: awsHeaders
        }));
    }

    gulp.src([
        deploy + NR + settings.prod + '/**',
        '!' + deploy + NR + settings.prod + '/index.html',
        '!' + deploy + NR + settings.prod + settings.json + '**',
        '!' + deploy + NR + settings.prod + settings.php + '**',
        '!' + deploy + NR + settings.prod + settings.images + 'intro_bg.jpg',
        '!' + deploy + NR + settings.prod + settings.images + 'header*.jpg'
    ])
    .pipe($.s3(nortonappreaderiig, {
        uploadPath: "/nr/",
        headers: awsHeaders
    }));
    gulp.src([
        deploy + NR + settings.prod + settings.images + 'intro_bg.jpg',
        deploy + NR + settings.prod + settings.images + 'header*.jpg'
    ])
    .pipe($.s3(nortonreaderassets, {
        uploadPath: "/images/",
        headers: awsHeaders
    }));
});

