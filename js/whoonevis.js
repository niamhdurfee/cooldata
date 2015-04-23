/**
 * WhoOneVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
WhoOneVis = function(_parentElement, _data, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.dom = ["registered","casual"];
  // Define all "constants" here
  this.margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom;
  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
WhoOneVis.prototype.initVis = function() {
  var that = this;

  var colorDomain = ['registered','casual','female','male','commuter','leisure','visitor','local'];
  var colorRange = ['lightgreen','grey','pink','lightblue','red','coral','orange','purple'];

  this.color = d3.scale.ordinal().domain(colorDomain).range(colorRange);

  this.x = d3.time.scale()
    .range([0, this.width]);

  this.y = d3.scale.linear()
    .range([that.height, 0]);


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


  // // filter, aggregate, modify data
  this.wrangleData(null);

  // // call the update method
  this.updateVis();
}

WhoOneVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

WhoOneVis.prototype.updateVis = function() {
  var that = this;

  var users = that.stack(that.displayData);
  this.x.domain(d3.extent(that.displayData[0].values, function(d) { return d.date; }));
  this.y.domain([0,d3.max(that.displayData, function (d) { return d3.max(d.values, function (a) {return a.y+a.y0})})]);
  console.log(d3.extent(that.displayData, function (d) { return d3.max(d.values, function (a) { return a.y+a.y0})}))
  var browser = this.svg.selectAll(".user")
      .data(users)
      .enter().append("g")
      .attr("class", "user");

  browser.append("path")
      .attr("class", "area")
      .attr("d", function(d) { return that.area(d.values); })
      .style("fill", function(d) { return that.color(d.type); });

  // browser.append("text")
  //     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
  //     .attr("transform", function(d) { return "translate(" + that.x(d.value.date) + "," + that.y(d.value.y0 + d.value.y / 2) + ")"; })
  //     .attr("x", -6)
  //     .attr("dy", ".35em")
  //     .text(function(d) { return d.name; });

  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);

  this.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis);
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
WhoOneVis.prototype.onSelectionChange = function() {

  this.updateVis();
}

/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

WhoOneVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    filter = _filter;
  }

  var that = this;
  var res = this.data.filter(filter);
  console.log(that.dom)
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
