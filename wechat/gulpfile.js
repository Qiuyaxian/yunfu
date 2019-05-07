var gulp = require("gulp"),
	concat = require('gulp-concat')
    runSequence = require("run-sequence"),
    browserSync = require("browser-sync").create(),
    del = require("del");

gulp.task('default',function(){
	return runSequence(['clean'],['concatJs'],['concatCss'],['build'],['server','watch']);
});
//清除整个目录
gulp.task('clean',function(callback){
	return del('./dist/',callback);
})

gulp.task('build',function(callback){
	return runSequence(['concatJs','concatCss','static'],callback)
});

//合并js
gulp.task('concatJs', function() {
    return gulp.src('./src/js/*.js')
        .pipe(concat('app.js', {newLine: '\r\n'}))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('concatCss',function(callback){
	return gulp.src('./src/css/*.css')
        .pipe(concat('style.css', {newLine: '\r\n'}))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('static',function(){
	return gulp.src([
		'./src/**/*.html',
		'./src/images*/**/*.{jpg,png,gif}',
		'./src/libs*/**/*'
	]).pipe(gulp.dest('./dist/'));
});

gulp.task('server',function(){
	browserSync.init({
		server:'./dist',
		port:8088
	});
});

gulp.task('reload',function(){
	return browserSync.reload();
});

gulp.task('watch',function(){
	return gulp.watch([
		'./src/**/*.html',
		'./src/**/*.js',
		'./src/**/*.css',
		'./src/libs/*',
		'./src/images/*',
	],function(){
		return runSequence(['build'],['reload'])
	});
})








