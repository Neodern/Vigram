var gulp = require('gulp');
var uglify = require('gulp-uglify');
var javascriptObfuscator = require('gulp-javascript-obfuscator');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var del = require('del');
var jsonminify = require('gulp-jsonminify');
var htmlmin = require('gulp-htmlmin');

var config = {
    js: {
        src: 'src/**/*.js',
        dest: 'build'
    },
    css: {
        src: 'src/**/*.css',
        dest: 'build'
    },
    html: {
        src: 'src/**/*.html',
        dest: 'build'
    },
    images: {
        src: 'src/images/*',
        dest: 'build/images/'
    },
    locales: {
        src: 'src/_locales/**/*.json',
        dest: 'build/_locales'
    },
    json: {
        src: './manifest.json',
        dest: 'build'
    }
};


// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function (cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['build'], cb);
});

var js = function () {
    return gulp.src(config.js.src)
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(javascriptObfuscator({
            compact: true,
            sourceMap: true
        }))
        .pipe(gulp.dest(config.js.dest));
};

var css = function () {
    return gulp.src(config.css.src)
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.css.dest))
};


var images = function () {
    return gulp.src(config.images.src)
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(config.images.dest));
};

var html = function () {
    return gulp.src(config.html.src)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.html.dest));
};

var json = function () {
    return gulp.src(config.json.src)
        .pipe(jsonminify())
        .pipe(gulp.dest(config.json.dest));
};

var locales = function () {
    return gulp.src(config.locales.src)
        .pipe(jsonminify())
        .pipe(gulp.dest(config.locales.dest));
};

gulp.task('js', ['clean'], js);
gulp.task('js-watch', js);

gulp.task('css', ['clean'], css);
gulp.task('css-watch', css);

gulp.task('html', ['clean'], html);
gulp.task('html-watch', html);

gulp.task('images', ['clean'], images);
gulp.task('images-watch', images);

gulp.task('json', ['clean'], json);
gulp.task('json-watch', json);

gulp.task('locales', ['clean'], locales);
gulp.task('locales-watch', locales);

gulp.task('watch', function () {
    gulp.watch(config.js.src, ['js-watch']);
    gulp.watch(config.css.src, ['css-watch']);
    gulp.watch(config.html.src, ['html-watch']);
    gulp.watch(config.images.src, ['images-watch']);
    gulp.watch(config.json.src, ['json-watch']);
    gulp.watch(config.locales.src, ['locales-watch']);
});

gulp.task('default', ['clean', 'watch', 'js', 'css', 'html', 'images', 'json', 'locales']);