const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('dist/main.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
    chrome.storage.local.get(['onoff', 'data'], function (result) {
        if (result.hasOwnProperty('onoff') && result.onoff && result.hasOwnProperty('data') && result.data.length > 0) {
            postMessage({ type: 'modify_ajax_response_init', onoff: result.onoff, data: result.data });
        }
    });
});