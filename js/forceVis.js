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


    
this.stations = [];
for (var i=0; i<this.metaData.features.length; i++)
    this.stations[this.metaData.features[i].properties.id] = this.metaData.features[i].properties.station;
    
    
//    console.log(this.stations);
  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom,
  this.outerRadius = Math.min(this.width, this.height) / 2 - 50,
  this.innerRadius = this.outerRadius - 24,
  this.center = (this.height)/2 - 200;

    
  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
ForceVis.prototype.initVis = function() {
    console.log("initvis");

    var that = this; // read about the this

    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
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
//  var that = this;
//    
//  var arc = d3.svg.arc()
//    .innerRadius(this.innerRadius)
//    .outerRadius(this.outerRadius);
// 
//  var layout = d3.layout.chord()
//    .padding(.04)
//    .sortSubgroups(d3.descending)
//    .sortChords(d3.ascending);
//    
//  var path = d3.svg.chord()
//    .radius(this.innerRadius);
//    
//  layout.matrix(this.data);
    
    var fill = d3.scale.category10();

        // Use the helper function and transform the data
    
        var that = this;
        var data = that.data;
    
 console.log(data);
        // Visualize
        var chord = d3.layout.chord()
            .padding(.05)
            .sortSubgroups(d3.descending)
            .matrix(that.matrix);
//            .matrix([   [11975,  5871, 8916, 2868],
//                        [ 1951, 10048, 2060, 6171],
//                        [ 8010, 16145, 8090, 8045],
//                        [ 1013,   990,  940, 6907] ]);
    


        that.svg.append("g").selectAll("path")
            .data(chord.groups)
            .enter().append("path")
            .attr("class", "arc")
            .style("fill", function(d) {
                return d.index < 4 ? '#444444' : fill(d.index);
            })
            .attr("d", d3.svg.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius))
            .on("mouseover", fade(.1))
            .on("mouseout", fade(.7));

        that.svg.append("g")
            .attr("class", "chord")
            .selectAll("path")
            .data(chord.chords)
            .enter().append("path")
            .attr("d", d3.svg.chord().radius(this.innerRadius))
            .style("opacity", 0.7);

        that.svg.append("g").selectAll(".arc")
            .data(chord.groups)
            .enter().append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return ((d.startAngle + d.endAngle) / 2) > Math.PI ? "end" : null; })
            .attr("transform", function(d) {
              return "rotate(" + (((d.startAngle + d.endAngle) / 2) * 180 / Math.PI - 90) + ")"
                  + "translate(" + (that.center - 15) + ")"
                  + (((d.startAngle + d.endAngle) / 2) > Math.PI ? "rotate(180)" : "");
            })
            .text(function(d) {
                return that.stations[d.index];
            })
            .style("font-size","10px");

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
