/**
 * WhenVis
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
WhenVis = function(_parentElement, _data, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;
  this.displayData = [];
  this.selection = 'total';
  this.dom = ["total"];
  // Define all "constants" here
  this.margin = {
      top: 10,
      right: 10,
      bottom: 60,
      left: 45
    },
  this.width = this.parentElement.node().clientWidth - this.margin.left - this.margin.right,
  this.height =  this.parentElement.node().clientHeight- this.margin.top - this.margin.bottom;
  this.filter = null;
  this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
 var formatCount = d3.format(",.0f"),
    formatTime = d3.time.format("%H:%M"),
    formatMinutes = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); };

WhenVis.prototype.initVis = function() {
  var that = this;

  d3.selectAll("button").on("click", function () {
    $(that.eventHandler).trigger("selectionChanged", $(this)[0].value);
    // that.updateVis($(this)[0].value)
  })
  this.color = d3.scale.ordinal().domain(colorDomain).range(colorRange);

  this.x = d3.scale.linear()
  .domain([0,1440])
    .range([this.margin.left, this.width]);

  this.y = d3.scale.linear()
    .range([that.height, that.margin.bottom]);


  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .tickFormat(formatMinutes)
    .orient("bottom");

  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .orient("left");

  // this.area = d3.svg.area()
  //   .interpolate("basis")
  //   .x(function(d) { return that.x(d.date); })
  //   .y0(function(d) { return that.y(0); })
  //   .y1(function(d) { return that.y(d.value); });

  this.line = d3.svg.line()
  	.interpolate("basis")
    .x(function(d) { return that.x(d.date); })
    .y(function(d) { return that.y(d.value); })

  this.weekendLine = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return that.x(d.date); })
    .y(function(d) { return that.y(d.weekend); })

  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+this.height+")");

  this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+this.margin.left+",0)");


  // // filter, aggregate, modify data
  this.wrangleData(this.filter);

  // // call the update method
  this.updateVis();
}

WhenVis.prototype.wrangleData = function(_filterFunction) {

  console.log('wrangling');
  this.displayData = this.filterAndAggregate(_filterFunction);
}

WhenVis.prototype.updateVis = function() {

  var that = this;

  // this.x.domain(d3.extent(that.displayData, function(d) { console.log(d); return d.timeofday; }));
  this.y.domain([0,d3.max(that.displayData, function (d) {  return d3.max(d.total, function (a) {console.log(a); return a.value})})]);

  this.svg.select(".y.axis")
    .call(this.yAxis);

  this.svg.select(".x.axis")
    .call(this.xAxis);

  var user = this.svg.selectAll(".user")
      .data(that.displayData);

  user.enter().append("g")
      .attr("class", "user")
      .append("path")

 this.svg.selectAll('.xText').remove();
  this.svg
      .append("text")
      .attr("class", 'xText')
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+this.width/2+","+(this.height+50)+")")  // text is drawn off the screen top left, move down and out and rotate
      .text("Time of Day");


  this.svg
      .append("text")
      .attr("class", "xText")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+this.margin.left/8+","+(this.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .text(function() {
         if (that.selection=='total') {
           return 'Average Speed (mph)';
         }
         else {
           return 'Time';
         }
      });


  var line = this.svg.selectAll(".userline")
  	  .data(this.displayData);

  line.enter().append("g")
  	  .attr("class","userline")
  	  .append("path")
	  .attr("class","line");

  line.select(".line")
      .transition()
  	  .attr("d",function (d) { return that.line(d.total)})
  	  .style("stroke", function (d) {return that.color(d.type)})
      .style("stroke-width", 3)

  var weekendLine = this.svg.selectAll(".weekendLine")
  	  .data(this.displayData);

  weekendLine.enter().append("g")
  	  .attr("class","weekendLine")
  	  .append("path")
	  .attr("class","line");

  weekendLine.select(".line")
      .transition()
  	  .attr("d",function (d) { return that.line(d.weekend)})
  	  .style("stroke", 'blue')
      .style("stroke-width", 3)

  var weekdayLine = this.svg.selectAll(".weekdayLine")
      .data(this.displayData);

  weekdayLine.enter().append("g")
      .attr("class","weekdayLine")
      .append("path")
    .attr("class","line");

  weekdayLine.select(".line")
      .transition()
      .attr("d",function (d) { return that.line(d.weekday)})
      .style("stroke", 'red')
      .style("stroke-width", 3)

  user.exit().remove();
  line.exit().remove();
  weekendLine.exit().remove();
  weekdayLine.exit().remove();
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */

WhenVis.prototype.onSelectionChange = function(selection) {
  this.selection = selection;
  console.log(this.selection);
  this.wrangleData(this.filter);
  this.updateVis();
}

WhenVis.prototype.onTypeChange = function(_dom) {
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

WhenVis.prototype.filterAndAggregate = function(_filter) {
  var makeMinutes = function(s) {
    a = s.split(":");
    var minutes = 0;
    minutes += parseInt(a[0]) * 60;
    minutes += parseInt(a[1]);
    return minutes
  };

  var makeValue = function(dist, time) {
    return parseFloat(dist.replace(/,/g, ''))/time*60;
  };

  var makeDifValue = function(totald, weekendd, totalt, weekendt) {
    return (parseFloat(totald.replace(/,/g, '')) - parseFloat(weekendd.replace(/,/g, '')))/(totalt -weekendt)*60;
  };

  var that = this;
  console.log(that.selection );
  var res = this.data;
  res = that.dom.map(function (t) {
    if (that.selection === 'total') {
      return {
        type: t,
        total: res.map(function (d) {
          return {date: makeMinutes(d.timeofday),value: makeValue(d.dist,d.time)};
        }),
        weekend: res.map(function (d) {
          return {date: makeMinutes(d.timeofday),value: makeValue(d.distWeekend, d.timeWeekend)};
        }),
        weekday: res.map(function (d) {
          return {date: makeMinutes(d.timeofday),value: makeDifValue(d.dist, d.distWeekend, d.time, d.timeWeekend)};
        })
      };
    }
    else if(that.selection === 'maleVsFemale') {
      return {
        type: t,
        total: res.map(function (d) {
          return {date: makeMinutes(d.timeofday),value: parseInt(d.total)/60};
        }),
        weekend: res.map(function (d) {
          return {date: makeMinutes(d.timeofday),value: (parseInt(d.total) - parseInt(d.female))/60};
        }),
        weekday: res.map(function (d) {
          return {date: makeMinutes(d.timeofday),value: parseInt(d.female)/60};
        })
      };
    }
    else {
      return {
        type: t,
        total: res.map(function (d) {
          return {date: makeMinutes(d.timeofday),value: parseInt(d.total)/60};
        }),
        weekend: res.map(function (d) {
          return {date: makeMinutes(d.timeofday),value: (parseInt(d.total) - parseInt(d.leisure))/60};
        }),
        weekday: res.map(function (d) {
          return {date: makeMinutes(d.timeofday),value: parseInt(d.leisure)/60};
        })
      };
    }

  });
console.log(res);
  return res;
}

// WhenVis.prototype.mouseover = function() {
//   d3.selectAll(".area").style("opacity",0.3);
//   d3.selectAll(".line").style("stroke","2px");
//   d3.select(d3.event.target).style("opacity",0.8).style("stroke","5px");
// }
// WhenVis.prototype.mouseout = function() {
//   d3.selectAll(".area").style("opacity",0.6)
//   d3.selectAll(".line").style("stroke","2px")
// }
