const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('dist/pageInjectScript.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
    chrome.storage.local.get(['on', 'onTime', 'data'], function (result) {
        if (result.hasOwnProperty('on') && result.on && result.hasOwnProperty('onTime') && result.hasOwnProperty('data') && result.data.length > 0) {
            var dtDiffer = parseInt(new Date(new Date().toLocaleString()) - new Date(result.onTime)) / 1000;//second
            if (dtDiffer > 24 * 60 * 60) {
                chrome.storage.local.set({ on: false });
                chrome.runtime.sendMessage({ type: "modify_ajax_response_seticon" });
            }
            else {
                postMessage({ type: 'modify_ajax_response_init', on: result.on, data: result.data });
            }
        }
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    chrome.storage.local.get(['on', 'data'], function (result) {
        if (changes.hasOwnProperty('on')) {
            postMessage({ type: 'modify_ajax_response_datachange', on: changes.on.newValue, data: result.data });
        }
        if (changes.hasOwnProperty('data')) {
            postMessage({ type: 'modify_ajax_response_datachange', on: result.on, data: changes.data.newValue });
        }
    });
});