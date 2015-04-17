/**
 * TimeVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
TimeVis = function(_parentElement, _eventHandler) {
  this.parentElement = _parentElement;
  this.eventHandler = _eventHandler;

  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 10
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height = this.parentElement.node().clientHeight - this.margin.top - this.margin.bottom;

  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
TimeVis.prototype.initVis = function() {
  var that = this;
  this.svg = this.parentElement.append("svg")
    .attr("width", this.width)
    .attr("height", this.height+this.margin.bottom)
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    .append("g");
  var start = new Date(0,0,0),
      stop = new Date(0,0,1);
  this.x = d3.time.scale().range([0, this.width]).domain([start,stop]);
  this.xAxis = d3.svg.axis()
    .scale(this.x).tickSize(5).ticks(d3.time.hour,1)
    .orient("bottom");

  this.brush = d3.svg.brush().x(this.x)
    .on("brush", function() {
      console.log(that.brush.extent()[0].getHours(), that.brush.extent()[1].getHours(), that.brush.empty())
      // Trigger selectionChanged event. You'd need to account for filtering by time AND type
      $(that.eventHandler).trigger("selectionChanged", [that.brush.extent()[0].getHours(), that.brush.extent()[1].getHours(), that.brush.empty()])
    });

 // Add axes visual elements
  this.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (this.height/2) + ")")

  this.svg.append("g")
    .attr("class", "brush")

 // updates axis
  this.svg.select(".x.axis")
    .call(this.xAxis);

  this.svg.select(".brush")
    .call(this.brush)
    .selectAll("rect")
    .attr("height", this.height+this.margin.bottom);

}