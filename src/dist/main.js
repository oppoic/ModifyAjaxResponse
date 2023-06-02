var ajax_open_original = XMLHttpRequest.prototype.open;
var cacheRules = [];

function intercept_ajax(rules) {
    cacheRules = cacheRules.concat(rules);
    XMLHttpRequest.prototype.open = function () {
        var open_arguments = arguments;
        var method = open_arguments[0].toLowerCase(),
            url = open_arguments[1];

        var flag = false;
        var callback = function () { };
        for (let i = 0, len = cacheRules.length; i < len; i++) {
            var curRule = cacheRules[i];
            //console.log('[Request URL] ' + method + ':' + url + ' [Match Rule] ' + curRule.method + ':' + curRule.pattern);
            if ((curRule.method ? curRule.method === method : true) && curRule.pattern instanceof RegExp ? curRule.pattern.test(url) : (curRule.pattern === url || url.indexOf(curRule.pattern) > -1)) {
                flag = true;
                callback = curRule.callback;
                break;
            }
        }

        this.addEventListener('readystatechange', function (event) {
            if (flag && this.readyState === 4) {
                var response = callback(event.target.responseText);
                // console.log('[Matched]');
                // console.log('Original Response ' + event.target.responseText);
                // console.log('Modified Response ' + response);
                Object.defineProperty(this, 'response', { writable: true });
                Object.defineProperty(this, 'responseText', { writable: true });
                this.response = this.responseText = response;
            }
        });
        return ajax_open_original.apply(this, open_arguments);
    };
};
window.intercept_ajax = intercept_ajax;

window.addEventListener("message", function (event) {
    var dt = event.data;
    console.log(dt);
    // if (dt.type === 'modify_ajax_response_init') {
    //     if (dt.onoff && dt.data.length > 0) {
    //         var arrRules = [];
    //         dt.data.forEach((element) => {
    //             if (element.status) {
    //                 arrRules.push({
    //                     method: element.method,
    //                     pattern: element.pattern,
    //                     callback: function () {
    //                         return element.response
    //                     }
    //                 });
    //             }
    //         });
    //         if (arrRules.length > 0) {
    //             intercept_ajax(arrRules);
    //         }
    //     }
    // }
    // else if (dt.type === 'modify_ajax_response_change') {
    //     console.log(dt);

    // }
});