/**
 * This is a special task, do not include this in your build.tasks configuration.
 * This is handled in quench.js by passing browserSync: true
 * in the build config to quench.build().
 */
var gulp           = require("gulp"),
    quench         = require("../quench.js"),
    path           = require("path"),
    browserSync    = require("browser-sync").create();

var proxyMiddleware = require("http-proxy-middleware");

module.exports = function(config, env){

    // if not using proxy, use this as the server root
    var serverRoot = path.resolve(config.root);

    // browserSync settings
    var settings = {
        port: config.local.browserSyncPort || 3000,
        open: false, // or  "external"
        notify: false,
        ghostMode: false
    };


    // set the server root, or proxy if it's set in local.js
    // use proxy if you have a server running the site already (eg, IIS)
    if (config.vmSync && config.local.hostname && config.local.vmRoot) {

        // http://www.browsersync.io/docs/options/#option-proxy
        settings.proxy = config.local.hostname;

        // watch these files and reload the browser when they change
        settings.files = [
            // watch files on the vm
            config.local.vmRoot + "/assets/build/**",
            // prevent browser sync from reloading twice when the regular file (eg. index.js)
            // and the map file (eg. index.js.map) are generated
            "!**/*.map"
        ];


    }
    // if the hostname is defined, but we're not syncing to the vm
    // serve all files from the vm (hostname), except everything in /microsites
    // (which includes javascript/css/svg, etc)
    else if (config.local.hostname) {

        var proxyPatterns = [
            "**",      // all files
            "!/microsites/**/*" // except everything under /microsites
        ];

        // https://github.com/chimurai/http-proxy-middleware/blob/master/examples/browser-sync/index.js
        var localBuild = proxyMiddleware(proxyPatterns, {
            target: config.local.hostname,
            changeOrigin: true
            // logLevel: "debug"
        });

        // http://www.browsersync.io/docs/options/#option-server
        settings.server = {
            // kauffmanindex/web/Website  /microsites lives here
            baseDir: path.resolve(__dirname, "../../../../"),
            middleware: [ localBuild ]
        };

        // watch these files and reload the browser when they change
        settings.files = [
            config.dest + "/**",
            // prevent browser sync from reloading twice when the regular file (eg. index.js)
            // and the map file (eg. index.js.map) are generated
            "!**/*.map"
        ];
    }
    else {

        // http://www.browsersync.io/docs/options/#option-server
        settings.server = {
            baseDir: serverRoot,
            middleware: [
                function(req, res, next) {
                    // get all assets from /assets
                    // /microsites/kauffmanindex/app/assets > /assets
                    req.url = req.url.replace(/^\/microsites\/kauffmanindex\/app\/assets/, "/assets")
                    return next();
                }
            ]
        };

        // watch these files and reload the browser when they change
        settings.files = [
            config.dest + "/**",
            // activity-genreated.js and ranking-generated.js are both being generated, right now
            // i'm working on activity and don't care about rankings
            "!**/rankings*",
            serverRoot + "/*.html",
            // prevent browser sync from reloading twice when the regular file (eg. index.js)
            // and the map file (eg. index.js.map) are generated
            "!**/*.map"
        ];
    }


    /* start browser sync if we have the "watch" option */
    gulp.task("browser-sync", function(){

        if (config.watch === true){
            quench.logYellow("watching", "browser-sync:", JSON.stringify(settings.files, null, 2));
            browserSync.init(settings);
        }

    });
};
