module.exports = function(grunt) {

grunt.initConfig({
    clean: {
        build: {
            src: './build/releases'
        }
    },
    nodewebkit: {
        options: {
            version: '0.8.5',
            build_dir: './build',
            mac: true,
            win: true,
            linux32: false,
            linux64: false,
        },
        src: ['./app/**/*', './node_modules/**/*']
    },
});

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-node-webkit-builder');

//grunt.registerTask('default', ['nodewebkit']);
grunt.registerTask('build', [
    'clean:build',
    'nodewebkit'
]);

};

