module.exports = function(grunt) {

	if(grunt.option("time")) {
		require('time-grunt')(grunt)
	}

	grunt.loadNpmTasks('grunt-screeps')
	grunt.loadNpmTasks('grunt-contrib-clean')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-file-append')
	grunt.loadNpmTasks("grunt-jsbeautifier")
	grunt.loadNpmTasks('grunt-string-replace')

	//Default settings stored in .screeps.json
	var config = require('./.screeps.json')
	var branch = grunt.option('branch') || config.branch
	var email = grunt.option('email') || config.email
	var password = grunt.option('password') || config.password
	var ptr = grunt.option('ptr') ? true : config.ptr

	//Automatic Versioning with date
	var currentdate = new Date()
	grunt.log.subhead('Task Start: ' + currentdate.toLocaleString())
	grunt.log.writeln('Branch: ' + branch)

	grunt.initConfig({
		screeps: {
			options: {
				email: email,
				password: password,
				branch: branch,
				ptr: ptr
			},
			dist: {
				src: ['dist/*.js']
			}
		},

		clean: {
			'dist': ['dist']
		},

		//fixes all the require statements for screeps
		'string-replace': {
			screeps: {
				options: {
					replacements: [{
						pattern: /(?<=require\('.+)\/(?=.+'\);)/g,
						replacement: "."
					}]
				},
				files: [{
					expand: true,
					cwd: 'src/',
					src: "**",
					dest: 'dist/',
					filter: 'isFile',
					rename: function(dest, src) {
						// Change the path name utilize underscores for folders
						return dest + src.replace(/\//g, '.');
					}
				}]
			}
		},

		// Add version variable using current timestamp.
		file_append: {
			versioning: {
				files: [{
					append: "\nglobal.SCRIPT_VERSION = " + currentdate.getTime() + "\n",
					input: 'dist/version.js',
				}]
			}
		},

		jsbeautifier: {
			modify: {
				src: ["src/**/*.js"],
				options: {
					config: '.jsbeautifyrc'
				}
			},
			verify: {
				src: ["src/**/*.js"],
				options: {
					mode: 'VERIFY_ONLY',
					config: '.jsbeautifyrc'
				}
			}
		}
	});

	grunt.registerTask('default', ['clean', 'string-replace:screeps', 'file_append:versioning', 'screeps']);
	grunt.registerTask('test', ['jsbeautifier:verify']);
	grunt.registerTask('pretty', ['jsbeautifier:modify']);
}
