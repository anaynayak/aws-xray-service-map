function colorize(highlightNodes, hideNodes) {
    var nodes = $("g.node title").toArray();
    var highlight = new RegExp(highlightNodes);
    var hide = new RegExp(hideNodes);

    nodes.forEach(function (n) {
        var node = $(n);
        if (highlight.test(node.text())) {
            node.parent().children('circle').css('fill', 'lightskyblue');
        }
        if (hide.test(node.text())) {
            node.parent().css('opacity', 0.5);
        }
    });

    var map = new Map();
    $(".req-per-min").each(function () {
        var reqs = $(this).text().replace(/t\/min/g, '');
        if (parseFloat(reqs)) {
            var requests = parseFloat(reqs) * (reqs.includes('k') ? 1000 : 1);
            map.set($(this), Math.log(requests));
        }
    });

    var perc2color = chroma.scale(['lightgreen', 'yellow', 'red'])
        .domain([1, 0])
        .padding(0.15)
        .classes(chroma.limits(Array.from(map.values()), 'e', 10));

    map.forEach(function (reqs, elem) {
        var color = perc2color(reqs).hex();
        elem.parent().children('circle').css('fill', color);
    });
}
chrome.runtime.onMessage.addListener(function callback(message, sender) {
    chrome.storage.sync.get({
        highlightNodes: '(prd|Prod)',
        hideNodes: "(dev|Dev|e2e|E2E)"
    }, function (data) {
        colorize(data.highlightNodes, data.hideNodes);
    });
});
