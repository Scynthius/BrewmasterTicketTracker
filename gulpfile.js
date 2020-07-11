const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const del = require('del');

gulp.task('compile', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/styles/'));
});

gulp.task('clean', function () {
    return del([
        './public/styles/style.css'
    ]);
});

gulp.task('default', gulp.series(['clean','compile']));