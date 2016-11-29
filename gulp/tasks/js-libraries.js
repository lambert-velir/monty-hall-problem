var gulp           = require("gulp"),
    quench         = require("../quench.js"),
    uglify         = require("gulp-uglify"),
    rename         = require("gulp-rename"),
    debug          = require("gulp-debug"),
    sourcemaps     = require("gulp-sourcemaps"),
    browserify     = require("browserify"),
    vinylSource    = require("vinyl-source-stream"),
    vinylBuffer    = require("vinyl-buffer");

module.exports = function jsLibrariesTask(config, env){

    var js = {
        dest: config.dest + "/js",

        filename: "libraries.js",

        // js uglify options. to skip, set value to false or omit entirely
        // otherwise, pass options object (can be empty {})
        uglify: {},

        // browserify options
        browserify: {
            // enable sourcemaps for development
            debug: env.development()
        }
    };

    // register the watch
    quench.registerWatcher("js-libraries", [
        quench.findPackageJson()
    ]);

    gulp.task("js-libraries", function(){

        var npmPackages = quench.getInstalledNPMPackages();

        return getNpmStream(npmPackages, js.filename, js.browserify)
            .pipe(quench.drano())
            .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
            .pipe(env.production( uglify(js.uglify) ))
            .pipe(rename({
                suffix: "-generated"
            }))
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(js.dest))
            .pipe(debug({title: "js-libraries: "}));
    });
};

// http://stackoverflow.com/questions/30294003/how-to-avoid-code-duplication-using-browserify/30294762#30294762
// create browserify bundle with the npm packages exposed
function getNpmStream(externalPackages, filename, browserifyOptions){

    // will expose externalPackages, eg. "react"
    var b = browserify(Object.assign({}, browserifyOptions, {
        require: externalPackages
    }));

    quench.logYellow("npm packages", externalPackages);

    return b.bundle()
        .pipe(vinylSource(filename)) // bs to make it work with gulp
        .pipe(vinylBuffer()); // https://github.com/gulpjs/gulp/issues/369 more bs to make it work with gulp;
}
