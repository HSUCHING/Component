/**
 * Created by chinghsu on 16/12/25.
 */
function getData() {
    var lineNum = Math.round(Math.random() * 10) % 3 + 1;
    var dataNum = Math.round(Math.round(Math.random() * 10)) + 5;
    oldData = dataset;
    dataset = [];
    xMarks = [];
    lineNames = [];
    for (i = 0; i < dataNum; i++) {
        xMarks.push("标签" + i);
    }
    for (i = 0; i < lineNum; i++) {
        var tempArr = [];
        for (j = 1; j < dataNum; j++) {
            tempArr.push(Math.round(Math.random() * h));
        }
        dataset.push(tempArr);
        lineNames.push("系列" + i);
    }
}

function CrystalLineObject() {
    this.group = null;
    this.path = null;
    this.oldData = [];
    this.init = function (id) {
        var arr = dataset[id];
        this.group = svg.append("g");
        var line = d3.line()
            .x(function (d, i) {
                return xScale(i);
            })
            .y(function (d) {
                return yScale(d);
            });
//添加折线
        this.path = this.group.append("path")
            .attr("d", line(arr))
            .style("fill", "none")
            .style("stroke-width", 1)
            .style("stroke", lineColor[id])
            .style("stroke-opacity", 0.9);
//添加系列的小圆点
        this.group.selectAll("circle")
            .data(arr)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                return xScale(i);
            })
            .attr("cy", function (d) {
                return yScale(d);
            })
            .attr("r", 5)
            .attr("fill", lineColor[id]);
        this.oldData = arr;
    };
    //动画初始化方法
    this.movieBegin = function (id) {
        var arr = dataset[i];
//补足/删除路径
        var olddata = this.oldData;
        var line = d3.line()
            .x(function (d, i) {
                if (i >= olddata.length) return w - padding; else return xScale(i);
            })
            .y(function (d, i) {
                if (i >= olddata.length) return h - foot_height; else return yScale(olddata[i]);
            });
//路径初始化
        this.path.attr("d", line(arr));
//截断旧数据
        var tempData = olddata.slice(0, arr.length);
        var circle = this.group.selectAll("circle").data(tempData);
//删除多余的圆点
        circle.exit().remove();
//圆点初始化，添加圆点,多出来的到右侧底部
        this.group.selectAll("circle")
            .data(arr)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                if (i >= olddata.length) return w - padding; else return xScale(i);
            })
            .attr("cy", function (d, i) {
                if (i >= olddata.length) return h - foot_height; else return yScale(d);
            })
            .attr("r", 5)
            .attr("fill", lineColor[id]);
        this.oldData = arr;
    };
//重绘加动画效果
    this.reDraw = function (id, _duration) {
        var arr = dataset[i];
        var line = d3.line()
            .x(function (d, i) {
                return xScale(i);
            })
            .y(function (d) {
                return yScale(d);
            });
//路径动画
        this.path.transition().duration(_duration).attr("d", line(arr));
//圆点动画
        this.group.selectAll("circle")
            .transition()
            .duration(_duration)
            .attr("cx", function (d, i) {
                return xScale(i);
            })
            .attr("cy", function (d) {
                return yScale(d);
            })
    };
//从画布删除折线
    this.remove = function () {
        this.group.remove();
    };
}

function addLegend() {
    var textGroup = legend.selectAll("text")
        .data(lineNames);
    textGroup.exit().remove();
    legend.selectAll("text")
        .data(lineNames)
        .enter()
        .append("text")
        .text(function (d) {
            return d;
        })
        .attr("class", "legend")
        .attr("x", function (d, i) {
            return i * 100;
        })
        .attr("y", 0)
        .attr("fill", function (d, i) {
            return lineColor[i];
        });
    var rectGroup = legend.selectAll("rect")
        .data(lineNames);
    rectGroup.exit().remove();
    legend.selectAll("rect")
        .data(lineNames)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return i * 100 - 20;
        })
        .attr("y", -10)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", function (d, i) {
            return lineColor[i];
        });
    legend.attr("transform", "translate(" + ((w - lineNames.length * 100) / 2) + "," + (h - 10) + ")");
}

function getMaxdata(arr) {
    maxdata = 0;
    for (i = 0; i < arr.length; i++) {
        maxdata = d3.max([maxdata, d3.max(arr[i])]);
    }
    return maxdata;
}

