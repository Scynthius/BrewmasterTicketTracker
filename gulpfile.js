const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const del = require('del');

gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/styles/'));
});

gulp.task('uglify', function() {
    return gulp.src('./scripts/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('clean', function () {
    return del([
        './public/styles/style.css'
    ]);
});

gulp.task('default', gulp.series(['clean','sass', 'uglify']));