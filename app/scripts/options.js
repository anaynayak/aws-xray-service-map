function saveOptions(event) {
    event.preventDefault();
    var highlightNodes = document.getElementById('highlightNodes').value;
    var hideNodes = document.getElementById('hideNodes').value;
    var highlightSelectedNodeEdges = document.getElementById('highlightSelectedNodeEdges').checked;
    if (!isValid(highlightNodes) || !isValid(hideNodes)) {
        showStatus('Invalid regex for highlightNodes/hideNodes');
        return false;
    }
    chrome.storage.sync.set({
        highlightNodes: highlightNodes,
        hideNodes: hideNodes,
        highlightSelectedNodeEdges: highlightSelectedNodeEdges
    }, function () {
        showStatus('Options saved.');
    });
    return false;
}

function showStatus(text) {
    var status = document.getElementById('status');
    status.textContent = text;
    setTimeout(function () {
        status.textContent = '';
    }, 1750);
}

function isValid(text) {
    try {
        new RegExp(text)
        return true;
    } catch {
        return false;
    }
}

function restoreOptions() {
    chrome.storage.sync.get({
        highlightNodes: '(prd|Prod)',
        hideNodes: "(dev|Dev|e2e|E2E)",
        highlightSelectedNodeEdges: true
    }, function (items) {
        document.getElementById('highlightNodes').value = items.highlightNodes;
        document.getElementById('hideNodes').value = items.hideNodes;
        document.getElementById('highlightSelectedNodeEdges').checked = items.highlightSelectedNodeEdges;
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);