var dataset = [];
var lines = []; //保存折线图对象
var xMarks = [];
var lineNames = []; //保存系列名称
var lineColor = ["#F00", "#09F", "#0F0"];
var w = 600;
var h = 400;
var padding = 40;
var currentLineNum = 0;
var head_height = padding;
var title = "收支平衡统计图";
var subTitle = "2017年1月 至 2017年6月";
var foot_height = padding;
getData();


if (!(dataset[0] instanceof Array)) {
    var tempArr = [];
    tempArr.push(dataset);
    dataset = tempArr;
}

currentLineNum = dataset.length;
foot_height += 25;

var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


//添加背景
svg.append("g")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", w)
    .attr("height", h)
    .style("fill", "#FFF")
    .style("stroke-width", 2)
    .style("stroke", "#E7E7E7");

//添加标题
if (title != "") {
    svg.append("g")
        .append("text")
        .text(title)
        .attr("class", "title")
        .attr("x", w / 2)
        .attr("y", head_height);

    head_height += 30;
}
//添加副标题
if (subTitle != "") {
    svg.append("g")
        .append("text")
        .text(subTitle)
        .attr("class", "subTitle")
        .attr("x", w / 2)
        .attr("y", head_height);

    head_height += 20;
}


maxdata = getMaxdata(dataset);

//横坐标轴比例尺
var xScale= d3.scaleLinear().range([padding, w - padding]).domain([0, dataset[0].length - 1]);

//纵坐标轴比例尺
var yScale= d3.scaleLinear().range([h - foot_height, head_height]).domain([0, maxdata]);

//定义横轴网格线
var xInner = d3.axisLeft()
    .scale(xScale)
    .tickSize(-(h - head_height - foot_height), 0, 0)
    .tickFormat("")
    .ticks(dataset[0].length);

//添加横轴网格线
var xInnerBar = svg.append("g")
    .attr("class", "inner_line")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xInner);

//定义纵轴网格线
var yInner = d3.axisTop()
    .scale(yScale)
    .tickSize(-(w - padding * 2), 0, 0)
    .tickFormat("")
    .ticks(10);

//添加纵轴网格线
var yInnerBar = svg.append("g")
    .attr("class", "inner_line")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yInner);

//定义横轴
var xAxis = d3.axisLeft()
    .scale(xScale)
    .ticks(dataset[0].length);

//添加横坐标轴
var xBar = svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - foot_height) + ")")
    .call(xAxis);

//通过编号获取对应的横轴标签
xBar.selectAll("text")
    .text(function (d) {
        return xMarks[d];
    });

//定义纵轴
var yAxis = d3.axisBottom()
    .scale(yScale)
    .ticks(10);

//添加纵轴
var yBar = svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

//添加图例
var legend = svg.append("g");

addLegend();

//添加折线
lines = [];
for (i = 0; i < currentLineNum; i++) {
    var newLine = new CrystalLineObject();
    newLine.init(i);
    lines.push(newLine);
}

//重新作图
function drawChart() {
    var _duration = 1000;

    getData();

    addLegend();

    //设置线条动画起始位置
    var lineObject = new CrystalLineObject();

    for (i = 0; i < dataset.length; i++) {
        if (i < currentLineNum) {
            //对已有的线条做动画
            lineObject = lines[i];
            lineObject.movieBegin(i);
        }
        else {
            //如果现有线条不够，就加上一些
            var newLine = new CrystalLineObject();
            newLine.init(i);
            lines.push(newLine);
        }
    }

    //删除多余的线条，如果有的话
    if (dataset.length < currentLineNum) {
        for (i = dataset.length; i < currentLineNum; i++) {
            lineObject = lines[i];
            lineObject.remove();
        }
        lines.splice(dataset.length, currentLineNum - dataset.length);
    }

    maxdata = getMaxdata(dataset);
    newLength = dataset[0].length;
    //横轴数据动画
    xScale.domain([0, newLength - 1]);
    xAxis.scale(xScale).ticks(newLength);
    xBar.transition().duration(_duration).call(xAxis);
    xBar.selectAll("text").text(function (d) {
        return xMarks[d];
    });
    xInner.scale(xScale).ticks(newLength);
    xInnerBar.transition().duration(_duration).call(xInner);

    //纵轴数据动画
    yScale.domain([0, maxdata]);
    yBar.transition().duration(_duration).call(yAxis);
    yInnerBar.transition().duration(_duration).call(yInner);

    //开始线条动画
    for (i = 0; i < lines.length; i++) {
        lineObject = lines[i];
        lineObject.reDraw(i, _duration);
    }

    currentLineNum = dataset.length;
    dataLength = newLength;
}