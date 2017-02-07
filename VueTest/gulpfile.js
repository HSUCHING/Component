let gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	gulpautoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	postcss = require('gulp-postcss'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	eslint = require('gulp-eslint'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	babel = require('gulp-babel'),
	clean = require('gulp-clean'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	order = require("gulp-order"),
	fileinclude = require('gulp-file-include'),
	livereload = require('gulp-livereload'),
	webpack = require('gulp-webpack'),
	karma = require('karma'),
	browserSync = require('browser-sync');

let config = require("./config/gulpconf");

//style
gulp.task('styles', function () {
	console.log("Style");
	return sass('src/css/*.scss')
		.pipe(gulpautoprefixer(config))
		.pipe(gulp.dest('dist/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/css'))
		.pipe(notify({message: 'Styles task complete'}));
});

//scripts
gulp.task('scripts', function () {
	console.log("script");
	return gulp.src(['src/**/*.js'])
	// .pipe(order([
	// 	"lib/jquery.js",
	// 	"lib/*.js",
	// 	"js/*.js"
	// ]))
	// .pipe(eslint())
	// .pipe(eslint.format())
	// .pipe(eslint.failAfterError())
	// .pipe(babel())
	// .pipe(concat('main.js'))
	// .pipe(gulp.dest('dist/js'))
	// .pipe(rename({ suffix: '.min' }))
	// .pipe(uglify())
		.pipe(webpack(require('./webpack.my.config.js'), require('webpack')))
		.pipe(gulp.dest('dist/js'))
		.pipe(notify({message: 'Scripts task complete'}));
});

//PIC
gulp.task('images', function () {
	console.log("Image");
	return gulp.src('src/images/**/*')
		.pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
		.pipe(gulp.dest('dist/images'))
		.pipe(notify({message: 'Images task complete'}));
});

//HTML
gulp.task('html', function () {
	console.log("HTML");
	return gulp.src('src/**/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(notify({message: 'html task complete'}));
});

//Test
gulp.task('karma-Test', function () {
	console.log("karma-Test");
	// return gulp.src('./*')
	// 	.pipe(karma.server.start({
	// 			configFile:__dirname+'/karma/karma.mocha.conf.js'
	// 		},function(){
	// 			console.log("Test Done");
	// 		}))
	// 	.pipe(gulp.dest('./'))
	// 	.pipe(notify({message: 'karma task complete'}))
	return new karma.Server({
		configFile:__dirname+'/karma/karma.mocha.conf.js'
	},function(){
		console.log("Test Done");
	}).start();
});


//Clean
gulp.task('clean', function () {
	console.log("CLEAN");
	return gulp.src(['dist/css', 'dist/js', 'dist/images'], {read: false})
		.pipe(clean());
});

//Default
gulp.task('default', ['clean'], function () {
	console.log("start gulp");
	gulp.start('karma-Test','styles', 'images', 'html', 'scripts');
});

gulp.task('watch', function () {

	// 看守所有.scss档
	gulp.watch('src/css/**/*.scss', ['styles']);

	// 看守所有.js档
	gulp.watch('src/**/*.js', ['scripts']);

	// 看守所有图片档
	gulp.watch('src/images/**/*', ['images']);

	//看守html
	gulp.watch('src/**/*.html', ['html']);

	livereload.listen();
	// browserSync.init({
	// 	server: "./app"
	// });
	gulp.watch(['dist/**']).on('change', livereload.changed);
	// gulp.watch("app/*.html").on('change', browserSync.reload;);
});