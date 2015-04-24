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
  this.dom = ["female","male"];
  // Define all "constants" here
  this.margin = {
      top: 5,
      right: 5,
      bottom: 20,
      left: 40
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom;
  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
StackedVis.prototype.initVis = function() {
  var that = this;

  var colorDomain = ['registered','casual','female','male','commuter','leisure','visitor','local'];
  var colorRange = ['#04B431','#848484','#B40486','#2ECCFA','#4B088A','#848484','#848484','#B40431'];

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
    .x(function(d) { return this.x(d.date); })
    .y0(function(d) { return this.y(d.y0); })
    .y1(function(d) { return this.y(d.y0 + d.y); });

  this.stack = d3.layout.stack()
    .values(function(d) { return d.values; });

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

StackedVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

StackedVis.prototype.updateVis = function() {

  var that = this;

  var users = that.stack(that.displayData);
  this.x.domain(d3.extent(that.displayData[0].values, function(d) { return d.date; }));
  this.y.domain([0,d3.max(that.displayData, function (d) { return d3.max(d.values, function (a) {return a.y+a.y0})})]);
  
  this.svg.select(".y.axis")
    .call(this.yAxis);

  this.svg.select(".x.axis")
    .call(this.xAxis);

  var user = this.svg.selectAll(".user")
      .data(users)

  user.enter().append("g")
      .attr("class", "user")
      .append("path")
      .attr("class", "area");

  user.select('.area').attr("d", function(d) { return that.area(d.values); })
      .style("fill", function(d) { return that.color(d.type); });

  user.exit().remove();
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
    filter = _filter;
  }

  var that = this;
  var res = this.data.filter(filter);
  res = that.dom.map(function (t) {
    return {
      type: t,
      values: res.map(function (d) {
        return {date: d.date, y: d[t]}
      })
    }
  });

  return res;
}
