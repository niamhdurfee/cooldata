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
    
    console.log(id);
    console.log(this.stationData[id]);
    
    $('#station-name').html(this.stationData[id].fullname);
    
    
    console.log(this.stationData[id]);
    
    
//    lalalaa = dict(sorted((this.stationData[id].routes).iteritems(), key=operator.itemgetter(1), reverse=True)[:5])

//    console.log(lalalaa);
        
 
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
