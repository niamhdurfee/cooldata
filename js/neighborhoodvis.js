/**
 * NeighborhoodVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
NeighborhoodVis = function(_parentElement, _data, _metaData,_eventHandler) {
  this.parentElement = _parentElement;
  this.stationData = _data;
  this.neighborhoods = _metaData;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.matrix = _matrixData;

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
NeighborhoodVis.prototype.initVis = function() {

  // // filter, aggregate, modify data
  this.wrangleData(null);

  // // call the update method
  this.updateVis();
}

NeighborhoodVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

NeighborhoodVis.prototype.updateVis = function() {
  var that = this;
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
NeighborhoodVis.prototype.onSelectionChange = function() {

  this.updateVis();
}

/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

NeighborhoodVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    filter = _filter;
  }

  var that = this;

  return res;
}