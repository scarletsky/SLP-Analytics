/* 即时更新 */
var Gaze = require('gaze').Gaze;
var gaze = new Gaze('**/*');

gaze.on('all', function (event, filepath) {
    if (location) {
        location.reload();
    }
});

window.slp = {};
