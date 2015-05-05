/**
 * MapVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
StationVis = function(_whoParentElement,_originParentElement,_destParentElement,_timeParentElement,_stationData, _routeData) {
  this.whoParentElement = _whoParentElement;
  this.originParentElement = _originParentElement;
  this.destParentElement = _destParentElement;
  this.timeParentElement = _timeParentElement;

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
  this.height = 200 - this.margin.top - this.margin.bottom;

  // set up SVG
  this.initVis();
};

/**
 * Method that sets up the SVG and the variables
 */
StationVis.prototype.initVis = function() {

  this.whosvg = this.whoParentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.originsvg = this.originParentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height - 50 + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.destsvg = this.destParentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height - 50 + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.timesvg = this.timeParentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height  + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

};


StationVis.prototype.updateVis = function(id) {

    var that = this;
    station = that.stationData[id];

    // UPDATE STATION DATA
    $('#station-name').html(station.fullname);
    $('#station-amt').html(Math.round(station['overall']['average']['t'])+ " trips per day");


    // create data for layering
    var data = [ { "key": "Male", "values": [ {"x": "Male",  "y": station.overall.average.t - station.overall.average.f} ] },
                 { "key": "Female", "values": [ {"x": "Female",  "y": station.overall.average.f} ] },
                 { "key": "Unregistered", "values": [ {"x": "Unregistered",  "y": station.overall.average.t - station.overall.average.r} ] },
                 { "key": "Registered", "values": [ {"x": "Registered",  "y": station.overall.average.r} ] },
                 { "key": "Leisure", "values": [ {"x": "Leisure",  "y": station.overall.average.t - station.overall.average.c} ] },
                 { "key": "Commuting", "values": [ {"x": "Commuting",  "y": station.overall.average.c} ] }
               ];


    // USER BREAKDOWNS
    var y = d3.scale.linear()
      .domain([0, station.overall.average.t])
      .range([0, this.width-40]);
    var colors = [ '#217D1C', '#399F2E'];
    var stack = d3.layout.stack().values(function(d){ return d.values;}),
    layers = stack(data);

    var rects = this.whosvg.selectAll("rects")
      .data(layers);

    rects.enter().append("rect")
      .style("fill", function (d,i) { if (i%2 == 0) return colors[0]; else return colors[1];})
      .attr("width", 0)
      .attr("x", y(station.overall.average.t/2))
      .transition()
      .duration(800)
      .attr("width", function(d) { return y(d.values[0].y);})
      .attr("height", 35)
      .attr("x", function (d, i) { return y(d.values[0].y0) - Math.floor(i/2)*280;})
      .attr("y", function (d, i) { return Math.floor(i/2) * 65 + 30;});

    rects.exit().transition()
      .style("fill", '#fff')
      .duration(800)
      .remove();

    var labels = this.whosvg.selectAll("text")
      .data(layers)

    labels.enter().append("text")
      .style('fill', '#fff')
      .attr("x", function (d, i) { if (i%2 == 0) return 0; else return y(station.overall.average.t);})
      .attr("y", function (d, i) { return Math.floor(i/2) * 65 + 23;})
      .attr("dy", ".35em")
      .text(function(d) { return d.key; })
      .style('class', 'lead')
      .style('text-anchor', function (d,i) { if (i%2 == 0) return 'start'; else return 'end'; });

    labels.exit().remove();





    // DESTINATIONS
    var sorted = [];
    for (var route in station.routes)
        sorted.push([route, station.routes[route]]);
    sorted.sort(function(a, b) {return b[1] - a[1]})
    sorted = sorted.slice(0,5);

    var y = d3.scale.linear()
      .domain([0, sorted[0][1] ])
      .range([0, this.height-40]);

    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });
    this.destsvg.call(tip);

    var rects2 = this.destsvg.selectAll("rect")
      .data(sorted);

    rects2.enter().append("rect")
      .attr("width", function(d) { return 40; })
      .attr("height", function(d) { return y(d[1]); })
      .attr("x", function(d, i) { return i*55; })
      .attr("y", function(d) { return y(sorted[0][1]) - y(d[1]); })
      .style("fill", "#399F2E")
      .on('mouseover', function(d) { $('#name-dest-hov').html(that.stationData[d[0]].fullname) } )
      .on('mouseout', function() { $('#name-dest-hov').empty() });

    rects2.exit().remove();

    var texts = this.destsvg.selectAll("text")
      .data(sorted);

    texts.enter().append("text")
      .style('font-size', '10px')
      .style('font-weight', '800')
      .style('fill', 'white')
      .text( function (d) { return d[1]; })
      .attr("x", function(d, i) { return i*55 + 8; })
      .attr("y", function(d) { return y(sorted[0][1]) - y(d[1]) + 15; });

    texts.exit().remove();

    // why isn't bar graph changing on update?


    // ORIGINS

    // calculate top 5 origins
    var origins = [];
    for (var key in this.stationData)
        origins.push([key, this.stationData[key].routes[id]]);
    origins.sort(function(a, b) {return b[1] - a[1]})
    origins = origins.slice(0,5);


    var y_orig = d3.scale.linear()
      .domain([0, origins[0][1] ])
      .range([0, this.height-40]);


    var rects3 = this.originsvg.selectAll("rect")
      .data(origins);

    rects3.enter().append("rect")
      .attr("width", function(d) { return 40; })
      .attr("height", function(d) { return y_orig(d[1]); })
      .attr("x", function(d, i) { return i*55; })
      .attr("y", function(d) { return y_orig(origins[0][1]) - y_orig(d[1]); })
      .style("fill", "#399F2E")
      .on('mouseover', function(d) { $('#name-origins-hov').html(that.stationData[d[0]].fullname) } )
      .on('mouseout', function() { $('#name-origins-hov').empty() });

    rects3.exit().remove();

    var texts2 = this.originsvg.selectAll("text")
      .data(origins);

    texts2.enter().append("text")
      .style('font-size', '10px')
      .style('font-weight', '800')
      .style('fill', 'white')
      .text( function (d) { return d[1]; })
      .attr("x", function(d, i) { return i*55 + 8; })
      .attr("y", function(d) { return y_orig(origins[0][1]) - y_orig(d[1]) + 15; });

    texts2.exit().remove();


    // TIMELINE

    // console.log(this.stationData[id].overall.hourly);

//    var valueline = d3.svg.line()
//    .interpolate("basis")           // <=== THERE IT IS!
//    .x(function(d) { return x(d.time); })
//    .y(function(d) { return y(d.rates); });
//
    var rates = [];

    for (var time in this.stationData[id].overall.hourly)
        rates.push({'x': time, 'y': this.stationData[id].overall.hourly[time]['t']});

    // console.log(rates);



    var xscale = d3.scale.linear()
      .domain([0, 23])
      .range([0, this.width-40]);

    var yscale = d3.scale.linear()
      .domain([Math.max.apply(Math,rates.map(function(o){return o.y;})), 0 ])
      .range([0, this.height-40]);

    var lineFunction = d3.svg.line()
       .x(function(d) { return xscale(d.x); })
       .y(function(d) { return yscale(d.y); })
       .interpolate("basis");

    var path = this.timesvg.selectAll("path")
        .data(rates);

    path.enter().append("path")
        .attr("d", lineFunction(rates))
        .style("stroke-width", 2)
        .style("stroke", "#399F2E")
        .style("fill", "none");

    path.exit().remove();

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
