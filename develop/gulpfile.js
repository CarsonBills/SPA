    'use strict';

var gulp = require('gulp'),
	// gulp shorthand
    $           = require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    requireDir  = require( 'require-dir' ),
    del   		= require('del'),
    argv        = require('yargs').argv,
    hbsfy       = require('browserify-handlebars'),
    buffer      = require('vinyl-buffer'),
    merge = require('merge-stream'),
    ifElse      = require('gulp-if-else'),
    gulpif      = require('gulp-if'),
    fileinclude = require('gulp-file-include'),
    htmlreplace = require('gulp-html-replace'),
    modifyCssUrls = require('gulp-modify-css-urls'),
    spritesmith = require('gulp.spritesmith'),
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
    CF_APP_URL = "//d2ybxpb8b9c7qj.cloudfront.net/",
    CF_ASSETS_URL = "//dk93p46l5vp3c.cloudfront.net/",
    awsHeaders = {'x-amz-acl': 'public-read'},

    settings 		= {
        modernizr: '/modernizr.js',
        bower: 'bower_components/',
        app_css: 'app.css',
        app_js: 'bundle.min.js',
        app_config: '/config/',
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
        js_inline: '/js/inline/',
        hbs_inline: '/templates/partials/inline/',
        js_dynamic: '/js/dynamic/',
        js_logger: '/js/logger/',
        js_vendor: '/js/vendor/',
        json: '/json/',
        site_assets: '/site_assets/',
        svg: '/images/svg/',
        sprite: '/sprite/',
        svg_sprite: '/images/svg_sprite.svg',
        prod: '_prod',
        qa: '_qa',
        dev: '_dev'
    };


function getHTMLAssets(path) {
    return {
        css: {
            src: path +'/css/app' + getVersionNumber() + '.css',
            tpl: '<link rel="stylesheet" href="%s">'
        },
        js: {
            src: [
                "//dsbst55b1909i.cloudfront.net/player/js/vendor/jwplayer.js",
                path + '/js/bundle' + getVersionNumber() + '.min.js'
            ],
            tpl: '<script src="%s"></script>'
        }/*,
        icon: {
            src: [path + '/images/favicon.png'],
            tpl: '<link rel="icon" type="image/png" href="%s">'
        }*/
    }
}

function getVersionNumber() {
    var json = JSON.parse(fs.readFileSync('./package.json'));
    return '_' + json[site + 'Version'];
}

function getVersion (version) {
    var result;

    if (version === 'qa' || version === 'prod') {
        result = '_' + version;
    } else {
        result = settings.dev;
    }
    return result;
}

function isProd() {
    return process.env.VERSION === 'prod';
}

function isDev() {
    return getVersion() === settings.dev;
}

var site = process.env.SITE || 'iig',
    version = getVersion(process.env.VERSION);


gulp.task('echo', function () {
    console.log(getVersion(process.env.VERSION));
});

gulp.task('fileinclude', function () {
    var assets;
    if (isProd()) {
        assets = getHTMLAssets(CF_APP_URL + site);
    } else {
        assets = getHTMLAssets('');
    } 

    return gulp.src([
            app + site + settings.page_templates + 'index.html',
            app + site + settings.page_templates + 'errors.html'
        ])
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
        .pipe(gulp.dest(deploy + site + version))
        .pipe($.size())
        .pipe($.notify({
            message: 'site: ' + site + ' fileinclude done'
        }))
        .pipe(gulpif(isDev(), $.livereload()))
});

gulp.task('sass:develop', function () {
    var f = $.filter(['app.*'], {restore: true});
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
        .pipe(f)
        .pipe($.rename({basename: 'app' + getVersionNumber(), extname: '.css'}))
        .pipe(f.restore)
        .pipe(gulp.dest(deploy + site + settings.dev + settings.css))
        .pipe($.notify({
            message: 'site: ' + site + ' Sass:Develop done'
        }))
        .pipe($.size())
        .pipe($.livereload())
});

gulp.task('sass:production', function () {
    var f = $.filter(['app.*'], {restore: true});
    gulp.src([
            app + site + settings.sass + '**/*.scss',
            '!' + app + site + settings.sass_sprite + '**/*.scss'
        ])
        .pipe($.sass({
            precision: 6,
            outputStyle: 'compact'
        }))
        .pipe(gulpif(isProd(), modifyCssUrls({
            modify: function (url, filePath) {
                return site + url;
            },
            prepend: CF_APP_URL
        })))
        .pipe($.postcss([
            require('autoprefixer')({browsers: ['ie >= 9', 'last 2 version']})
        ]))
        //.pipe(minifyCss({keepBreaks: true}))

        .pipe(f)
        .pipe($.rename({basename: 'app' + getVersionNumber(), extname: '.css'}))
        .pipe(f.restore)
        .pipe(gulp.dest(deploy + site + version + settings.css))
        .pipe($.size());
});

