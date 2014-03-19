module.exports = function(grunt) {

 grunt.initConfig({
    nodewebkit: {
        options: {
            version: '0.8.5',
            build_dir: './build',
            mac: true,
            win: false,
            linux32: false,
            linux64: false,
        },
        src: './app/**/*'
    },
});

grunt.loadNpmTasks('grunt-node-webkit-builder');

//grunt.registerTask('default', ['nodewebkit']);
grunt.registerTask('build', ['nodewebkit']);

};

