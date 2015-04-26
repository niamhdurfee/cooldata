/**
 * WeatherVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
WeatherVis = function(_parentElement, _data, _metaData,_eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.metaData = _metaData;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.dom = ["total"];
  this.filter = null;

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 30,
      left: 30
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom;
  this.filter = null;
  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
WeatherVis.prototype.initVis = function() {
  var that = this;
  var colorDomain = ['total','registered','casual','female','male','commuter','leisure','visitor','local'];
  var colorRange = ['darkgrey','yellowgreen','grey','#B40486','#2ECCFA','blue','grey','grey','orangered'];

  this.color = d3.scale.ordinal().domain(colorDomain).range(colorRange);

  this.x = d3.scale.linear()
    .range([this.margin.left, this.width]);

  this.y = d3.scale.pow()
    .range([that.height, that.margin.bottom]).exponent(.25);

  this.r = d3.scale.linear()
    .range([0, 50]);

  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .orient("bottom");

  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .orient("left");

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
  this.wrangleData(null);

  // // call the update method
  this.updateVis();
}

WeatherVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

WeatherVis.prototype.updateVis = function() {
  var that = this;

  this.x.domain(d3.extent(this.displayData, function (d) { return d.x}));
  this.y.domain(d3.extent(this.displayData, function (d) { return d.y}));
  this.r.domain(d3.extent(this.displayData, that.getRadius));

  this.svg.select(".y.axis")
    .call(this.yAxis);

  this.svg.select(".x.axis")
    .call(this.xAxis);

  var circles = this.svg.selectAll(".circle")
      .data(this.displayData);

  circles.enter()
      .append("circle")
      .attr("class","circle");

  this.svg.selectAll(".circle")
      .attr("r", function  (d) {return that.r(that.getRadius(d))})
      .attr("cx",function (d) {return that.x(d.x)})
      .attr("cy",function (d) {return that.y(d.y)})
      .style("fill", function (d) {return that.color(d.type)})
      .transition()
      .duration(300);
      
      // .style("stroke", function (d) {return that.color(d.type)})
      // .style("stroke-width", "3px");

  circles.exit().remove();
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
WeatherVis.prototype.onSelectionChange = function(from,to,status) {
  if (status) {
    this.wrangleData(null)
  } else {
    this.wrangleData(function(d) {
      return ((d.date >= from) && (d.date <= to))
    });
  };
  this.updateVis();
}

WeatherVis.prototype.onTypeChange = function(_dom) {
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

WeatherVis.prototype.filterAndAggregate = function(_filter) {
    // Set filter to a function that accepts all items
  var that = this;

  var filter = function() {
    return true;
  }
  if (_filter != null) {
    this.filter = _filter;
  } else {
    this.filter = filter;
  }
  
  var res = this.data.filter(this.filter).filter(function(d) {return d.total != 0; });
  var res0 = res.map(function (d) {
    return {
      type: that.dom[0],
      x: d.TMAX,
      y: d.AWND,
      value: d[that.dom[0]]}
      });
  var res1 = [];
  if (that.dom[0] != 'total') {
    res1 = res.map(function (d) {
      return {
        type: that.dom[1],
        x: d.TMAX,
        y: d.AWND,
        value: d[that.dom[1]]}
        });
  }
  return res0.concat(res1);
  };


WeatherVis.prototype.getRadius = function(d) {
  return Math.sqrt(d.value/Math.PI);
}
