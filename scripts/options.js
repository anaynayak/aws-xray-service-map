function saveOptions() {
    var highlightNodes = document.getElementById('highlightNodes').value;
    var hideNodes = document.getElementById('hideNodes').value;
    chrome.storage.sync.set({
        highlightNodes: highlightNodes,
        hideNodes: hideNodes
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        highlightNodes: '(Prd,Prod)',
        hideNodes: "(dev|Dev|e2e|E2E)"
    }, function (items) {
        document.getElementById('highlightNodes').value = items.highlightNodes;
        document.getElementById('hideNodes').value = items.hideNodes;
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);