/* spriteSmith */
gulp.task('png_sprite', function () {
    // Generate our spritesheet
    var images = app + site + settings.images;
    
    var spriteData = gulp.src([
            images  + '*.png',
            '!' + images + 'favicon.png',
            '!' + images + 'header.png',
            '!' + images + 'header_pattern.png'
        ]) 
        .pipe(spritesmith({
            imgName: 'png_sprite.png',
            imgPath: '/images/png_sprite.png',
            cssName: '_png_sprite.scss',
            cssTemplate: app + site + settings.sass + 'handlebars/handlebarsInheritance.scss.handlebars'
        }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe($.imagemin())
        .pipe(gulp.dest(deploy + site + version + settings.images))
        .pipe($.size());

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
      //.pipe($.csso())
      .pipe(gulp.dest(app + site + settings.sass + settings.sprite));

    return merge(imgStream, cssStream);
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
                    "sprite":  deploy + site + version + settings.svg_sprite,
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
    var path = deploy + site + version;
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
        .pipe(gulp.dest(deploy + site + version + settings.images));
});

gulp.task('copy_php', function () {
    return gulp.src([
            settings.app_php + '**/*.php'
        ])
        .pipe(gulp.dest(deploy + site + version + settings.php));
});

gulp.task('copy_assets', function () {
    return gulp.src([
            app + site + settings.site_assets + '**/*'
        ])
        .pipe(gulp.dest(deploy + site + version + settings.site_assets));
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
        .pipe(gulp.dest(deploy + site + version + settings.fonts));
});

gulp.task('copy_data', function () {
    gulp.src([
            app + site + settings.app_config + 'dot_htaccess'
        ])
        .pipe($.rename(function (path) {
            path.basename = '.htaccess';
        }))
        .pipe(gulp.dest(deploy + site + version));
    return gulp.src([
            app + site + settings.json + '**/*.json'
        ])
        .pipe(gulp.dest(deploy + site + version + settings.json));
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
    /*.pipe($.rename(function (path) {
        path.basename = 'modernizr';
    }))*/
    .pipe(gulp.dest(deploy + site + version + settings.js_vendor));
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
            /*'testProp',
            'testStyles',
            'setClasses',*/
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

gulp.task('inline', function () {
    return gulp.src([app + site + settings.js_inline + '**/*.js'])
        .pipe($.browserify({
            insertGlobals : false,
            debug : false,
            transform: [hbsfy]
        }))
        /*.pipe($.uglify({
            //mangle: false
        }))*/
        .pipe($.rename({extname: '.hbs'}))
        .pipe(gulp.dest(app + site + settings.hbs_inline))
        .pipe($.notify("Inline Script Task Completed!"));
});

gulp.task('browserify', function () {
    var logger = ifElse(isProd(),
        function () { 
           return 'production.js';
        },
        function () { 
           return 'develop.js';
        });
    // copy constants
    gulp.src([
            app + site + settings.js_dynamic + 'constants' + version + '*.js'
        ])
        .pipe($.rename(function (path) {
            path.basename = 'constants';
        }))
        .pipe(gulp.dest(app + site + settings.js_dynamic));

    return gulp.src([
            app + site + settings.js + 'app.js',
            '!' + app + site + settings.js_vendor + '**/*.js'
        ])
        //.pipe($.jshint())
        //.pipe($.jshint.reporter('jshint-stylish'))
        /* Injecet Logger */
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
            transform: ['debowerify', hbsfy],
            debug: isDev()
        }))
        .pipe(gulpif(isProd(), $.uglify()))
        .pipe($.rename({basename: 'bundle' + getVersionNumber(), extname: '.min.js'}))
        .pipe(gulpif(isDev(), $.livereload()))

        .pipe($.notify({
            message: 'site: ' + site + ' Browserify done'
        }))
        .pipe(gulp.dest(deploy + site + version + settings.js));
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
        .pipe(gulp.dest(deploy + site + version + settings.js));
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
            'gulp wiredep',
            'gulp copy_data',
            'gulp png_sprite',
            'gulp svg2png',
            'gulp copy_images',
            'gulp copy_fonts',
            'gulp copy_assets',
            'gulp inline',
            'gulp browserify',
            'gulp fileinclude',
            'gulp sass:production'
        ], {
            maxBuffer: 4000
        }));
});

