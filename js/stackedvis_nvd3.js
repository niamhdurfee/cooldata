/**
 * StackedVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
StackedVis = function(_parentElement, _data, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.dom = ["registered","casual"];
  // Define all "constants" here
  this.margin = {
      top: 5,
      right: 5,
      bottom: 20,
      left: 40
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom;
  this.filter = null;
  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
StackedVis.prototype.initVis = function() {
  this.wrangleData(null);
  this.updateVis();
  
}

StackedVis.prototype.wrangleData = function(_filterFunction) {
  this.displayData = this.filterAndAggregate(_filterFunction);
}

StackedVis.prototype.updateVis = function() {
  nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
                  .margin({right: 50})
                  .x(function(d) { return d.date })   //We can modify the data accessor functions...
                  .y(function(d) { return d.registered })   //...in case your data is formatted differently.
                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                  .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                  .transitionDuration(500)
                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                  .clipEdge(true);

    this.svg
      .data(this.displayData)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
StackedVis.prototype.onSelectionChange = function(from,to,status) {
  if (status) {
    this.wrangleData(null)
  } else {
    this.wrangleData(function(d) {
      return ((d.date >= from) && (d.date <= to))
    });
  };
  this.updateVis();
}
StackedVis.prototype.onTypeChange = function(_dom) {
  console.log(_dom);
  if (this.dom != _dom) {
  	this.dom = _dom;
  	this.wrangleData(this.filter);
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

StackedVis.prototype.filterAndAggregate = function(_filter) {
  // Set filter to a function that accepts all items
  var filter = function() {
    return true;
  }
  if (_filter != null) {
    this.filter = _filter;
  } else {
  	this.filter = filter;
  }
  console.log("Filter function: ",_filter, this.filter)

  var that = this;
  var res = this.data.filter(this.filter);
  res = that.dom.map(function (t) {
    return {
      type: t,
      values: res.map(function (d) {
        return {date: d.date, y: d[t]}
      })
    }
  });
  console.log(res);
  return res;
}
