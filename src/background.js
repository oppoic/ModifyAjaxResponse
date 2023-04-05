chrome.action.onClicked.addListener(function () {
    chrome.tabs.create({ url: 'default.html' })
});