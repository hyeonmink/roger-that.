   var BarChart = function() {

       // var dim = {width: 560, height: 340};
       var dim = {
           width: 960,
           height: 500
       };
       var margin = {
           top: 10,
           bottom: 50,
           left: 50,
           right: 10
       };
       var inputHeight = 20;
       var numberFormat = d3.format('.0f');
       dim.graphWidth = dim.width - margin.left - margin.right;
       dim.graphHeight = dim.height - margin.top - margin.bottom;

       var tip = d3.select("#livesLostVis").append("div")
           .attr("class", "tooltip")
           .style("opacity", 0);

       var chart = function(selection) {
           var svg = d3.select('#livesLostVis').append('svg')
               .attr('width', dim.width)
               .attr('height', dim.height);
           var axisLayer = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
           var graphLayer = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

           var xScale = d3.scaleBand().range([0, dim.graphWidth], 0.05);
           var xLocalScale = d3.scaleBand();
           var yScale = d3.scaleBand().range([dim.graphHeight, 0]);
           var colorScale = d3.scaleOrdinal(d3.schemeGreys[8]);

           // var color = d3.scaleOrdinal()
           // .range(d3.schemeGreys[6]);

           var xAxis = d3.axisBottom().scale(xScale);
           var yAxis = d3.axisLeft().scale(yScale);

           var xAxisObj = axisLayer.append('g')
               .attr('transform', 'translate(' + 0 + ',' + dim.graphHeight + ')')
               .attr('class', 'axis')
               .call(xAxis);
           var yAxisObj = axisLayer.append('g')
               .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
               .attr('class', 'axis')
               .call(yAxis);

           axisLayer.selectAll('.axis text').style('font', '14px "Lucida Grande", Helvetica, Arial, sans-serif');
           axisLayer.selectAll('.axis path.domain').style({
               fill: 'none',
               stroke: '#000000',
               'shape-rendering': 'crispEdges'
           });

           var time = 0;
           var yearLabel = 'year';
           var radius = 3;
           var mar = 0.6;
           var barWidth = 16;
           var displaydata = [];

           var years2 = [];
           var deaths = [];
           var deathsDisplay = [];

           selection.each(function(data) {
               var raw = d3.nest()
                   .key(function(d) {
                       return (d.iyear).substring(0, 3);
                   })
                   .rollup(function(d) {
                       return d3.sum(d, function(v) {
                           return Math.round(v.nkill);
                       })
                   })
                   .entries(data);

               raw.forEach(function(d) {
                   years2.push((d.key).substring(2) + "0's");
               });
               raw.forEach(function(d) {
                   deaths.push(Math.round(d.value / 100));
               });
               raw.forEach(function(d) {
                   deathsDisplay.push(d.value);
               });


           });

           var parties = years2;
           var partDict = {};
           parties.forEach(function(d, i) {
               partDict[d] = i;
           });
           var sums = {};
           var data = {};
           data[0] = deaths;

           var max = d3.max(deaths);
           var nrow = Math.ceil(dim.graphHeight / (2 * (radius + mar)));
           barWidth = Math.ceil(max / nrow);
           yScale.domain(d3.range(nrow));
           yAxis.tickValues(d3.range(nrow).filter(function(d) {
               return d % 10 === 0;
           }));
           yAxis.tickFormat(function(d) {
               return (d * barWidth * 100);
           });
           xScale.domain(parties.map(function(d, i) {
               return i;
           }));
           xAxis.tickFormat(function(d) {
               return parties[d];
           });
           xAxisObj.call(xAxis);
           yAxisObj.call(yAxis);
           xLocalScale.range([0, xScale.bandwidth()]).domain(d3.range(barWidth));
           colorScale.domain(d3.range(parties.length));

           var summax = d3.sum(deaths)

           var displaydata = d3.range(summax).map(function(d) {
               return [];
           });

           var indexMargin = 0;
           parties.forEach(function(party, partyidx) {
               for (var i = 0; i < data[0][partyidx]; ++i) {
                   displaydata[indexMargin + i].push({
                       label: partyidx,
                       idx: i,
                       yr: party
                   });
               }
               indexMargin += data[0][partyidx];
           });

           var votes = graphLayer.selectAll('.vote').data(displaydata)

           var ypos = []
           var currentYr;
           var prevYr;

           votes.enter().append('circle')
               .attr('class', 'vote')
               .attr('r', radius)
               .attr('cx', function(d, i) {
                   return i / 2
               })
               .attr('cy', function(d, i) {
                   return -i
               })
               .on('mouseover', function(d) {
                   var thisYr = d[0].yr;
                   var noOfDeaths = deathsDisplay[parties.indexOf(thisYr)];
                   tip.transition()
                       .duration(200)
                       .style("opacity", .9);
                   tip.html("There were <b>" + noOfDeaths + "</b> deaths in the " + thisYr)
                       .style("left", "32%")
                       .style("top", "43%");
               })
               .on("mouseout", function(d) {
                   tip.transition()
                       .duration(1500)
                       .style("opacity", 0);
               })
               .transition()
               .duration(function(d, i) {
                   return i * 1.01;
               })
               .delay(function(d, i) {
                   if (i < 100)
                       return i * 20 + 1500;
                   else
                       return i / 5 + 3500;
               })
               .attr('cx', function(d) {
                   return ((d[time].label != null) ? (xScale(d[time].label) + xLocalScale(d[time].idx % barWidth) + radius + mar) : (dim.graphWidth / 2));
               })
               .attr('cy', function(d) {
                   return ((d[time].label != null) ? (yScale(Math.floor((d[time].idx + 0.1) / barWidth)) - radius - mar) : 0);
               })
               .style('opacity', function(d) {
                   return (d[time].label != null) ? 0.8 : 0.0;
               })
               .style('fill', function(d) {
                   return colorScale(d[time].label + 3);
               });

           votes.exit().remove();

       }
       return chart;
   }