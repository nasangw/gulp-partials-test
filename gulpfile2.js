// 'use strict';

const 
os = require('os'),
path = require('path'),
gulp = require('gulp'),
sass = require('gulp-sass'),
cleanCSS = require('gulp-clean-css'),
sourcemaps = require('gulp-sourcemaps'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat'),
zip = require('gulp-zip'),
clean = require('gulp-clean'),
cached = require('gulp-cached'),
sassPartialsImported = require('gulp-sass-partials-imported'),
runSequence = require('run-sequence').use(gulp),
ftp = require('vinyl-ftp');

const src = {
    desktop: path.normalize(`${os.homedir()}/Desktop`),
    sassDir: '_src/sass/',
    sassVendor: '_src/sass/lib',
    sass: '_src/sass/**/*.scss',
    cssCompress: './_dist/css/**/*',
    cssDist: './_dist/css',
}

gulp.task('sass', () => {
	gulp.src(src.sass)
		.pipe(cached('sassfiles'))
        .pipe(sassPartialsImported(src.sassDir, src.sassVendor))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compact', 
            includePaths: src.sassDir, 
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        // .pipe(ftp.create(ftpConfig).dest(src.ftp.css))
		.pipe(gulp.dest(src.cssDist))
});

gulp.task('watch:sass', () => {
    gulp.watch(src.sass, ['sass']);
});

gulp.task('build-min:sass', () => {
    return gulp.src(src.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            compatibility: 'ie10'
        }))
        .pipe(gulp.dest(src.cssDist))
});

gulp.task('compress:css', () => {
    gulp.src(src.cssCompress)
        .pipe(zip('release.css.zip'))
        .pipe(gulp.dest(src.desktop))
});

gulp.task('clean:css', () => {
    return gulp.src(src.cssDist)
        .pipe(clean());
});

gulp.task('release:css', () => {
    runSequence('clean:css', 'build-min:sass', 'compress:css');
});

gulp.task('default', ['watch:sass']);