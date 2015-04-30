/**
 * ChordVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
ChordVis = function (_parentElement, _data,_metaData, _eventHandler) {
  this.parentElement = _parentElement;
  this.display = 'all';
  this.stationData = _data;
  this.neighborhoods = _metaData;
  this.eventHandler = _eventHandler;

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
      padding: 120
    },
  this.width = window.innerWidth - this.margin.left - this.margin.right - this.margin.padding,
  this.height = window.innerHeight - this.margin.top - this.margin.bottom - this.margin.padding,
  this.outerRadius = Math.min(this.width, this.height) / 2 - 100,
  this.innerRadius = this.outerRadius - 24;

  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
ChordVis.prototype.initVis = function() {

    var that = this;

    this.matrix = _matrixData;

    this.arc = d3.svg.arc()
    .innerRadius(this.innerRadius)
    .outerRadius(this.outerRadius);

    this.layout = d3.layout.chord()
    .padding(.1)
    .sortSubgroups(d3.descending)
    .sortChords(d3.ascending);

    this.path = d3.svg.chord()
    .radius(this.innerRadius);

    this.svg = this.parentElement.append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr("id", "circle").attr("fill","none")
    .attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")");

    this.svg.append("circle")
    .attr("r", this.outerRadius);

    // filter, aggregate, modify data
    this.wrangleData();

    var color = d3.scale.category20();

    var formatPercent = d3.format(".1%");


    // Compute the chord layout.
    this.layout.matrix(this.matrix);

    // Add a group per neighborhood.
    var group = this.svg.selectAll(".group")
    .data(this.layout.groups).enter().append("g")
    .attr("class", "group")
    .on("mouseover", console.log("mouseover"))
    .on("mouseout", console.log("mouseout"));

    // Add a mouseover title.
    group.append("title").text(function(d, i) {
        return that.neighborhoods[i].name + ": " + formatPercent(d.value/that.displayData.total) + " of origins";
    });
    
    group.append("svg:text")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {return ((d.startAngle + d.endAngle) / 2) > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
        return "rotate(" + (((d.startAngle + d.endAngle) / 2) * 180 / Math.PI - 90) + ")"
            + "translate(" + (that.outerRadius +5) + ")"
            + (((d.startAngle + d.endAngle) / 2) > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d,i) {
            return that.neighborhoods[i].name;
        })
        .style("font-size","14px")
        .style("fill", "black")
        .style("z-index", "10000")
    
    // Add the group arc.
    var groupPath = group.append("path")
    .attr("id", function(d, i) { return "group" + i; })
    .attr("d", this.arc)
    .style("fill", function(d, i) { return that.neighborhoods[i].color; });

    // Add the chords.
    var chord = this.svg.selectAll(".chord")
    .data(this.layout.chords).enter().append("path")
    .attr("class", "chord")
    .attr("d", this.path)
    .style("fill", function(d) { return that.neighborhoods[d.source.index].color; })
    .append("title").text(function(d) {
     return that.neighborhoods[d.source.index].name
     + " → " + that.neighborhoods[d.target.index].name
     + ": " + d.source.value
     + "\n" + that.neighborhoods[d.target.index].name
     + " → " + that.neighborhoods[d.source.index].name
     + ": " + d.target.value;
     });    
    
}

ChordVis.prototype.wrangleData = function() {
    this.displayData = this.filterAndAggregate();
    
 
}

ChordVis.prototype.updateVis = function() {
    var that = this;
    var color = d3.scale.category20();

    var formatPercent = d3.format(".1%");


    // Compute the chord layout.
    this.layout.matrix(this.matrix);

    // Add a group per neighborhood.
    var group = this.svg.selectAll(".group")
    .data(this.layout.groups);

    group.select("title").text(function(d, i) {
        return that.neighborhoods[i].name + ": " + formatPercent(d.value/that.displayData.total) + " of origins";
    });

    group.select("text").attr("dy", ".35em")
        .attr("text-anchor", function(d) {return ((d.startAngle + d.endAngle) / 2) > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
        return "rotate(" + (((d.startAngle + d.endAngle) / 2) * 180 / Math.PI - 90) + ")"
            + "translate(" + (that.outerRadius +5) + ")"
            + (((d.startAngle + d.endAngle) / 2) > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d,i) {
            return that.neighborhoods[i].name;
        })
        .style("font-size","14px")
        .style("fill", "black")
        .style("z-index", "10000");

    group.select("path")
    .enter().append("path")
    .attr("id", function(d, i) { return "group" + i; })
    .style("fill", function(d, i) { return that.neighborhoods[i].color; });


    group.selectAll("path").attr("d", this.arc);

    // Add the chords.
    var chord = this.svg.selectAll(".chord")
    .data(this.layout.chords)
    .attr("d", this.path);


    
    function mouseover(d, i) {
        chord.classed("fade", function(p) {
        return p.source.index != i
        && p.target.index != i;
        });
    }
    function mouseout(d, i) {
        chord.classed("fade", function(p) { return 0});
    }
 
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
ChordVis.prototype.onSelectionChange = function(d) {
  var that = this;
  if (d !== that.display) {
  	that.display = d;
  	if (that.display =='all') {
  		this.matrix = _matrixData;
  	}
  	else if (that.display =='registered') {
  		this.matrix = _matrixRegisteredData;
  	}
  	else if (that.display =='casual') {
  		this.matrix = _matrixCasualData;
  	}
    else if (that.display =='weekend') {
  		this.matrix = _matrixWeekendData;
    }
    else if (that.display =='weekday') {
    	this.matrix = _matrixWeekdayData;

    }
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

ChordVis.prototype.filterAndAggregate = function() {
 	var that = this;
  // Set filter to a function that accepts all items
  var arrOrigins = d3.range(that.neighborhoods.length).map(function (d) { return 0});
  var sumOrigins = 0;

  this.matrix.forEach(function (row,i) {
  	sumOrigins += d3.sum(row);
  	arrOrigins[i] = d3.sum(row)
  });

  return {total: sumOrigins, origins : arrOrigins };
}
