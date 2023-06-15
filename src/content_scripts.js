const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('dist/pageInjectScript.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
    console.log('content_scripts addEventListener');
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

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     console.log(sender.tab);
//     console.log(sender.tab.url);
//     // if (request.type == 'modify_ajax_response_datachange') {
//     //     postMessage({ type: 'modify_ajax_response_datachange' });
//     // }
// });

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     console.log(request);
// });


// function logMessage(message) {
//     console.log("Message from background: ", message)
// }

// chrome.runtime.onMessage.addListener(
//     (request, sender, sendResponse) => {
//         logMessage(request.hostname)
//     }
// );