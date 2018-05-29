function executeAll(id, scripts, cb) {
    if (!scripts.length) {
        cb.apply();
        return;
    }
    chrome.tabs.executeScript(id, {
        file: scripts[0]
    }, function (resp) {
        executeAll(id, scripts.slice(1), cb)
    });
}

chrome.pageAction.onClicked.addListener(function (activeTab) {
    var scripts = ['scripts/jquery-3.3.1.min.js', 'scripts/chroma.min.js', 'scripts/content.js']
    executeAll(activeTab.id, scripts, function () {
        chrome.tabs.sendMessage(activeTab.id, { colorize: true })
    });
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