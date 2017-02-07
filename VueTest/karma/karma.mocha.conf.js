// Karma configuration
// Generated on Mon Feb 06 2017 13:20:18 GMT+0800 (CST)

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: './',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		// frameworks: ['mocha','should'],
		frameworks: ['browserify','mocha', 'chai'],
		// frameworks: ['mocha', 'chai'],

		// list of files / patterns to load in the browser
		files: [
			'../src/mocha/*.js',
			// '../test-lib/**/*.js',
			'mocha/**/*.js'
		],


		// list of files to exclude
		exclude: [
			"karma.**.config.js",
			"mocha/coverage/**/*.js"
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'../src/mocha/*.js': ['coverage'],
			// 'mocha/**/*.js':['babel','commonjs']
			'mocha/**/*.js':['browserify']
		},
		browserify: {
			debug: true,
			transform: [ 'brfs' ]
		},

		// plugins: [
		// 	'karma-mocha',
		// 	'karma-coverage',
		// 	'karma-chai',
		// 	'karma-mocha-reporter',
		// 	'karma-commonjs',
		// 	'karma-babel-preprocessor',
		// 	'karma-chrome-launcher'
		// ],

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage', 'nyan', 'notify'],

		// reporters: ['progress', 'coverage'],
		coverageReporter: {
			type: 'html',
			dir: 'mocha/coverage/'
		},
		// reporter options
		nyanReporter: {
			// suppress the error report at the end of the test run
			suppressErrorReport: true, // default is false

			// suppress the red background on errors in the error
			// report at the end of the test run
			suppressErrorHighlighting: true, // default is false

			// increase the number of rainbow lines displayed
			// enforced min = 4, enforced max = terminal height - 1
			numberOfRainbowLines: 100, // default is 4

			// only render the graphic after all tests have finished.
			// This is ideal for using this reporter in a continuous
			// integration environment.
			renderOnRunCompleteOnly: true // default is false
		},


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	})
}
