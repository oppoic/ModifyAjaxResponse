chrome.action.onClicked.addListener(() => {
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

chrome.storage.local.get(['onoff', 'onoffTime'], (result) => {
    if (result.hasOwnProperty('onoff') && result.onoff) {
        if (result.hasOwnProperty('onoffTime')) {
            var dtDiffer = parseInt(new Date(new Date().toLocaleString()) - new Date(result.onoffTime)) / 1000;//second
            if (dtDiffer > 24 * 60 * 60) {
                chrome.action.setIcon({ path: "/images/16_gray.png" });
                if (result.hasOwnProperty('onoff') && result.onoff) {
                    chrome.storage.local.set({ onoff: false });
                }
            }
        }
    }
    else {
        chrome.action.setIcon({ path: "/images/16_gray.png" });
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    // for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    //     console.log(key + ' changed:' + oldValue + ' -> ' + newValue);
    // }

    console.log(changes);
    // if (changes.hasOwnProperty('onoff')) {
    //     console.log(changes.onoff.newValue);
    //     if (changes.onoff.newValue) {
    //         postMessage({ type: 'modify_ajax_response_change', onoff: changes.onoff.newValue });
    //     }
    //     else {
    //         postMessage({ type: 'modify_ajax_response_change', onoff: changes.onoff.newValue, data: [] });
    //     }
    // }
    // if (changes.hasOwnProperty('data')) {
    //     console.log(changes.data.newValue);
    // }
});