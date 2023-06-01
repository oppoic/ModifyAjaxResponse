const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('dist/main.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
    chrome.storage.local.get(['onoff', 'data'], function (result) {
        if (result.hasOwnProperty('onoff') && result.hasOwnProperty('data')) {
            postMessage({ onoff: result.onoff, data: result.data });
        }
    });
});