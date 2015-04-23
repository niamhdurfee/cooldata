/**
 * ChordVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
ChordVis = function (_parentElement, _data,_metaData, _eventHandler) {
  this.parentElement = _parentElement;
  this.matrix = _matrixData;
  this.stationData = _data;
  this.neighborhoods = _metaData;
  this.eventHandler = _eventHandler;

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom,
  this.outerRadius = Math.min(this.width, this.height) / 2 - 80,
  this.innerRadius = this.outerRadius - 24;

  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
ChordVis.prototype.initVis = function() {

    var that = this;


    this.arc = d3.svg.arc()
    .innerRadius(this.innerRadius)
    .outerRadius(this.outerRadius);

    this.layout = d3.layout.chord()
    .padding(.04)
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
    // this.wrangleData();

    // call the update method
    this.updateVis();
    
    
}

ChordVis.prototype.wrangleData = function(_filterFunction) {
    this.displayData = this.filterAndAggregate(_filterFunction);
    
 
}

ChordVis.prototype.updateVis = function() {
    var that = this;
    var color = d3.scale.category20();

    var formatPercent = d3.format(".1%");


    // Compute the chord layout.
    this.layout.matrix(_matrixData);

    // Add a group per neighborhood.
    var group = this.svg.selectAll(".group")
    .data(this.layout.groups)
    .enter().append("g")
    .attr("class", "group")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

    // Add a mouseover title.
    group.append("title").text(function(d, i) {
        return that.neighborhoods[i].name + ": " + formatPercent(d.value) + " of origins";
    });
    
    group.append("svg:text")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { console.log(d); return ((d.startAngle + d.endAngle) / 2) > Math.PI ? "end" : null; })
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
    .data(this.layout.chords)
    .enter().append("path")
    .attr("class", "chord")
    .style("fill", function(d) { return that.neighborhoods[d.source.index].color; })
    .attr("d", this.path);

    // Add an elaborate mouseover title for each chord.
     chord.append("title").text(function(d) {
     return that.neighborhoods[d.source.index].name
     + " → " + that.neighborhoods[d.target.index].name
     + ": " + formatPercent(d.source.value)
     + "\n" + that.neighborhoods[d.target.index].name
     + " → " + that.neighborhoods[d.source.index].name
     + ": " + formatPercent(d.target.value);
     });
    
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
ChordVis.prototype.onSelectionChange = function() {

  this.updateVis();
}

/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

ChordVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    filter = _filter;
  }

  var that = this;

//  return res;
}
