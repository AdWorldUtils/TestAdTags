/**
 * Created by svelupula16 on 6/21/16.
 */
var webdriver = require("selenium-webdriver"),
    By = webdriver.By,
    chrome = require('selenium-webdriver/chrome'),
    nconf = require('nconf'),
    fs        = require('fs'),
    path      = require('path'),
    url       = require('url'),
    slugify   = require('transliteration').slugify,
    simpleTimestamp = require('simple-timestamp'),
    wrench    = require('wrench');

var driver, config;
nconf.argv()
    .env()
    .file('config.json');

module.exports = {

    createDriver: function () {
        config = nconf.get();
        var options = new chrome.Options();
        var logging_prefs = new webdriver.logging.Preferences();
        logging_prefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Level.ALL);
        options.setLoggingPrefs(logging_prefs);
        options.addArguments("--no-experiments");
        options.addArguments("--disable-translate");
        options.addArguments("--disable-plugins");
        options.addArguments("--disable-extensions");
        options.addArguments("--no-default-browser-check");
        options.addArguments("--clear-token-service");
        options.addArguments("--disable-default-apps");
        options.addArguments("--enable-logging");
        options.addArguments("--test-type");

        var chromeCapabilities = options.toCapabilities();
        driver = new webdriver.Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
        driver.manage().timeouts().implicitlyWait(config.elementTimeout || 3000);
        driver.manage().window().maximize();

        return driver;
    },

    saveScreenshot: function (name) {
        var filename = slugify(name) + '.png';
        driver.takeScreenshot().then(function (data) {
            fs.writeFileSync(path.join(config.resultsDir || 'results', 'screenshots', filename), data, 'base64');
        });
    },

    deleteAllCookies: function () {
        driver.manage().deleteAllCookies();
    },

    savePerfLog: function (name) {
        var dir = path.join(config.resultsDir, 'perf_logs');
        wrench.mkdirSyncRecursive(dir);
        var perfLog = [];
        driver.manage().logs().get('performance').then(function (logs) {

            var entriesByMethod = {};
            logs.forEach(function(entry) {
                var message = JSON.parse(entry.message).message;
                if(message.method === 'Network.requestWillBeSent')
                {
                    if(message.params.request.method === 'GET') {

                        if(message.params.request.url.indexOf('log.adaptv.advertising.com/log?') >= 0) {
                            perfLog.push(message.params.request.url);
                            console.log(message.params.request.url);
                        }
                    }
                }
            });
            fs.writeFileSync(path.join(dir, name + '.json'), JSON.stringify(perfLog));
        });


    },

    useHttpURL: function(url) {
        if(url.toLowerCase().indexOf('https://') >= 0)
        {
            url = url.splice(8);
        }
        if(url.toLowerCase().indexOf('http://') < 0)
        {
            url = 'http://' + url;
        }
        return url;
    },

    useHttpsUrl: function(url) {
        if(url.toLowerCase().indexOf('http://') >= 0)
        {
            url = url.splice(7);
        }
        if(url.toLowerCase().indexOf('https://') < 0)
        {
            url = 'https://' + url;
        }
        return url;
    }

}
