const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('dist/pageInjectScript.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
    chrome.storage.local.get(['on', 'onTime', 'data'], function (result) {
        if (result.hasOwnProperty('on') && result.on && result.hasOwnProperty('onTime') && result.hasOwnProperty('data') && result.data.length > 0) {
            var dtDiffer = parseInt(new Date(new Date().toLocaleString()) - new Date(result.onTime)) / 1000;//second
            if (dtDiffer > 24 * 60 * 60) {
                // chrome.action.setIcon({ path: "/images/16_gray.png" });//这里永不了setIcon，发消息到background.js里setIcon
                if (result.hasOwnProperty('on') && result.on) {
                    chrome.storage.local.set({ on: false });
                }
            }
            else {
                postMessage({ type: 'modify_ajax_response_init', on: result.on, data: result.data });
            }
        }
    });
});