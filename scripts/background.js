chrome.browserAction.onClicked.addListener(function (activeTab) {
    // chrome.tabs.executeScript(null, { file: "content.js" });    
    chrome.tabs.query({ active: true, currentWindow: true, windowType: 'normal' }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { colorize: true })
    })

});
