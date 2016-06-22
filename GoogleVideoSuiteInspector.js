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
    
}