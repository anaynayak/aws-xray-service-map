chrome.pageAction.onClicked.addListener(function (activeTab) {
    chrome.tabs.sendMessage(activeTab.id, { colorize: true });
});

chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({ active: true, currentWindow: true, windowType: 'normal' }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { colorize: true })
    })
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlMatches: '.*\.aws\.amazon\.com\/xray\/home*' },
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});