gulp.task('watch', ['wiredep', 'copy_data', 'copy_images', 'png_sprite', 'svg2png', 'copy_assets', 'copy_fonts', 'inline', 'browserify', 'fileinclude', 'sass:develop'], function (e) {

    $.livereload.listen();

    gulp.watch([app + site + settings.page_templates + '**/*.html'], ['fileinclude']);
    gulp.watch([app + site + settings.templates + '**/*'], ['browserify']);
    gulp.watch([app + site + settings.sass + '**/*.scss'], ['sass:develop']);
    gulp.watch([app + site + settings.js_inject + '**/*.js'], ['browserify']);
    gulp.watch([app + site + settings.site_assets + '**/*'], ['copy_assets']);
    gulp.watch([
        app + site + settings.js + '**/*.js',
        '!' + app + site + settings.js_inline + '**/*.js'
    ], ['browserify']);
    gulp.watch([app + site + settings.js_inline + '**/*.js'], ['inline']);
    gulp.watch([app + site + settings.php + '**/*.php'], ['copy_php']);
    gulp.watch([app + site + settings.images + '**', '!' + settings.svg + '*.svg'], ['png_sprite', 'copy_images']);

});

gulp.task('clean', del.bind(null, [deploy + 'iig_dev/*', deploy + 'nr_dev/*', deploy + '*_prod', deploy + '*_qa']));

gulp.task('default', function () {
    console.log("## Norton Reader ##");
    console.log("SITE=nr gulp watch");
    console.log("SITE=nr gulp build");
    console.log("## IIG ##");
    console.log("SITE=iig gulp watch");
    console.log("SITE=iig gulp build");
});

gulp.task('upload:s3', [], function() {
    var nortonreaderassets = JSON.parse(fs.readFileSync('/Volumes/wwn_vault/nortonreaderassets.json')),
    nortonappreaderiig = JSON.parse(fs.readFileSync('/Volumes/wwn_vault/nortonappreaderiig.json'));

    if (argv.siteAssets) {
        return gulp.src([

            deploy + 'iig' + settings.prod + '/**',
            '!' + deploy + 'iig' + settings.prod + '/*.html',
            '!' + deploy + 'iig' + settings.prod + settings.css + '/app.css',
            '!' + deploy + 'iig' + settings.prod + settings.fonts + '**',
            '!' + deploy + 'iig' + settings.prod + settings.images + '**',
            '!' + deploy + 'iig' + settings.prod + settings.js + '**',
            '!' + deploy + 'iig' + settings.prod + settings.php + '**',
        ])
        .pipe($.s3(nortonappreaderiig, {
            uploadPath: '/' + 'iig' + '/',
            headers: awsHeaders
        }));

    }
    // use 'gulp --select' to upload only the srouces here 
    if (argv.select) {
        return gulp.src([

            deploy + site + settings.prod + '/**',
            '!' + deploy + site + settings.prod + '/*.html',
            '!' + deploy + site + settings.prod + settings.fonts + '**',
            '!' + deploy + site + settings.prod + settings.json + '**',
            '!' + deploy + site + settings.prod + settings.php + '**',
            '!' + deploy + site + settings.prod + settings.images + '**',
            '!' + deploy + site + settings.prod + settings.css + 'sites/**',
            '!' + deploy + site + settings.prod + settings.site_assets + '**'
        ])
        .pipe($.s3(nortonappreaderiig, {
            uploadPath: '/' + site + '/',
            headers: awsHeaders
        }));
    }

    gulp.src([
        deploy + site + settings.prod + '/**',
        '!' + deploy + site + settings.prod + '/*.html',
        '!' + deploy + site + settings.prod + settings.json + '**',
        '!' + deploy + site + settings.prod + settings.php + '**',
        '!' + deploy + site + settings.prod + settings.images + 'intro_bg.jpg',
        '!' + deploy + site + settings.prod + settings.images + 'header*.jpg'
    ])
    .pipe($.s3(nortonappreaderiig, {
        uploadPath: '/' + site + '/',
        headers: awsHeaders
    }));
    gulp.src([
        deploy + site + settings.prod + settings.images + 'intro_bg.jpg',
        deploy + site + settings.prod + settings.images + 'header*.jpg'
    ])
    .pipe($.s3(nortonreaderassets, {
        uploadPath: '/images/',
        headers: awsHeaders
    }));
});

