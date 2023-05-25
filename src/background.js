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

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(key + ' changed:' + oldValue + ' -> ' + newValue);
    }
});