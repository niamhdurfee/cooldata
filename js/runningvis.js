/**
 * RunningVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
RunningVis = function(_parentElement,_routeData,_eventHandler) {
  this.parentElement = _parentElement;
  this.eventHandler = _eventHandler;
  this.routeData = _routeData;
  this.displayData = [];

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom;

  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
RunningVis.prototype.initVis = function() {
  this.resetCounts();

  var road = this.parentElement
    .append("div")
    .attr("id","road");

  var gender = this.parentElement
    .append("div")
    .attr("id","gender");

  gender.append("div").html("<h4>Users</h4><small><span class='glyphicon glyphicon-user M'></span> male  <span class='glyphicon glyphicon-user F'></span> female  <span class='glyphicon glyphicon-user N'></span> unregistered user</small>")
  road.append("h2").html("On the road")


  this.gender = gender.append("div").attr("id","genderCount")
  this.total = road.append("div").attr("class","total")
  this.distance = road.append("div").attr("class","distance")
  this.ttime = road.append("div").attr("class","time")


  this.total.append("span").attr("id","totalCount")
  this.total.append("span").text(" trips")

  this.distance.append("span").attr("id","distCount")
  this.distance.append("span").text(" miles")

  this.ttime.append("span").attr("id","timeCount")
  // // filter, aggregate, modify data
  this.wrangleData(null);
}

RunningVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

RunningVis.prototype.updateVis = function(i,trip) {
  var that = this;
  if (i == 0) { this.resetCounts(); }
  if (trip.tripType == "greenyellow") {
    console.log(trip.gender);
    var formatInt = d3.format(',');
    var formatFloat = d3.format(',.2f');
    that.timeCount += trip.duration;
    that.distCount += that.routeData[trip.origdest].dist;
    that.totalCount += 1;
    d3.select("#totalCount").text(that.totalCount);
    d3.select("#timeCount").html(that.formatTime(that.timeCount));
    d3.select("#distCount").text(formatFloat(that.distCount));
    d3.select("#genderCount").append("span").attr("class","glyphicon glyphicon-user").classed((trip.gender =='') ? "N" : trip.gender ,true);
    }
  }
  

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
RunningVis.prototype.onSelectionChange = function() {

  this.updateVis();
}

/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

RunningVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    filter = _filter;
  }

  var that = this;
  return 0;
}

RunningVis.prototype.formatTime  = function (min) {
  var days = Math.floor(min/(24*60));
  var hours = Math.floor((min - 24*60*days)/60)
  var minutes = min % 60;
 return days + "<small>d</small> " + hours + "<small>h</small> " + minutes + "<small>m</small>"; 
};

RunningVis.prototype.resetCounts = function () {
  this.timeCount = 0;
  this.distCount = 0.0;
  this.totalCount = 0;
}

