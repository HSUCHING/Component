/**
 * Created by chinghsu on 16/12/25.
 */
var height = 400, width = 900;
margin = {top: 30, right: 30, bottom: 30, left: 30};
var svg = d3.select("svg").attr("width", width).attr("height", height).style("margin-left", "50%");
var g = svg.attr("class", "axis")
    .attr("width", width)
    .attr("height", height)
    .append("g");

g.append("rect")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.bottom - margin.top)
    .style("fill", "#EEEEEE")
    .style("stroke-width", 2)
    .style("stroke", "#E7E7E7");

//纵轴网格线,横轴网格线
var x = d3.scaleLinear()
    .domain([0, 120])
    .range([0, width - margin.left - margin.right]);
var y = d3.scaleLinear()
    .domain([20, 200])
    .range([height - margin.bottom - margin.top, 0]);

var color = d3.scaleLinear()
    .domain([10, 100])
    .range(["brown", "steelblue"]);

// var xScale = d3.scaleLinear().range([0, 900]).domain([0, 9000]);
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
    // .call(d3.axisBottom(x))
    .call(d3.axisBottom(x).ticks(4, 's').tickSize(-height + margin.top + margin.bottom, 0));

g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // .attr("transform", "translate(" + (width-margin.left) + "," + margin.top + ")")
    .call(d3.axisLeft(y).ticks(10, 's').tickSize(-width + margin.left + margin.right, 0))
// .call(d3.axisLeft(y).ticks(10,'s'));
// .call(d3.axisLeft(y).ticks(10,'s').tickSize(width-margin.left-margin.right));

// var gY = g.append("g")
//     .attr("class", "axis axis--y")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// var yAxis = d3.axisLeft(y)
//     .tickSize(-width+ margin.left+margin.right, 0)
//     .ticks(10,'s');
// gY.call(yAxis);