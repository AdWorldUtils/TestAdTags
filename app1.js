var harness = require('./TestHarness');
var googleVASTInspector = require('./GoogleVideoSuiteInspector');

harness.runAd(function(result){
    if(result) {
        googleVASTInspector.runAd(function(result){
           console.log(result);
            console.log('test');
        });
    }
});