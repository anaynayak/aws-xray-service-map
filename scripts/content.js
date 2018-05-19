function colorize() {
    var highlightEnvs = 'Prod,prd'.split(",");
    var hideEnvs = 'dev,Dev,e2e,E2E'.split(",");
    highlightEnvs.forEach(function (env) {
        $("g title:contains(" + env + ".)").parent().children('circle').css('fill', 'lightskyblue');
    });

    hideEnvs.forEach(function (env) {
        $("g title:contains(" + env + ".)").parent().css('opacity', 0.5);
    });

    function perc2color(perc) {
        var r, g, b = 0;
        if (perc < 50) {
            r = 255;
            g = Math.round(5.1 * perc);
        }
        else {
            g = 255;
            r = Math.round(510 - 5.10 * perc);
        }
        var h = r * 0x10000 + g * 0x100 + b * 0x1;
        return '#' + ('000000' + h.toString(16)).slice(-6);
    }

    var map = new Map();
    $(".req-per-min").each(function () {
        var reqs = $(this).text().replace(/t\/min/g, '');
        if (parseInt(reqs)) {
            var requests = parseFloat(reqs) * (reqs.includes('k') ? 1000 : 1);
            map.set($(this), Math.log(requests));
        }
    });

    var max = Array.from(map.values()).reduce(function (a, b) {
        return Math.max(a, b);
    })
    map.forEach(function (reqs, elem) {
        var color = perc2color(100 - (reqs * 100 / max))
        elem.parent().children('circle').css('fill', color);
    });
}
chrome.runtime.onMessage.addListener(function callback(message, sender) {
    colorize();
});
