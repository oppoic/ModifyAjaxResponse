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
                console.log('Original Response ' + event.target.responseText);
                console.log('Modified Response ' + xhrTxt);
                Object.defineProperty(this, 'response', { writable: true });
                Object.defineProperty(this, 'responseText', { writable: true });
                this.response = this.responseText = xhrTxt;
            }
        });
        return ajax_open_original.apply(this, open_arguments);
    };
};

const originFetch = fetch;
function intercept_fetch(rules) {
    window.fetch = async (url, options) => {
        //console.log(options.method);

        var flag = false;
        var fetchTxt = '';
        for (let i = 0, len = rules.length; i < len; i++) {
            var curRule = rules[i];
            //console.log('[fetch] request:' + url + ' pattern:' + curRule.pattern);
            if (/*options.method.toLowerCase() === curRule.method &&*/ url.indexOf(curRule.pattern) > -1) {
                flag = true;
                fetchTxt = curRule.response;
                break;
            }
        }

        const response = await originFetch(url, options);
        if (flag) {
            console.log('[fetch Matched]');
            console.log('Original Response ' + options.body);
            console.log('Modified Response ' + fetchTxt);
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