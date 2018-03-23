const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

/*
    -- TOP LEVEL FUNCTIONS --
    gulp.taks - Define tasks
    gulp.src - Point to files use
    gulp.dest - Points to folder to output
    gulp.watch - Watch files and folders for changes
*/


// Compile Sass
gulp.task('styles', () => {
    return gulp.src('./dev/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        // Below is a list of browsers to add prefixes for.  Change as browser requirements change.
        .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles/'))
        .pipe(browserSync.stream())
        // Below is the reload for browserfy
        .pipe(reload({ stream: true }));
    gulp.watch('*.html', reload);
});

//Scripts
gulp.task('scripts', () => {
    gulp.src('./dev/scripts/main.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('./public/scripts'))
    .pipe(reload({ stream: true }));
    gulp.watch('*.html', reload);
});

// Optimize Images
gulp.task('imageMin', () =>
    gulp.src('./dev/assets/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/assets/'))
        
        
);

gulp.task('watch', () => {
    gulp.watch('./dev/styles/*.scss', ['styles']);
    gulp.watch('./dev/scripts/main.js', ['scripts']);
    gulp.watch('./dev/assets/*', ['imageMin']);

});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: './'
    })
});

gulp.task('default', ['browser-sync', 'styles', 'scripts', 'imageMin', 'watch' ]);