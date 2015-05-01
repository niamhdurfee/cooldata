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
      left: 100
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientWidth - this.margin.top - this.margin.bottom,
  this.header_height = 60 + this.margin.bottom;
    
  // set width of outer div to height of window
  $('#mapVis').height(window.innerHeight - this.header_height);

  // set up SVG
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
    
        
    //create min/max values for sliders
    
    var dist_max = Math.max.apply(Math,this.routeData.map(function(o){return o.dist;}));
    var dist_min = Math.min.apply(Math,this.routeData.map(function(o){return o.dist;}));

    var time_max = Math.max.apply(Math,this.routeData.map(function(o){return o.time;}));
    var time_min = Math.min.apply(Math,this.routeData.map(function(o){return o.time;}));
    
    $( "#slider-age" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#age-amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });

    $( "#age-amount" ).val( "" + $( "#slider-age" ).slider( "values", 0 ) +
      " - " + $( "#slider-age" ).slider( "values", 1 ) );
    
    
    $( "#slider-distance" ).slider({
      range: true,
      min: dist_min,
      max: dist_max,
      values: [ dist_min, dist_max ],
      slide: function( event, ui ) {
        $( "#distance-amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    
    $( "#distance-amount" ).val( "" + $( "#slider-distance" ).slider( "values", 0 ) +
      " - " + $( "#slider-distance" ).slider( "values", 1 ) );


    $( "#slider-time" ).slider({
      range: true,
      min: time_min,
      max: time_max,
      values: [ time_min, time_max ],
      slide: function( event, ui ) {
        $( "#time-amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    
    $( "#time-amount" ).val( "" + $( "#slider-time" ).slider( "values", 0 ) +
      " - " + $( "#slider-time" ).slider( "values", 1 ) );


  var polyline_options = {
      weight: 10,
      className: 'line',
      color: 'black',
      opacity: 0.5
    };
    
  var stations = d3.keys(this.stationData);
    
  this.areaScale = d3.scale.linear().range([0,200000]).domain([0, d3.max(stations, function (ea) {return (that.stationData[ea].overall.average.a + that.stationData[ea].overall.average.d)})]);
    
  this.color = d3.scale.linear().range(["red","grey","lightgreen"]).domain([0.45,0.5,0.55]);
    
  this.routeData.forEach(function(o) {
        if (o.trips > 300) {
          var line = L.Polyline.fromEncoded(o.polyline, polyline_options).addTo(that.map);
          line.bindPopup(o.trips +' trips from ' + "ORIGIN" + ' to ' + "that.stationData[dest].fullname");
          line.on('mouseover', function(e) {
            e.target.openPopup();
          })
        }
      });

    
    stations.forEach(function (o) {
       var orig = that.stationData[o],
           s = orig.overall.average.a+orig.overall.average.d,
           r = that.getRadius(that.areaScale(s)),
           c = that.color(orig.overall.average.a/s);
        var circle = L.circle(orig.loc, r, {color: c, opacity: 1, fillOpacity: 0.8, className:'station',weight:2}).addTo(that.map).bindPopup(orig.fullname)
        .on('click', function() {
//            EVENT HANDLER GOES HERE
            
            that.display_station_info(o);
        });
    })
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
  return Math.sqrt(parseFloat(d)/Math.PI)
}


MapVis.prototype.display_station_info = function(id)
{
    var that = this;
//    slide out menu from right if not already slid out

    $('#station-info').click();
    
    $('#station-name').html(that.stationData[id].toString());

    
//    use transition to display data
    
}