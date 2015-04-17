/**
 * MapVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
MapVis = function(_parentElement,_stationData, _routeData, _eventHandler) {
  this.parentElement = _parentElement;
  this.stationData = _stationData;
  this.routeData = _routeData;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.disp = 0;
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
};

/**
 * Method that sets up the SVG and the variables
 */
MapVis.prototype.initVis = function() {

  this.map = L.mapbox.map('mapVis', 'niamhdurfee.loko84n8');

  // var line_points = [[42.361285,-71.06514],[42.353412,-71.044624]];
  // var polyline = L.polyline(line_points).addTo(map);

  // // call the update method
  this.updateVis();
};

// MapVis.prototype.wrangleData = function(_filterFunction) {
//   this.setScale(_filterFunction);
// };

MapVis.prototype.updateVis = function() {
  var that = this;

  this.areaScale = d3.scale.linear().range([0,200000]).domain([0, d3.max(that.stationData, function (d) {return (d.hourly.average.a + d.hourly.average.d)})]);
  this.color = d3.scale.linear().range(["red","grey","lightgreen"]).domain([0.45,0.5,0.55]); 
  this.stationData.forEach(function(dp,i) {
      var s = dp.hourly.average.a+dp.hourly.average.d,
          r = that.getRadius(that.areaScale(s)),
          c = that.color(dp.hourly.average.a/s),
          popup = L.popup().setLatLng([dp.lat,dp.lng]).setContent(dp.fullname);
      L.circle([dp.lat,dp.lng], r, {color: c, opacity: 1, fillOpacity: 0.7, className:'node'}).addTo(that.map).bindPopup(popup);
  });

  var popup = L.popup();

  function onMapClick(e) {
    console.log(e);
    popup.setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(that.map);
  }

  that.map.on('hover', onMapClick);
};

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
MapVis.prototype.onSelectionChange = function() {

  this.updateVis();
};

/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */

MapVis.prototype.getRadius = function(d) {
  return Math.sqrt(d/Math.PI)
}