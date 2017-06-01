'use strict';
$(function() {

    var yearTarget;
    var dim = {width: 960, height: 500};
    var margin = {top: 10, bottom: 50, left: 50, right: 10};
    var inputHeight = 20;
    var numberFormat = d3.format('.0f');
    dim.graphWidth = dim.width - margin.left - margin.right;
    dim.graphHeight = dim.height - margin.top - margin.bottom;

    var svg = d3.select('#vis').append('svg')
        .attr('width', dim.width)
        .attr('height', dim.height);
    var axisLayer = svg.append('g').attr('transform','translate(' + margin.left + ',' + margin.top + ')');
    var graphLayer = svg.append('g').attr('transform','translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3.scaleBand().range([0,dim.graphWidth],0.05);
    var xLocalScale = d3.scaleBand();
    var yScale = d3.scaleBand().range([dim.graphHeight, 0]);
    var colorScale = d3.scaleOrdinal(d3.schemeCategory20b);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xAxisObj = axisLayer.append('g')
        .attr('transform','translate('+0+','+dim.graphHeight+')')
        .attr('class','axis')
        .call(xAxis);
    var yAxisObj = axisLayer.append('g')
        .attr('transform','translate('+0 +','+0+')')
        .attr('class','axis')
        .call(yAxis);

    axisLayer.selectAll('.axis text').style('font','14px "Lucida Grande", Helvetica, Arial, sans-serif');
    axisLayer.selectAll('.axis path.domain').style({fill:'none',stroke:'#000000','shape-rendering':'crispEdges'});

    var time = 0;
    var yearLabel = 'year';
    var radius = 1;
    var mar = 0.6;
    var barWidth = 16;
    var displaydata = [];
    var years = [];

    d3.csv('../data/globalterrorismdb_0616dist.csv', function(error,datum) {

            var raw = d3.nest()
                    .key(function(d) {
                        return (d.iyear).substring(0, 3);
                    })
                    .rollup(function(d) {
                        return d3.sum(d, function(v) { return Math.round(v.nkill); })
                    })
                    .entries(datum);
            
            raw.forEach(function(d) { d.key = (d.key).substring(2) + "0's" });
            var years2 = raw.map(function(d) { return d.key });
            var deaths = raw.map(function(d) { return (d.value); });


    if (error != null)
    {
        console.log(error);
        return;
    }

    var parties = years2;
    var partDict = {};
    parties.forEach(function(d,i)
    {
        partDict[d] = i;
    });
    var sums = {};
    var data = {};

    data[0] = deaths;

    var max = d3.max(deaths);
    var nrow = Math.ceil(dim.graphHeight/(2*(radius+mar)));
    barWidth = Math.ceil(max/nrow);
    yScale.domain(d3.range(nrow));
    yAxis.tickValues(d3.range(nrow).filter(function(d){return d%10===0;}));
    yAxis.tickFormat(function(d){return (d*barWidth);});
    xScale.domain(parties.map(function(d,i){return i;}));
    xAxis.tickFormat(function(d){return parties[d];});
    xAxisObj.call(xAxis);
    yAxisObj.call(yAxis);
    xLocalScale.range([0,xScale.bandwidth()]).domain(d3.range(barWidth));
    colorScale.domain(d3.range(parties.length));

    var summax = d3.sum(deaths)

    var displaydata = d3.range(summax).map(function(d){return [];});

    var indexMargin = 0;
    parties.forEach(function(party,partyidx)
    {

        for (var i=0;i<data[0][partyidx];++i)
        {
        displaydata[indexMargin+i].push({label:partyidx,idx:i});
        }
        indexMargin += data[0][partyidx];
    });


    var votes = graphLayer.selectAll('.vote').data(displaydata)

    votes.enter().append('circle')
        .attr('class','vote')
        .attr('r',radius)
        // .attr('cx', 10)
        // .attr('cy', 10)
        // .transition()
        // .duration(1500)
        // .delay(4000)
        .attr('cx',function(d){ return ((d[time].label!=null)?(xScale(d[time].label)+xLocalScale(d[time].idx%barWidth)+radius+mar):(dim.graphWidth/2)); })
        .attr('cy',function(d){return ((d[time].label!=null)?(yScale(Math.floor((d[time].idx+0.1)/barWidth))-radius-mar):0);})
        .style('opacity',function(d){return (d[time].label!=null)?0.8:0.0;})
        .style('fill',function(d){return colorScale(d[time].label);});
    });

    votes.exit().remove();
});