function read() {
    return {
        nodes: getNodes(),
        edges: getEdges()
    };
}

function getNodes() {
    return $("g.node.clickable").map(function () {
        var self = $(this);
        return {
            title: self.children("title").text(),
            rpm: sanitizeRpm(self.children(".req-per-min").text().replace(/t\/min/g, '')),
            type: self.children("text.legend-type").text(),
            id: self.attr('class').match(/\d+/g)[0],
            ref: self
        };
    }).toArray()
}

function getEdges() {
    var linked = /\d+/g;
    var numLinks = $("path.link").length
    var edges = new Map();
    $("path.link").each(function () {
        var [from, to] = $(this).attr('class').match(linked);
        var mapping = (edges.get(from) || [])
        mapping.push(to);
        edges.set(from, mapping);
    });
    return edges;
}

function sanitizeRpm(reqs) {
    if (parseFloat(reqs)) {
        return parseFloat(reqs) * (reqs.includes('k') ? 1000 : 1);
    }
}
function colorize(nodes, edges, config, scale) {
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
        if (config.highlightSelectedNodeEdges) {
            node.ref.click(function () {
                processClick(node, edges);
            });
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

function processClick(node, edges) {
    var links = edges.get(node.id);
    $('path.link').removeClass('link-selected');
    if (!links || !node.ref.hasClass('node-selected')) {
        return
    }

    links.forEach(function (l) {
        $(`path.link.n${node.id}-n${l}`).addClass('link-selected');
    });
}

function groupColor(graph, config) {
    var nodesPerType = graph.nodes.reduce(function (acc, n) {
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
        colorize(nodesPerType[type], graph.edges, config, scales[type] || scales[type.split(":")[0]] || defaultScale);
    })
}

chrome.runtime.onMessage.addListener(function callback(message, sender) {
    chrome.storage.sync.get({
        highlightNodes: '(prd|Prod)',
        hideNodes: "(dev|Dev|e2e|E2E)",
        highlightSelectedNodeEdges: true
    }, function (config) {
        var graph = read()
        groupColor(graph, config);
    });
});
