/**
 * Created by svelupula16 on 6/21/16.
 */
var webdriver = require("selenium-webdriver"),
    By = webdriver.By;
var chrome = require('selenium-webdriver/chrome');


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
var driver = new webdriver.Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();

driver.get("http://dev.hq.adap.tv/adclient/harness/?autostart=1&tab=vast_adaptv_flash");

driver.sleep(2000);
driver.findElement(By.css('#harness-adtag-form-adtag input')).sendKeys('http://ads.adaptv.advertising.com/a/h/PtfytGA0Yf9nJzcgxDVnQkOBFiEjxV+F?cb=[CACHE_BREAKER]&pet=preroll&pageUrl=test15571.com&eov=eov&cowboy=1&ocb=784389');
driver.findElement(By.css('#harness-adtag-form-adtag button')).click();
driver.sleep(60000 * 2);

driver.manage().logs().get('performance').then(function(entries) {
    console.log(entries);
});

driver.quit();
