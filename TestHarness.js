
var webdriver = require("selenium-webdriver"),
    By = webdriver.By,
    nconf = require('nconf'),
    simpleTimestamp = require('simple-timestamp'),
    automation = require('./AutomationUtil');

var driver, config;
nconf.argv()
    .env()
    .file('config.json');

module.exports = {

    runAd: function(callback) {
        config = nconf.get();
        driver = automation.createDriver();
        automation.deleteAllCookies();
        driver.get(config.harnessPageURL + "&adtag=" + encodeURIComponent(automation.useHttpURL(config.adTag)));
        driver.sleep(60000 * config.adMinutes);
        var ts = simpleTimestamp();
        driver.get(config.harnessPageURL + "&adtag=" + encodeURIComponent(config.adTag));
        automation.savePerfLog(ts);
        driver.quit().then(function() {
            callback(true);
        });
    }
}
