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


function AdSession() {

    var driver, config;
    nconf.argv()
        .env()
        .file('config.json');

    var useHttpURL = function(url) {
        if(url.toLowerCase().indexOf('https://') >= 0)
        {
            url = url.splice(8);
        }
        if(url.toLowerCase().indexOf('http://') < 0)
        {
            url = 'http://' + url;
        }
        return url;
    };

    var useHttpsUrl = function(url) {
        if(url.toLowerCase().indexOf('http://') >= 0)
        {
            url = url.splice(7);
        }
        if(url.toLowerCase().indexOf('https://') < 0)
        {
            url = 'https://' + url;
        }
        return url;
    };

    this.openBrowser = function (callback) {
        config = nconf.get();
        var options = new chrome.Options();
        var logging_prefs = new webdriver.logging.Preferences();
        logging_prefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Level.ALL);
        options.setLoggingPrefs(logging_prefs);
        options.addArguments("--no-default-browser-check");
        options.addArguments("--enable-logging");
        options.addArguments("--test-type");

        var chromeCapabilities = options.toCapabilities();
        driver = new webdriver.Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
        driver.manage().timeouts().implicitlyWait(config.elementTimeout || 3000);
        driver.manage().window().maximize();

        callback(null, true);
    };

    this.savePerfLog = function (name) {
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
    };

    this.executeAd = function(secure, callback) {
        driver.manage().deleteAllCookies();
        if(!secure) {
            console.log('Non secure block');
            driver.get(config.harnessPageURL + "&adtag=" + encodeURIComponent(useHttpURL(config.adTag)));
            console.log('Get Operation for secure is Done...');
            driver.sleep(60000 * config.adMinutes);
            var ts = simpleTimestamp();
            driver.get(config.harnessPageURL + "&adtag=" + encodeURIComponent(config.adTag));
            this.savePerfLog(ts);
            callback(null, true);
            /*driver.quit().then(function() {
                callback(null, true);
            });*/
        } else {
            console.log('secure block');
            driver.get(config.googleVASTInspector);
            console.log('Get Operation for non-secure is Done...');
            driver.sleep(2000);
            driver.switchTo().frame(driver.findElement(By.css('.framebox')));
            driver.findElement(By.css('#vast-tag-url')).sendKeys(useHttpsUrl(config.adTag));
            driver.sleep(500);
            driver.findElement(By.css('#test-ad-button')).click();
            driver.sleep(60000 * config.adMinutes);
            var ts = simpleTimestamp();
            driver.get(config.googleVASTInspector);
            this.savePerfLog(ts);
            callback(null, true);
           /* driver.quit().then(function() {
                callback(null, true);
            });*/
        }
    }



}

module.exports = AdSession;