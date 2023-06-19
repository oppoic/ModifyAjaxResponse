var ajax_open_original = XMLHttpRequest.prototype.open;
function intercept_ajax(rules) {
    XMLHttpRequest.prototype.open = function () {
        var open_arguments = arguments;
        var method = open_arguments[0].toLowerCase();
        var url = open_arguments[1];

        var flag = false;
        var resTxt = '';
        for (let i = 0, len = rules.length; i < len; i++) {
            var curRule = rules[i];
            // console.log('[Request URL] ' + method + ':' + url + ' [Match Rule] ' + curRule.method + ':' + curRule.pattern);
            // if ((curRule.method ? curRule.method === method : true) && curRule.pattern instanceof RegExp ? curRule.pattern.test(url) : (curRule.pattern === url || url.indexOf(curRule.pattern) > -1)) {
            if (method == curRule.method && url.indexOf(curRule.pattern) > -1) {
                flag = true;
                resTxt = curRule.response;
                break;
            }
        }

        this.addEventListener('readystatechange', function (event) {
            if (flag && this.readyState === 4) {
                // console.log('[Matched]');
                // console.log('Original Response ' + event.target.responseText);
                // console.log('Modified Response ' + response);
                Object.defineProperty(this, 'response', { writable: true });
                Object.defineProperty(this, 'responseText', { writable: true });
                this.response = this.responseText = resTxt;
            }
        });
        return ajax_open_original.apply(this, open_arguments);
    };
};

const originFetch = fetch;
function intercept_fetch(rules) {
    window.fetch = async (url, options) => {
        var flag = false;
        for (let i = 0, len = rules.length; i < len; i++) {
            var curRule = rules[i];
            // console.log('fetch request:' + curRule.pattern);
            if (/*method == curRule.method &&*/ url.indexOf(curRule.pattern) > -1) {
                flag = true;
                break;
            }
        }

        const response = await originFetch(url, options);
        if (flag) {
            // console.log('[[fetch matched]]');
            return new Response(curRule.response, response);
        }
        else {
            return response;
        }
    };
}

window.addEventListener("message", function (event) {
    var dt = event.data;
    if (dt.type === 'modify_ajax_response_init') {
        change_rules(dt);
    }
    else if (dt.type === 'modify_ajax_response_datachange') {
        if (dt.on) {
            change_rules(dt);
        }
        else {
            intercept_ajax([]);
            intercept_fetch([]);
        }
    }
});

function change_rules(dt) {
    var arrRules = [];
    dt.data.forEach((element) => {
        if (element.status) {
            arrRules.push({
                method: element.method,
                pattern: element.pattern,
                response: element.response
            });
        }
    });
    intercept_ajax(arrRules);
    intercept_fetch(arrRules);
}