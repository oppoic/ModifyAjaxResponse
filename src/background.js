chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ url: chrome.runtime.getURL('config.html') }, function (tabs) {
        if (tabs.length > 0) {
            let tb = tabs[0];
            chrome.windows.update(tb.windowId, { 'focused': true/*, 'drawAttention': true*/ }, function () {
                chrome.tabs.update(tb.id, { 'active': true });
            });
        }
        else {
            chrome.tabs.create({ url: 'config.html' });
        }
    });
});