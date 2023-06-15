chrome.action.onClicked.addListener(() => {
    console.log('background addListener1');
    chrome.tabs.query({ url: chrome.runtime.getURL('config.html') }, function (tabs) {
        if (tabs.length > 0) {
            let tb = tabs[0];
            chrome.windows.update(tb.windowId, { 'focused': true }, function () {
                chrome.tabs.update(tb.id, { 'active': true });
            });
        }
        else {
            chrome.tabs.create({ url: 'config.html' });
        }
    });
});

chrome.storage.local.get(['on', 'onTime'], (result) => {
    console.log('background get');
    if (result.hasOwnProperty('on') && result.on) {
        if (result.hasOwnProperty('onTime')) {
            var dtDiffer = parseInt(new Date(new Date().toLocaleString()) - new Date(result.onTime)) / 1000;//second
            if (dtDiffer > 24 * 60 * 60) {
                chrome.action.setIcon({ path: "/images/16_gray.png" });
                if (result.hasOwnProperty('on') && result.on) {
                    chrome.storage.local.set({ on: false });
                }
            }
        }
    }
    else {
        chrome.action.setIcon({ path: "/images/16_gray.png" });
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('background addListener 2');
    if (request.type === 'modify_ajax_response_seticon') {
        chrome.action.setIcon({ path: "/images/16_gray.png" });
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log('background addListener 3');
    if (changes.hasOwnProperty('on'))
        console.log(changes.on.newValue);
    if (changes.hasOwnProperty('onTime'))
        console.log(changes.onTime.newValue);
    if (changes.hasOwnProperty('data'))
        console.log(changes.data.newValue);

    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, { from: 'background发出的消息1', to: 'content_scripts发出的消息2' });
    // });

    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     console.log(tabs.length);
    //     console.log(tabs[0].id);

    //     chrome.tabs.sendMessage(tabs[0].id, { type: 'modify_ajax_response_datachange' });
    // });

    // if (changes.hasOwnProperty('on')) {
    //     console.log(changes.on.newValue);
    //     if (changes.on.newValue) {
    //         postMessage({ type: 'modify_ajax_response_change', on: changes.on.newValue });
    //     }
    //     else {
    //         postMessage({ type: 'modify_ajax_response_change', on: changes.on.newValue, data: [] });
    //     }
    // }
    // if (changes.hasOwnProperty('data')) {
    //     console.log(changes.data.newValue);
    // }
});

// function sendMessage(tabId, hostname) {
//     console.log("Sending message to tabId: ", tabId)
//     chrome.tabs.sendMessage(tabId, { hostname: hostname }, (resp) => { console.log("response: ", resp) });
// }

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.url) {
//         console.log(changeInfo.url)
//         var hostname = new URL(changeInfo.url).hostname;
//         sendMessage(tabId, hostname)
//     }
// });