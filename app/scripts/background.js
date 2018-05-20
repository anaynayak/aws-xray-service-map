chrome.browserAction.onClicked.addListener(function (activeTab) {
    chrome.tabs.sendMessage(activeTab.id, { colorize: true });
});

chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({ active: true, currentWindow: true, windowType: 'normal' }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { colorize: true })
    })
});