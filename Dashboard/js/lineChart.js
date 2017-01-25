/**
 * Created by chinghsu on 16/12/27.
 */
var timeformat = d3.timeFormat("%Y-%m");

var parseTime = d3.timeFormat;

function lineChart() {
    var _chart = {};
    var _width = screen.width * 0.6;
    var _height = 500;
    var _margin = {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50
    };
    var _svg;
    var _x;
    var _y;
    var _bodyG;
    var _data = [];
    var _colors = d3.scaleOrdinal(d3.schemeCategory10);

    _chart.render = function () {
        if (!_svg) {
            _svg = d3.select("body").append("div")
                .attr("class", "chart")
                .style("text-align", "center")
                .append("svg")
                .attr("height", _height)
                .attr("width", _width);
//            画轴
            renderAxes(_svg);
            defineBodyClip(_svg);
        }

//        画图表
        renderBody(_svg);
    };

    _chart.update = function () {
        minvalue = 0, maxvalue = 0, mindate = 0, maxdate = 0;
        d3.json("../data/medicine2.json", function (rawData) {
            //
            var data = [];
            names = d3.keys(rawData);
            names.forEach(function (name) {
                var list = rawData[name].map(function (item) {
                    return {
                        "date": new Date(item.date),
                        "value": item.value
                    }
                });
                //get min and max value
                minvalue = minvalue > 0 ? d3.min([minvalue, d3.min(list, function (d) {
                    return d.value;
                })]) : d3.min(list, function (d) {
                    return d.value;
                });

                maxvalue = d3.max([maxvalue, d3.max(list, function (d) {
                    return d.value;
                })]);

                //get min and max date

                mindate = d3.min(list, function (d) {
                    return d.date;
                });

                maxdate = d3.max(list, function (d) {
                    return d.date;
                });

                data.push(list);
            });
            _data = [];
            // chart.x(d3.scaleTime().domain([mindate, maxdate]))
            //     .y(d3.scaleLinear().domain([minvalue, maxvalue]));
            data.forEach(function (series) {
                chart.addSeries(series);
            });
            updateChart();
        });
    };

    function defineBodyClip(svg) {

        svg.append("defs")
            .append("clipPath")
            .attr("id", "body-clip")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", _width)
            .attr("height", _height);
    }

    function renderXAxis(axesG) {
        var xAxis = _x.rangeRound([0, quadrantWidth()]);
//                    y = d3.scaleLinear().rangeRound([height, 0]);
        axesG.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + xStart() + "," + (quadrantHeight() + yEnd()) + ")")
            .call(d3.axisBottom(xAxis))
            .append("text")
            .attr("x", quadrantWidth() / 2)
            .attr("y", 30)
            .attr("stroke", "black")
            .attr("text-anchor", "center")
            .text("Month");

//
        d3.selectAll("g.x g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("stroke", "#dcdcdc")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", -quadrantHeight());
    }

    function renderYAxis(axesG) {
        var yAxis = _y.rangeRound([quadrantHeight(), 0]);
//                    y = d3.scaleLinear().rangeRound([height, 0]);
        axesG.append("g")
            .attr("class", "axis y")
            .attr("transform", "translate(" + xStart() + "," + yEnd() + ")")
            .call(d3.axisLeft(yAxis).ticks(8))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -xStart() / 1.2)
            .attr("x", -quadrantHeight() / 2)
            .attr("stroke", "black")
            .attr("text-anchor", "end")
            .text("Value");

        d3.selectAll("g.y g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("stroke", "#dcdcdc")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", quadrantWidth())
            .attr("y2", 0);
    }

    function renderAxes(svg) {
        var axesG = svg.append("g")
            .attr("class", "axes");

        renderXAxis(axesG);

        renderYAxis(axesG);
    }

    function renderLines() {
        _line = d3.line()
            .x(function (d) {
                return _x(d.date);
            })
            .y(function (d) {
                return _y(d.value);
            });

        _bodyG.selectAll("path.line")
            .data(_data)
            .enter()
            .append("path")
            .style("stroke", function (d, i) {
                return _colors(i);
            })
            .attr("class", "line");

        // _bodyG.selectAll("path.line")
        //     .data(_data)
        //     .exit()
        //     .remove();
        //
        _bodyG.selectAll("path.line")
            .attr("d", function (d) {
                return _line(d);
            })
            .attr("stroke-dasharray", function (d) {
                return this.getTotalLength();
            })
            .attr("stroke-dashoffset", function (d) {
                return this.getTotalLength();
            })
            .transition()
            .delay(1000)
            .duration(3000)
            .attr("stroke-dashoffset", function () {
                return 0;
            })
            .on('end', function () {
                renderDots();
            });
    }

    function updateChart() {
        if (!_bodyG)
            _bodyG = _svg.append("g")
                .attr("class", "body")
                .attr("transform", "translate("
                    + xStart() + ","
                    + yEnd() + ")");

        _data.forEach(function (list, i) {
            _bodyG.selectAll("circle._" + i)
                .data([])
                .exit()
                .remove();
        });
        _bodyG.selectAll("path.line")
            .data(_data)
            .enter()
            .transition()
            // .append("path")
            .style("stroke", function (d, i) {
                return _colors(i);
            })
            .attr("class", "line");

        // _bodyG.selectAll("path.line")
        //     .data(_data)
        //     .exit()
        //     .remove();
        //
        _bodyG.selectAll("path.line")
            .attr("d", function (d) {
                return _line(d);
            })
            // .attr("stroke-dasharray", function (d) {
            //     return this.getTotalLength();
            // })
            // .attr("stroke-dashoffset", function (d) {
            //     return this.getTotalLength();
            // })
            .transition()
            // .delay(1000)
            .duration(3000)
            // .attr("stroke-dashoffset", function () {
            //     return 0;
            // })
            .on('end', function () {
                // updateDots();
            });
    }

    function updateDots() {
        _data.forEach(function (list, i) {
            _bodyG.selectAll("circle._" + i)
                .data(list)
                .enter()
                .append("circle")
                .attr("class", "dot _" + i);

            _bodyG.selectAll("circle._" + i)
                .data(list)
                .exit()
                .remove();

            _bodyG.selectAll("circle._" + i)
                .data(list)
                .style("stroke", function (d) {
                    return _colors(i);
                })
                .attr("cx", function (d) {
                    return _x(d.date);
                })
                .attr("cy", function (d) {
                    return _y(d.value);
                })
                .attr("r", 0)
                .transition()
                .delay(function (d, i) {
                    return 200 * i;
                })
                .duration(500)
                .ease(d3.easeBounce)
                .attr("r", 4.5);

        });
    }


    function renderDots() {
        _data.forEach(function (list, i) {
            _bodyG.selectAll("circle._" + i)
                .data(list)
                .enter()
                .append("circle")
                .attr("class", "dot _" + i);

            _bodyG.selectAll("circle._" + i)
                .data(list)
                .exit()
                .remove();

            _bodyG.selectAll("circle._" + i)
                .data(list)
                .style("stroke", function (d) {
                    return _colors(i);
                })
                .attr("cx", function (d) {
                    return _x(d.date);
                })
                .attr("cy", function (d) {
                    return _y(d.value);
                })
                .attr("r", 0)
                .transition()
                .delay(function (d, i) {
                    return 200 * i;
                })
                .duration(500)
                .ease(d3.easeBounce)
                .attr("r", 4.5);

        });
    }

    function xStart() {
        return _margin.left;
    }

    function yStart() {
        return _height - _margin.bottom;
    }

    function xEnd() {
        return _width - _margin.right;
    }

    function yEnd() {
        return _margin.top;
    }

    function quadrantWidth() {
        return _width - _margin.left - _margin.right;
    }

    function quadrantHeight() {
        return _height - _margin.top - _margin.bottom;
    }

    function renderBody(svg) {
        if (!_bodyG)
            _bodyG = svg.append("g")
                .attr("class", "body")
                .attr("transform", "translate("
                    + xStart() + ","
                    + yEnd() + ")")
        // .attr("clip-path", "url(#body-clip)");

        renderLines();
//
//         renderDots();
    }

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };

    _chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };

    _chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };

    _chart.addSeries = function (series) {
        _data.push(series);
        // return _chart;
    };

    return _chart;
}


