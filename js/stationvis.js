/**
 * MapVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
StationVis = function(_parentElement,_stationData, _routeData) {
  this.parentElement = _parentElement;
  this.stationData = _stationData;
  this.routeData = _routeData;
  this.displayData = [];
  this.disp = 0;

  // Define all "constants" here
  this.margin = {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    },
  this.width = 340 - this.margin.left - this.margin.right,
  this.height = 240 - this.margin.top - this.margin.bottom;

  // set up SVG
  this.initVis();
};

/**
 * Method that sets up the SVG and the variables
 */
StationVis.prototype.initVis = function() {
};


StationVis.prototype.updateVis = function(id) {
    
  var that = this;
  $('#station-name').html(that.stationData[id].fullname);
    
    
  console.log(this.stationData[id]);
    
    
    var sorted = [];
    for (var route in that.stationData[id].routes)
        sorted.push([route, that.stationData[id].routes[route]]);
    sorted.sort(function(a, b) {return b[1] - a[1]})

  $("#top-destinations ul").empty();
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[0][0]].fullname + '</li>');
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[1][0]].fullname + '</li>');
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[2][0]].fullname + '</li>');
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[3][0]].fullname + '</li>');
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[4][0]].fullname + '</li>');


    
  this.svg = this.parentElement.append("svg")
    .attr("width", this.width)
    .attr("height", 100)
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    .append("g");
  var start = new Date(0,0,0),
      stop = new Date(0,0,1);
  this.x = d3.time.scale().range([0, this.width]).domain([start,stop]);
  this.xAxis = d3.svg.axis()
    .scale(this.x).ticks(24).tickFormat(d3.time.format("%H"))
    .orient("bottom");

  this.brush = d3.svg.brush().x(this.x)
    .on("brush", function() {
      // Trigger selectionChanged event. You'd need to account for filtering by time AND type
      $(that.eventHandler).trigger("selectionChanged", [that.brush.extent()[0].getHours(), that.brush.extent()[1].getHours(), that.brush.empty()])
    });

 // Add axes visual elements
  this.svg.append("g")
    .attr("class", "timeaxis")

  this.svg.append("g")
    .attr("class", "brush")

 // updates axis
  this.svg.select("timeaxis")
    .call(this.xAxis);

  this.svg.select(".brush")
    .call(this.brush)
    .selectAll("rect")
    .attr("height", this.height);

 
};

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
StationVis.prototype.onSelectionChange = function(id) {
    console.log('on selection change function!!!!');
    this.updateVis(id);  
};
