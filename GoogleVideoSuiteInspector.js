/**
 * Created by svelupula16 on 6/21/16.
 */
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
        //console.log(config.adTag);
        //driver.get(config.harnessPageURL + "&adtag=" + encodeURIComponent(automation.useHttpsUrl(config.adTag)));
        driver.get(config.googleVASTInspector);
        driver.sleep(2000);
        driver.switchTo().frame(driver.findElement(By.css('.framebox')));
        driver.findElement(By.css('#vast-tag-url')).sendKeys(automation.useHttpsUrl(config.adTag));
        driver.sleep(500);
        driver.findElement(By.css('#test-ad-button')).click();
        driver.sleep(60000 * config.adMinutes);
        var ts = simpleTimestamp();
        driver.get(config.googleVASTInspector);
        automation.savePerfLog(ts);
        driver.quit().then(function() {
            callback(true);
        });
    }
}
