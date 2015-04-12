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
  this.matrix = [[]];

    
  // calculate how many stations, fill entire matrix with zeroes
  var len = this.metaData.features.length;    
  var temp = [];
  for (var i=0; i<len; i++)
    temp[i] = 0;
  for (var i=0; i<len; i++)
    this.matrix[i] = temp;

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom,
  this.outerRadius = Math.min(this.width, this.height) / 2 - 10,
  this.innerRadius = this.outerRadius - 24;
    
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
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
 
    this.svg.append("circle")
      .attr("r", this.outerRadius);
    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
    
    
}

ForceVis.prototype.wrangleData = function(_filterFunction) {
    this.displayData = this.filterAndAggregate(_filterFunction);
    
    for (var i, trip in this.data)
        console.log(trip);
 
}

ForceVis.prototype.updateVis = function() {
  var that = this;
    
//  var arc = d3.svg.arc()
//    .innerRadius(this.innerRadius)
//    .outerRadius(this.outerRadius);
// 
//  var layout = d3.layout.chord()
//    .padding(.04)
//    .sortSubgroups(d3.descending)
//    .sortChords(d3.ascending);
//    
//  var path = d3.svg.cvhord()
//    .radius(this.innerRadius);
//    
//  layout.matrix(displayData);
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
