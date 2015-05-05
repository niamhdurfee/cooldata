/**
 * WhenVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
WhenVis = function(_parentElement, _data, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.dom = ['total','weekday','weekend'];
  this.range = 'total';

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 60,
      left: 45
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom;
  this.filter = null;
  this.initVis();
}


WhenVis.prototype.initVis = function() {
  var that = this;

  this.color = d3.scale.ordinal().domain(colorDomain).range(colorRange);

  this.x = d3.time.scale()
    .domain([0,1440])
    .range([this.margin.left, this.width]);

  this.y = d3.scale.linear()
    .range([that.height, that.margin.bottom]);

  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .orient("bottom")
    .tickFormat(d3.time.format("%H:%M"));

  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .orient("left");

  this.line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return that.x(d.timeofday); })
    .y(function(d) { return that.y(d.value); });

  this.area = d3.svg.area()
    .interpolate("basis")
    .defined(this.line.defined())
    .x(function(d) { return that.x(d.timeofday); })
    .y0(that.y(0))
    .y1(function(d) { return that.y(d.value); });

  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+this.height+")");

  this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+this.margin.left+",0)")  
      .append("text")
      .attr("transform", "translate("+this.margin.left+","+this.margin.top+") rotate(-90)")
      .attr("y", -10)
      .style("text-anchor", "end")
      .text("");

  this.yAxisLabel = this.svg.select('.y.axis').select('text');


  // // filter, aggregate, modify data
  this.wrangleData(this.filter);

  // // call the update method
  this.updateVis();
}

WhenVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
  console.log(this.displayData);
}

WhenVis.prototype.updateVis = function() {

  var that = this;

  this.x.domain(d3.extent(that.displayData[0].values, function(d) { return d.date; }));
  this.y.domain([0,
    d3.max([1.2*d3.max(that.displayData, function (d) { 
      return d3.max(d.values, function (a) {return a.value})
    }),3000])
  ]);

  this.svg.select(".y.axis")
    .call(this.yAxis);

  this.svg.select(".x.axis")
    .call(this.xAxis);

  var area = this.svg.selectAll(".area")
      .data(that.displayData);

  area.enter().append("g")
      .append("path")
      .attr("class", "area");

  area.attr("d", function(d) { return that.area(d.values); })
      .transition()
      .style("fill", function(d) { return that.color(d.type); })
      .style("opacity", 0.5);

  var line = this.svg.selectAll(".line")
      .data(this.displayData);

  line.enter().append("g")
      .append("path")
      .attr("class","line");

  line.attr("d",function (d) { return that.line(d.values)})
      .style("stroke", function (d) {return that.color(d.type)});

  area.exit().remove();
  line.exit().remove();
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */

WhenVis.prototype.onSelectionChange = function(selection) {
  this.wrangleData();
  this.updateVis();
}

WhenVis.prototype.onTypeChange = function(_dom) {
  if (this.dom != _dom) {
  	this.dom = _dom;
  	this.wrangleData(this.filter);
  	this.updateVis();
  }
}
/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

WhenVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var that = this;

  var res = that.dom.map(function (t) {
    return {
      type: t,
      values: that.data.map(function (d) {
        return {timeofday: d[t].timeofday, value: d[t][that.range]}
      })
    }
  });
  return res;
}

// WhenVis.prototype.mouseover = function() {
//   d3.selectAll(".area").style("opacity",0.3);
//   d3.selectAll(".line").style("stroke","2px");
//   d3.select(d3.event.target).style("opacity",0.8).style("stroke","5px");
// }
// WhenVis.prototype.mouseout = function() {
//   d3.selectAll(".area").style("opacity",0.6)
//   d3.selectAll(".line").style("stroke","2px")
// }
