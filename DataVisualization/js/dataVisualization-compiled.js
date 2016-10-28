/**
 * Created by chinghsu on 16/10/21.
 */
var heightOffset = document.body.offsetHeight / 2;
var widthOffset = document.body.offsetWidth / 2;
var rayConfig = {
    dash: 50
};
var map = new Datamap({
    scope: 'chn',
    element: document.getElementById('container'),
    setProjection: function (element) {
        var projection = d3.geo.mercator().center([103.8406920000, 36.0673120000]).rotate([0, 0]).scale(1000).translate([widthOffset, heightOffset]);
        var path = d3.geo.path().projection(projection);

        return { path: path, projection: projection };
    },
    fills: {
        'CNSH': '#2ca02c',
        'CNJXGZ': '#8c564b',
        'CNSCCD': '#e377c2',
        'CNJSXZ': '#ff7f0e',
        defaultFill: '#0D151F'
    },
    geographyConfig: {
        highlightFillColor: '#000000'
    },
    data: {
        'CNSH': { fillKey: 'CNSH' },
        'CNJXGZ': { fillKey: 'CNJXGZ' },
        'CNSCCD': { fillKey: 'CNSCCD' },
        'CNJSXZ': { fillKey: 'CNJSXZ' }
    }
});

var getX = function (startX, radius, angle) {
    return startX + radius * Math.cos(angle);
};

var getY = function (startY, radius, angle) {
    return startY + radius * Math.sin(angle);
};

var generatePentaclePoints = function (x, y, radius, rotation, shape) {
    var angle, i, j, len, ref, results;
    if (rotation == null) {
        rotation = 0;
    }
    rotation = (rotation - 18) * Math.PI / 180;
    var points = [];

    var angle1 = 2 * Math.PI / shape;
    var angle2 = Math.PI / shape;
    // var angle2=(shape-2)*Math.PI/shape/2;

    for (var i = 0; i < 2 * shape; i++) {
        var point = {};
        angle = i * (Math.PI / shape) + rotation;
        // point.x = getX(x, (i % 2 == 0) ? radius : (radius * Math.cos(2 * Math.PI / shape) / Math.cos(Math.PI / shape)), angle);
        point.x = getX(x, i % 2 == 0 ? radius : radius * Math.cos(angle1) / Math.cos(angle2) / 1, angle);
        // point.y = getY(y, (i % 2 == 0) ? radius : (radius * Math.cos(2 * Math.PI / shape) / Math.cos(Math.PI / shape)), angle);
        point.y = getY(y, i % 2 == 0 ? radius : radius * Math.cos(angle1) / Math.cos(angle2) / 1, angle);
        points.push(point);
    }

    points.push(points[0]);
    return points;
};

var bombs = [{
    name: '上海',
    radius: 10,
    yield: 400,
    country: '中国',
    fillKey: 'CNSH',
    significance: 'Ethicall医时科技',
    date: '2016-10-22',
    latitude: 31.22,
    longitude: 121.48
}, {
    name: '赣州',
    radius: 20,
    yield: 400,
    country: '中国',
    fillKey: 'CNJXGZ',
    significance: '江西赣州',
    date: '2016-10-22',
    latitude: 25.83,
    longitude: 114.93
}, {
    name: '徐州',
    radius: 25,
    yield: 400,
    country: '中国',
    fillKey: 'CNJSXZ',
    significance: '江西赣州',
    date: '2016-10-22',
    latitude: 34.21,
    longitude: 117.29
}, {
    name: '成都',
    radius: 15,
    yield: 400,
    country: '中国',
    fillKey: 'CNSCCD',
    significance: '江西赣州',
    date: '2016-10-22',
    latitude: 30.57,
    longitude: 104.07
}];

map.bubbles(bombs, {
    popupTemplate: function (geo, data) {
        return ['<div class="hoverinfo">' + data.name, '<br/>拜访信使数: ' + data.yield + ' 人', '<br/>城市: ' + data.country + '', '<br/>日期: ' + data.date + '', '</div>'].join('');
    }
});

// var svg = document.querySelector("svg");
// var coords = [121.48,31.22];
// var projection = d3.geo.mercator();
// var xy=projection(coords);
// d3.select("svg").append("circle").attr({
//     cx:xy[0],
//     cy:xy[1],
//     r:10,
//     fill:"red",
//     class:"shanghai"
// });

// setTimeout(function(){
//     var line = d3.select("svg").append("line")
//         .attr("x1",0)
//         .attr("y1",0)
//         .attr("x2",939)
//         .attr("y2",408)
//         .attr("stroke","red")
//         .attr("stroke-width",2)
//         .attr("marker-end","url(#arrow)");
//
// },2000);
var lineData = [{
    "x": 0,
    "y": 100
}, {
    "x": 600,
    "y": 100
}];
setTimeout(function () {
    // var path = d3.select("svg").append("line")
    //     .x(function(d){return d.x;})
    //     .y(function(d){return d.y;})
    //     .attr("stroke","red")
    //     .attr("stroke-width",2)
    //     .attr("marker-end","url(#arrow)");
    var line = d3.svg.line().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).interpolate("linear");
    var path = d3.select("svg").append("path").attr("d", line(lineData)).attr("stroke-dasharray", function () {
        var dash = rayConfig.dash;
        var gap = this.getTotalLength();
        return dash + " " + gap;
    }).attr("stroke-dashoffset", function () {
        var length = this.getTotalLength();
        return 0;
        // return rayConfig.dash;
    }).attr("class", "svgRay").attr("stroke", "red").attr("stroke-width", 2).attr("fill", "red").transition().duration(1000).ease("ease-out").attr("stroke-dashoffset", function () {
        return -this.getTotalLength();
    }).each("end", function () {
        console.log(this);
        d3.select(this).attr("d", line(generatePentaclePoints(600, 100, 50, 0, 5))).attr("stroke-dasharray", 0).attr("stroke-dashoffset", 0).style({
            fill: 'none',
            stroke: '#FFFFFF',
            "stroke-width": 1,
            "transform-origin": "600px 100px"
        });
        // this.style.transformOrigin="600px 100px";
        // this.classList.add("star");
    });
    // setTimeout(function(){
    //     line.attr("stroke-dashoffset",function(d){
    //         return -this.getTotalLength();
    //     });
    // },1000);
}, 2000);

//# sourceMappingURL=dataVisualization-compiled.js.map