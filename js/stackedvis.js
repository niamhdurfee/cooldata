/**
 * StackedVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
StackedVis = function(_parentElement, _data, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.dom = ["total"];
  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 30,
      left: 30
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom;
  this.filter = null;
  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
StackedVis.prototype.initVis = function() {
  var that = this;

  var colorDomain = ['total','registered','casual','female','male','commuter','leisure','visitor','local'];
  var colorRange = ['black','yellowgreen','grey','#B40486','#2ECCFA','blue','grey','grey','orangered'];

  this.color = d3.scale.ordinal().domain(colorDomain).range(colorRange);

  this.x = d3.time.scale()
    .range([this.margin.left, this.width]);

  this.y = d3.scale.linear()
    .range([that.height, that.margin.bottom]);


  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .orient("bottom");

  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .orient("left");

  this.area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return that.x(d.date); })
    .y0(function(d) { return that.y(0); })
    .y1(function(d) { return that.y(d.value); });

  this.line = d3.svg.line()
  	.interpolate("basis")
    .x(function(d) { return that.x(d.date); })
    .y(function(d) { return that.y(d.value); })

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
      .attr("transform", "translate("+this.margin.left+",0)");


  // // filter, aggregate, modify data
  this.wrangleData(this.filter);

  // // call the update method
  this.updateVis();
}

StackedVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

StackedVis.prototype.updateVis = function() {

  var that = this;

  this.x.domain(d3.extent(that.displayData[0].values, function(d) { return d.date; }));
  this.y.domain([0,d3.max(that.displayData, function (d) { return d3.max(d.values, function (a) {return a.value})})]);
  
  this.svg.select(".y.axis")
    .call(this.yAxis);

  this.svg.select(".x.axis")
    .call(this.xAxis);

  var user = this.svg.selectAll(".user")
      .data(that.displayData);

  user.enter().append("g")
      .attr("class", "user")
      .append("path")
      .attr("class", "area");

  user.select('.area').attr("d", function(d) { return that.area(d.values); })
      .transition()
      .style("fill", function(d) { return that.color(d.type); })
      .style("opacity", 0.5);

  user.select('.area')
      .on("mouseover", this.mouseover)
  	  .on("mouseout", this.mouseout);

  var line = this.svg.selectAll(".userline")
  	  .data(this.displayData);

  line.enter().append("g")
  	  .attr("class","userline")
  	  .append("path")
	  .attr("class","line");

  line.select(".line")
  	  .attr("d",function (d) { return that.line(d.values)})
  	  .style("stroke", function (d) {return that.color(d.type)});

  user.exit().remove();
  line.exit().remove();
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
StackedVis.prototype.onSelectionChange = function(from,to,status) {
  if (status) {
    this.wrangleData(null)
  } else {
    this.wrangleData(function(d) {
      return ((d.date >= from) && (d.date <= to))
    });
  };
  this.updateVis();
}

StackedVis.prototype.onTypeChange = function(_dom) {
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

StackedVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    this.filter = _filter;
  } else {
  	this.filter = filter;
  }
  var that = this;
  var res = this.data.filter(this.filter);
  res = that.dom.map(function (t) {
    return {
      type: t,
      values: res.map(function (d) {
        return {date: d.date, value: d[t]}
      })
    }
  });
  return res;
}

StackedVis.prototype.mouseover = function() {
  d3.selectAll(".area").style("opacity",0.3);
  d3.selectAll(".line").style("stroke","2px");
  d3.select(d3.event.target).style("opacity",0.8).style("stroke","5px");
}
StackedVis.prototype.mouseout = function() {
  d3.selectAll(".area").style("opacity",0.6)
  d3.selectAll(".line").style("stroke","2px")
}