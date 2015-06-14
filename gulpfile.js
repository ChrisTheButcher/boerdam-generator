/// <reference path="bower_components/ngstorage/ngStorage.js" />
/// <binding />
/// <vs SolutionOpened='default' />
/// <reference path="Assets/vendors/angular-i18n/angular-locale_nl-nl.js" />

// Require
var gulp = require('gulp'),
del = require('del'),
browserSync = require('browser-sync'),
pngquant = require('imagemin-pngquant'),
$ = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
})

// Config
prefixOptions = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
onError = function (err) {
    $.util.log($.util.colors.green(err));
    this.emit('end'); //continue the process in watch
};
paths = {
    bower: './bower_components',
    node: './node_modules',
    src: './Assets/src',
    dist: './Assets/dist'
};

// Initialize NPM and Bower
gulp.task('init', function () {
    return gulp.src(['./bower.json', './package.json']).pipe($.install());
});

// Browser sync server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Concatenate JS-files
gulp.task('concatJs.vendor', [], function () {
    return gulp.src([
        paths.bower + '/angular/angular.js'
    ])
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest(paths.dist + '/Js'))
});

gulp.task('concatJs.main', [], function () {
    return gulp.src([
        paths.src + '/Js/app.js',
        paths.src + '/Js/controllers/*.js'
    ])
    .pipe($.concat('main.js'))
    .pipe(gulp.dest(paths.dist + '/Js'))
});

// Scripts minify pipings
var processMinifyJS = function (src, name) {
    return gulp.src(src)
        .pipe($.uglify({ mangle: false })).on('error', function (e) {
            console.log(e.message);
        })
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dist + '/Js/'))
        .pipe($.notify({ message: 'Updated ' + name + '.min.js' }))
        .pipe(browserSync.reload({ stream: true }));
};

// Scripts minify
gulp.task('minifyJs.vendor', ['concatJs.vendor'], function () {
    return processMinifyJS(paths.dist + '/Js/vendor.js', 'vendor');
});

gulp.task('minifyJs.main', ['concatJs.main'], function () {
    return processMinifyJS(paths.dist + '/Js/main.js', 'main');
});

// Test Javascript files
gulp.task('test', function () {
    return gulp.src('Assets/src/Js/**/*.js')
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.plumber.stop());
});

// Scipts task
gulp.task('scripts', ['minifyJs.vendor', 'minifyJs.main']);

var stylesStream = function (source, name) {
    return gulp.src(source)
        .pipe($.sass().on('error', onError))
        .pipe($.sourcemaps.init())
        //.pipe($.autoprefixer(prefixOptions))
        .pipe($.combineMediaQueries()) // Combine media queries
        .pipe($.rename({ basename: name, suffix: '.min' }))
        .pipe($.importCss({ extensions: ["!sass", "!scss"] })) // parse css import directives and insert 
        .pipe($.csso()) // minify
        .pipe($.sourcemaps.write('/Maps'), { sourceMappingURLPrefix: paths.dist + '/Css' })
        .pipe(gulp.dest(paths.dist + '/Css/'))
        .pipe($.filter('*.css'))
        .pipe($.notify({  message: 'Updated ' + name + '.min.css', onLast: true }))
        .pipe($.size())
        .pipe(browserSync.reload({ stream: true }))
};

gulp.task('styles.vendor', function () {
    return stylesStream(paths.src + '/Sass/vendor.scss', 'vendor');
});

gulp.task('styles.main', function () {
    return stylesStream(paths.src + '/Sass/main.scss', 'main');
});

// styles
gulp.task('styles', ['styles.vendor', 'styles.main']);

// Images
gulp.task('images', function () {
    return gulp.src(paths.src + '/Img/*')
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.dist + '/Img/'))
});

//Watch files
gulp.task('watch', function () {
    // Sass
    gulp.watch([
        paths.src + '/Sass/vendor.scss',
        paths.src + '/Sass/vendor/**/*.scss'
    ], ['styles.vendor']);
    gulp.watch([
        paths.src + '/Sass/**/*.scss',
        '!' + paths.src + '/Sass/vendor.scss',
        '!' + paths.src + '/Sass/vendor/**/*.scss'
    ], ['styles.main']);

    // Scripts
    gulp.watch(paths.bower + '/**/*.js', ['minifyJs.vendor']);
    gulp.watch(paths.src + '/Js/**/*.js', ['minifyJs.main']);
    gulp.watch(paths.src + '/Img/*', ['images']);

    console.log('Watching files, waiting for changes...');
});

//Clean
gulp.task('clean', function (cb) {
    del([
        paths.dist + '/Css',
        paths.dist + '/Js',
        paths.dist + '/Img'
    ], { force: true }, cb);
});

//Default task
gulp.task('default', ['clean', 'init'], function (cb) {
    return gulp.start('styles', 'scripts', 'images', 'watch');
});