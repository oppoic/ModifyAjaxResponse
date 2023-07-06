var ajax_open_original = XMLHttpRequest.prototype.open;
function intercept_ajax(rules) {
    XMLHttpRequest.prototype.open = function () {
        var open_arguments = arguments;
        var method = open_arguments[0].toLowerCase();
        var url = open_arguments[1];

        var flag = false;
        var xhrTxt = '';
        for (let i = 0, len = rules.length; i < len; i++) {
            var curRule = rules[i];
            //console.log('[xhr] request:' + method + ' ' + url + ' pattern:' + curRule.method + ' ' + curRule.pattern);
            if (method === curRule.method && url.indexOf(curRule.pattern) > -1) {
                flag = true;
                xhrTxt = curRule.response;
                break;
            }
        }

        this.addEventListener('readystatechange', function (event) {
            if (flag && this.readyState === 4) {
                console.log('[xhr Matched]');
                console.log('[Original Response]' + event.target.responseText);
                console.log('[Modified Response]' + xhrTxt);
                Object.defineProperty(this, 'response', { writable: true });
                Object.defineProperty(this, 'responseText', { writable: true });
                this.response = this.responseText = xhrTxt;
            }
        });
        return ajax_open_original.apply(this, open_arguments);
    };
};

var originFetch = fetch;
function intercept_fetch(rules) {
    window.fetch = async (url, options) => {
        var method = typeof (options) == "undefined" ? 'get' : (typeof (options.method) == "undefined" || options.method === '' ? 'other' : options.method.toLowerCase());

        var flag = false;
        var fetchTxt = '';
        for (let i = 0, len = rules.length; i < len; i++) {
            var curRule = rules[i];
            //console.log('[fetch] request:' + method + ' ' + url + ' pattern:' + curRule.method + ' ' + curRule.pattern);
            if (method === curRule.method && url.indexOf(curRule.pattern) > -1) {
                flag = true;
                fetchTxt = curRule.response;
                break;
            }
        }

        var response = await originFetch(url, options);
        if (flag) {
            console.log('[fetch Matched]');
            console.log('[Modified Response]' + fetchTxt);
            return new Response(fetchTxt, response);
        }
        else {
            return response;
        }
    };
}

window.addEventListener("message", function (event) {
    var dt = event.data;
    if (dt.type === 'modify_ajax_response_init') {
        change_rules(dt.data);
    }
    else if (dt.type === 'modify_ajax_response_datachange') {
        if (dt.on) {
            change_rules(dt.data);
        }
        else {
            change_rules([]);
        }
    }
});

function change_rules(rules) {
    var arrRules = [];
    rules.forEach((r) => {
        if (r.status) {
            arrRules.push({
                method: r.method,
                pattern: r.pattern,
                response: r.response
            });
        }
    });

    console.log('inject rules count:' + arrRules.length);
    intercept_ajax(arrRules);
    intercept_fetch(arrRules);
}