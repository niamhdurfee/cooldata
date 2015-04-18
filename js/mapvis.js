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
  // fromEncoded(encoded).addto(map);
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
  var polyline_options = {
      weight: 2,
      className: 'line',
      color: '#000',
      opacity: 0.4
    };
  this.areaScale = d3.scale.linear().range([0,200000]).domain([0, d3.max(that.stationData, function (d) {return (d.hourly.average.a + d.hourly.average.d)})]);
  this.color = d3.scale.linear().range(["red","grey","lightgreen"]).domain([0.45,0.5,0.55]);
  var stations = d3.keys(this.stationData);
  stations.forEach(function(o) {
      var orig = that.stationData[o],
          dests = d3.keys(orig.routes);
      dests.forEach(function (dest) {
        if (orig.routes[dest] > 500) {     
          line = L.polyline([[orig.lat,orig.lng],[that.stationData[dest].lat,that.stationData[dest].lng]], polyline_options).addTo(that.map);
          line.bindPopup(orig.routes[dest] + ' trips from ' + orig.fullname + ' to ' + that.stationData[dest].fullname);
          line.on('mouseover', function(e) {
            e.target.openPopup();
          })
        }
      });
      var s = orig.hourly.average.a+orig.hourly.average.d,
          r = that.getRadius(that.areaScale(s)),
          c = that.color(orig.hourly.average.a/s);
      console.log([orig.lat,orig.lng])
      //L.circle([orig.lat,orig.lng], r, {color: c, opacity: 1, fillOpacity: 0.5, className:'node',weight:2}).addTo(that.map).bindPopup(orig.fullname);

  });
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
