const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('dist/pageInjectScript.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
    chrome.storage.local.get(['onoff', 'onoffTime', 'data'], function (result) {
        if (result.hasOwnProperty('onoff') && result.onoff && result.hasOwnProperty('onoffTime') && result.hasOwnProperty('data') && result.data.length > 0) {
            var dtDiffer = parseInt(new Date(new Date().toLocaleString()) - new Date(result.onoffTime)) / 1000;//second
            if (dtDiffer > 24 * 60 * 60) {
                // chrome.action.setIcon({ path: "/images/16_gray.png" });//这里永不了setIcon，发消息到background.js里setIcon
                if (result.hasOwnProperty('onoff') && result.onoff) {
                    chrome.storage.local.set({ onoff: false });
                }
            }
            else {
                postMessage({ type: 'modify_ajax_response_init', onoff: result.onoff, data: result.data });
            }
        }
    });
});