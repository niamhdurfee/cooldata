/**
 * ForceVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
ForceVis = function (_parentElement, _data, _metaData) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.metaData = _metaData;
  this.displayData = [];
  this.matrix = [];

for (var i=0; i<this.data.length; i++)
{
    this.matrix[i] = [];
    for (var j =0; j<this.data[i].length; j++)
        this.matrix[i][j] = this.data[i][j];
}


    
//    this.stations = [];
//    for (var i=0; i<(this.metaData.features.length; i++)
//        this.stations[this.metaData.features[i].properties.id] = this.metaData.features[i].properties.station;
//
//    
  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom;

  
    this.outerRadius = Math.min(this.width, this.height) / 2 - 10,
    this.innerRadius = this.outerRadius - 24;
    
    
    this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
ForceVis.prototype.initVis = function() {

    var that = this; // read about the this

    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
//        .attr("width", this.width + this.margin.left + this.margin.right)
//        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + 400 + "," + 300 + ")");
 
    
    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
    
    
}

ForceVis.prototype.wrangleData = function(_filterFunction) {
    this.displayData = this.filterAndAggregate(_filterFunction);
    
 
}

ForceVis.prototype.updateVis = function() {
    
        
        var that = this;
    

        var fill = d3.scale.ordinal()
            .domain(d3.range(4))
            .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

        // Visualize
        var chord = d3.layout.chord()
            .padding(Math.PI * 2. / (that.matrix).length)
            .sortSubgroups(d3.descending)
//            .matrix ([  [12, 152, 194, 184], 
//                        [400, 300, 250, 225], 
//                        [225, 123, 124, 209], 
//                        [12, 152, 194, 184]  ])
            .matrix(that.matrix);


        
        

        that.svg.append("g").selectAll(".arc")
            .data(chord.groups)
            .enter().append("path")
            .attr("class", "arc")
            .style("fill", function(d) {
                return d.index < 4 ? '#444444' : fill(d.index);
            })
            .style("stroke", function(d) {
                return fill(d.index);
            })
            .attr("d", d3.svg.arc()
                  .innerRadius(that.innerRadius - 200)
                  .outerRadius(that.outerRadius-200))
            .on("mouseover", fade(.1))
            .on("mouseout", fade(.7))    
         
        that.svg.append("g").selectAll(".arc")
            .data(chord.groups)
            .enter().append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { 
                return (((d.startAngle + d.endAngle) / 2) > Math.PI ? "end" : null)
            })
            .attr("transform", function(d) {
              return "rotate(" + (((d.startAngle + d.endAngle) / 2) * 180 / Math.PI - 90) + ")"
                  + "translate(" + (200) + ")"
                  + (((d.startAngle + d.endAngle) / 2) > Math.PI ? "rotate(180)" : "");
            })
            .text(function(d) {
                return that.stations[d.index];
            })
            .style("font-size","10px");
    
        that.svg.append("g")
            .attr("class", "chord")
            .selectAll("path")
            .data(chord.chords)
            .enter().append("path")
            .attr("d", that.matrix)
            .style("opacity", 0.7);
    

        // Returns an event handler for fading a given chord group.
        function fade(opacity) {
            return function(g, i) {
            svg.selectAll(".chord path")
                .filter(function(d) { return d.source.index != i && d.target.index != i; })
                .transition()
                .style("opacity", opacity);
            };
        }
    
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
ForceVis.prototype.onSelectionChange = function() {

  this.updateVis();
}

/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

ForceVis.prototype.filterAndAggregate = function(_filter) {
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
