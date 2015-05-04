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
    
      this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    
    
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
    
    var groupSpacing = 0;
    
    var colors = [ '#217D1C', '#399F2E'];

    var stack = d3.layout.stack().values(function(d){ return d.values;}),
    layers = stack(data);
    

    var rects = this.svg.selectAll("rects")
        .data(layers);
    
    
    
    rects.enter().append("rect")
       .style("fill", function (d,i) { if (i%2 == 0) return colors[0]; else return colors[1];})
       .attr("width", 0)
        .attr("x", y(station.overall.average.t/2))
       .transition()
       .duration(800)
       .attr("width", function(d) { return y(d.values[0].y) - groupSpacing;})
       .attr("height", 35)
       .attr("x", function (d, i) { console.log(d); return y(d.values[0].y0) - Math.floor(i/2)*280;})
       .attr("y", function (d, i) { return Math.floor(i/2) * 65 + 30;});

    
    rects.exit().transition()
        .style("fill", '#fff')

        .duration(800)
        .remove();


//    //exit 
//    bar.exit().remove();
    
    var labels = this.svg.selectAll("text")
    .data(layers)
    
    labels.enter().append("text")
       .attr("x", function (d, i) { if (i%2 == 0) return 0; else return y(station.overall.average.t);})
       .attr("y", function (d, i) { return Math.floor(i/2) * 65 + 23;})
        .attr("dy", ".35em")
        .text(function(d) { console.log(d.key); return d.key; })
        .style('class', 'lead')
        .style('text-anchor', function (d,i) { if (i%2 == 0) return 'start'; else return 'end'; }); 

    labels.exit().remove();

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
