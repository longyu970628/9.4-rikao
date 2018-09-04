var gulp = require('gulp');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

var minCss = require('gulp-clean-css');

var uglify = require('gulp-uglify');

var url = require('url');

var path = require('path');

var fs = require('fs');

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./src/css'))
});

gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('sass'))
});

gulp.task('uglify', function() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
});

gulp.task('server', function() {
    return gulp.src('./src')
        .pipe(server({
            port: 8888,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    res.end('');
                    return;
                }
                pathname = pathname === '/' ? 'index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
            }
        }))
});

gulp.task('dev', gulp.series('server', 'uglify', 'sass', 'watch'));