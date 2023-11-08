chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'config.html' });
});

chrome.storage.local.get(['on', 'onTime']).then((result) => {
    if (result.hasOwnProperty('on') && result.on) {
        if (result.hasOwnProperty('onTime')) {
            var dtDiffer = parseInt(new Date(new Date().toLocaleString()) - new Date(result.onTime)) / 1000;//second
            if (dtDiffer > 24 * 60 * 60) {
                chrome.storage.local.set({ on: false }).then(() => {
                    chrome.action.setIcon({ path: "/images/16_gray.png" });
                });
            }
        }
    }
    else {
        chrome.action.setIcon({ path: "/images/16_gray.png" });
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'modify_ajax_response_seticon') {
        chrome.action.setIcon({ path: "/images/16_gray.png" });
    }
});