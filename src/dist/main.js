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
            console.log('[Request URL] ' + method + ':' + url + ' [Match Rule] ' + curRule.method + ':' + curRule.pattern);
            if ((curRule.method ? curRule.method === method : true) && curRule.pattern instanceof RegExp ? curRule.pattern.test(url) : (curRule.pattern === url || url.indexOf(curRule.pattern) > -1)) {
                flag = true;
                callback = curRule.callback;
                break;
            }
        }

        this.addEventListener('readystatechange', function (event) {
            if (flag && this.readyState === 4) {
                var response = callback(event.target.responseText);
                console.log('[Matched]');
                console.log('Original Response ' + event.target.responseText);
                console.log('Modified Response ' + response);
                Object.defineProperty(this, 'response', { writable: true });
                Object.defineProperty(this, 'responseText', { writable: true });
                this.response = this.responseText = response;
            }
        });
        return ajax_open_original.apply(this, open_arguments);
    };
};
window.intercept_ajax = intercept_ajax;


//24小时就关闭，关闭就改变图标



intercept_ajax([
    {
        method: 'get',
        pattern: '/api/Common/UserInfo',//支持正则或完整url
        callback: function () {
            return JSON.stringify({
                data: {
                    userId: '18310787656',
                    userName: 'test',
                    userGuid: '887cb663-40f1-4c5f-bd56-1e2ee094cbda',
                    isSuper: true,
                    ruInfo: { ru: '3408059', name: '学中溪龙', isUnion: false },
                    permissions: ['Agent']
                },
                status: 200,
                message: 'ok'
            });
        }
    },
    {
        method: 'get',
        pattern: '/api/Menu/UserMenu',//支持正则或完整url
        callback: function () {
            return JSON.stringify({
                code: 200,
                message: 'success',
                data: {
                    menuUser: {
                        userGuid: '887cb663-40f1-4c5f-bd56-1e2ee094cbda',
                        userName: 'zhangsan',
                        userPhone: '18888888888'
                    },
                    parents: [{
                        parentKey: 'FCDS',
                        parentName: 'FCDS',
                        childrens: [{
                            menuKey: 'boj',
                            menuName: 'boj',
                            menuUrl: 'sdcf;job.html'
                        }]
                    }]
                }
            });
        }
    }
]);