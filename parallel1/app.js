var AdSession = require('./util');

var util1 = new AdSession();

util1.openBrowser(function(err, result) {
    if(result)
    {
        util1.executeAd(true, function(err, result){
            console.log('Secure ad is completed');
            if(result) { console.log('Secure ad is success'); }
        });

       setTimeout(function() {
           util1.executeAd(true, function(err, result){
               console.log('Secure ad is completed');
               if(result) { console.log('Secure ad is success'); }
           });
       }, 1000 * 60 * 30);
    }
});