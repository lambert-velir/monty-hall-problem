/**
 *  Usage:
 *      Once per computer:
 *         $ npm install -g gulp-cli
 *
 *      Once per project, in gulp folder:
 *         $ npm install
 *
 *
 *      Running clumped tasks (defined in this file) --
 *      see quench.js build function
 *         $ gulp dev
 *
 *      Running single task (task defined in /tasks.  eg. /tasks/css.js)
 *         $ gulp css                  // will use the default environment
 *         $ gulp css --env production // will use the production environment
 *         $ gulp css --watch          // will override the watch configuration
 *
 *      For details on build config, see "user supplied keys" in quench.js
**/

// Include gulp and plugins
var gulp    = require("gulp"),
    quench  = require("./quench.js"),
    path    = require("path");


// default configuration
var defaults = {
    root: path.resolve(__dirname, "../app"),
    dest: path.resolve(__dirname, "../app/build"),
    tasks: ["js", "js-libraries", "css", "bower", "svg-sprite"],
    env: "development", // "development", "production", "local"
    watch: false,
    browserSync: false,
    vmSync: false
};


/* watch for single tasks on the command line, eg "gulp js" */
quench.singleTasks(defaults);


/**
 * development task
 * Default Task (run when you run 'gulp').
 */
gulp.task("default", function(next){

    var config = Object.assign({}, defaults, {
        env   : "development",
        watch : true,
        browserSync: true
    });

    quench.build(config, next);

});


/**
 * production task
 */
gulp.task("prod", function(next){

    var config = Object.assign({}, defaults, {
        env   : "production",
        watch : false,
        browserSync: false
    });

    quench.build(config, next);

});


/**
 * build for development without a watcher
 */
gulp.task("build", function(next){

    var config = Object.assign({}, defaults, {
        env   : "development",
        watch : false,
        browserSync: false
    });

    quench.build(config, next);

});


/**
 * development task with vm syncing
 */
gulp.task("sync", function(){

    var config = Object.assign({}, defaults, {
        env   : "development",
        watch : true,
        browserSync: true,
        vmSync: true
    });

    quench.build(config);

});
