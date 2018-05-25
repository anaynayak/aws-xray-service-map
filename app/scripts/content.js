function read() {
    return $("g.node.clickable").map(function () {
        var self = $(this);
        return {
            title: self.children("title").text(),
            rpm: sanitizeRpm(self.children(".req-per-min").text().replace(/t\/min/g, '')),
            type: self.children("text.legend-type").text(),
            ref: self
        };
    }).toArray();
}

function sanitizeRpm(reqs) {
    if (parseFloat(reqs)) {
        return parseFloat(reqs) * (reqs.includes('k') ? 1000 : 1);
    }
}
function colorize(nodes, config, scale) {
    var highlight = new RegExp(config.highlightNodes);
    var hide = new RegExp(config.hideNodes);
    var map = new Map();

    nodes.forEach(function (node) {
        if (highlight.test(node.title)) {
            node.ref.children('circle').css('fill', 'lightskyblue');
        }
        if (hide.test(node.title)) {
            node.ref.css('opacity', 0.5);
        }
        if (node.rpm) {
            map.set(node.ref, Math.log(node.rpm));
        }
    });

    var perc2color = scale
        .domain([1, 0])
        .padding(0.15)
        .classes(chroma.limits(Array.from(map.values()), 'e', 10));

    map.forEach(function (reqs, elem) {
        var color = perc2color(reqs).hex();
        elem.children('circle').css('fill', color);
    });
}

function groupColor(nodes, data) {
    var nodesPerType = nodes.reduce(function (acc, n) {
        (acc[n.type] = acc[n.type] || []).push(n)
        return acc;
    }, {});

    var defaultScale = chroma.scale(['white', 'slategray']);
    var scales = {
        'AWS': chroma.scale(['white', '#c97e5c']),
        'AWS::ElasticBeanstalk::Environment': chroma.scale(['white', '#c97e5c']),
        'remote': defaultScale,
        'AWS::DynamoDB::Table': chroma.scale(['lightgreen', 'yellow', 'red']),
    };
    Object.keys(nodesPerType).forEach(function (type, i) {
        colorize(nodesPerType[type], data, scales[type] || scales[type.split(":")[0]] || defaultScale);
    })
}

chrome.runtime.onMessage.addListener(function callback(message, sender) {
    chrome.storage.sync.get({
        highlightNodes: '(prd|Prod)',
        hideNodes: "(dev|Dev|e2e|E2E)"
    }, function (data) {
        var nodes = read()
        groupColor(nodes, data);
    });
});
