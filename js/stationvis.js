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
    station = that.stationData[id];
    
    $('#station-name').html(station.fullname);
    
    $('#station-amt').html(Math.round(station['overall']['average']['t'])+ " trips per day");
    
    var sorted = [];
    for (var route in station.routes)
        sorted.push([route, station.routes[route]]);
    sorted.sort(function(a, b) {return b[1] - a[1]})

  $("#top-destinations ul").empty();
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[0][0]].fullname + '</li>');
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[1][0]].fullname + '</li>');
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[2][0]].fullname + '</li>');
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[3][0]].fullname + '</li>');
    $("#top-destinations ul").append('<li>' + that.stationData[sorted[4][0]].fullname + '</li>');


  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

 var headers = ["meeting","construction","management","aa","bb","cc"];

//
//
//    var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });
//    var yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

    console.log(station.overall.average);


    var data = [
    {
        "key": "Male",
        "values": [
            {"x": "Male",  "y": station.overall.average.t - station.overall.average.f}
        ]
    },
    {
        "key": "Female",
        "values": [
            {"x": "Female",  "y": station.overall.average.f}
        ]
    },
    {
        "key": "Unregistered",
        "values": [
            {"x": "Unregistered",  "y": station.overall.average.t - station.overall.average.r}
        ]
    },
    {
        "key": "Registered",
        "values": [
            {"x": "Registered",  "y": station.overall.average.r}
        ]
    },
    {
        "key": "Leisure",
        "values": [
            {"x": "Leisure",  "y": station.overall.average.t - station.overall.average.c}
        ]
    },
    {
        "key": "Commuting",
        "values": [

            {"x": "Commuting",  "y": station.overall.average.c}
        ]
    }
];
    

    var y = d3.scale.linear()
    .domain([0, station.overall.average.t])
    .range([0, this.width-40]);   
    
    var groupSpacing = 1;
    
    var colors = ['#', ''];

    var stack = d3.layout.stack().values(function(d){ return d.values;}),
    layers = stack(data);
    
    this.svg.selectAll("rect")
       .data(layers)
       .enter().append("rect")
       .attr("x", function (d, i) { console.log(d); return y(d.values[0].y0) - Math.floor(i/2)*280;})
       .attr("y", function (d, i) { return Math.floor(i/2) * 45;})
       .attr("width", function(d) { return y(d.values[0].y) - groupSpacing;})
       .attr("height", 35);
        

//    var layer = this.svg.selectAll(".layer")
//        .data(data)
//        .enter().append("g")
//        .attr("class", "layer")
//        .style("fill", function(d, i) { return '#8a89a6'; });
//
//    var rect = layer.selectAll("rect")
//        .data(function(d) {  return d; })
//        .enter().append("rect")
//        .attr("y", function(d) { console.log(d); return 25*d; })
//        .attr("x", 0)
//        .attr("height", 25)
//        .attr("width", 0)
//        .on("click", function(d) {
//             console.log(d);
//        });
//
//    rect.transition()
//        .delay(function(d, i) { return i * 100; })
//        .attr("x", function(d) { return x(d.y0); })
//        .attr("width", function(d) { return x(d.y); });
//
//   //********** AXES ************
//    this.svg.append("g")
//        .attr("class", "x axis")
//        .attr("transform", "translate(0," + this.height + ")")
////        .call(xAxis)
//        .selectAll("text").style("text-anchor", "end")
//            .attr("dx", "-.8em")
//            .attr("dy", ".15em");
//
//    this.svg.append("g")
//        .attr("class", "y axis")
//        .attr("transform", "translate(0,0)")
//        .call(yAxis)
//      .append("text")
//        .attr({"x": 0 / 2, "y": this.height+50})
//        .attr("dx", ".75em")
//        .style("text-anchor", "end")
//        .text("Time");


//    var legend = this.svg.selectAll(".legend")
//        .data(headers.slice().reverse())
//            .enter().append("g")
//            .attr("class", "legend")
//            .attr("transform", function(d, i) { return "translate(-20," + i * 20 + ")"; });
//
//        legend.append("rect")
//            .attr("x", this.width - 18)
//            .attr("width", 18)
//            .attr("height", 18)
//            .style("fill", '#000');
//
//        legend.append("text")
//              .attr("x", this.width - 24)
//              .attr("y", 9)
//              .attr("dy", ".35em")
//              .style("text-anchor", "end")
//              .text(function(d) { return d;  });
};

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
StationVis.prototype.onSelectionChange = function(id) {
    this.updateVis(id);  
};