var minvalue = 0, maxvalue = 0;
var mindate = 0, maxdate = 0;
var chart;

d3.json("../data/medicine.json", function (rawData) {
    var data = [];
    names = d3.keys(rawData);
    names.forEach(function (name) {
        var list = rawData[name].map(function (item) {
            return {
                "date": new Date(item.date),
                "value": item.value
            }
        });
        //get min and max value
        minvalue = minvalue > 0 ? d3.min([minvalue, d3.min(list, function (d) {
            return d.value;
        })]) : d3.min(list, function (d) {
            return d.value;
        });

        maxvalue = d3.max([maxvalue, d3.max(list, function (d) {
            return d.value;
        })]);

        //get min and max date

        mindate = d3.min(list, function (d) {
            return d.date;
        });

        maxdate = d3.max(list, function (d) {
            return d.date;
        });

        data.push(list);
    });
    chart = lineChart()
        .x(d3.scaleTime().domain([mindate, maxdate]))
        .y(d3.scaleLinear().domain([minvalue, maxvalue]));
    data.forEach(function (series) {
        chart.addSeries(series);
    });
    chart.render();
    // chart.update();
    // 单击的时候，更新数据
    d3.select("button").on("click", function () {
        // 新数据集
        // 更新所有矩形
        chart.update();
    });
});

