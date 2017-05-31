$(function() {

    var margin = {
        top: 100,
        right: 10,
        bottom: 150,
        left: 60
    };
    var width = 960;
    var height = 600;

    var drawWidth = width - margin.left - margin.right;
    var drawHeight = height - margin.top - margin.bottom;

    var svg = d3.select("#attackTypesVis")
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    var radius = Math.min(width, height) / 2;
    var donutwidth = radius /2; 
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory20b);

    var pie = d3.pie()
        .sort(function(a, b) {
            return a.value - b.value;
        })
        .value(function(d) { return d.value; });

    var tooltip = d3.select('#attackTypesVis')                               
        .append('div')                                                
        .attr('class', 'toooltip')
        .style('width', donutwidth + "px")
        .style('left', (drawWidth / 2) - 35 + "px")
        .style('top', (drawHeight / 2) + "px");   
                    
    tooltip.append('p')
        .attr('class', 'type');
            
    tooltip.append('p')
        .attr('class', 'deathcount');


    var path = d3.arc()
        .outerRadius(radius - donutwidth)
        .innerRadius(radius);

    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 40);

    d3.csv("./data/globalterrorismdb_0616dist.csv", function(error, data) {


        var prepData = d3.nest()
                        .key(function(d) { return d.attacktype1_txt; })
                        .rollup(function(d) {
                        return count = d3.sum(d, function(v) { return v.nkill; })
                        })
                        .entries(data);
            

        var arc = g.selectAll(".arc")
            .data(pie(prepData))
            .enter().append("g")
            .attr("class", "arc")
            
        arc.append("path")
            .attr('class', 'paths')
            .attr("d", path)
            .attr("fill", function(d) { return color(d.data.key); })

            svg.selectAll('path').on('mouseover', function(d) {
                tooltip.select('.type').html('<p>From<br /><strong>' + d.data.key + '</strong> type of attacks,</p>'); 
                tooltip.select('.deathcount').html('<p><strong>' + Math.round(d.data.value) + '</strong> people died. </p>'); 
                tooltip.style('display', 'block');
                svg.selectAll('path').attr('opacity', 0.5);
                event.srcElement.attributes.opacity.value = 1;

            })
            .on('mouseout', function() {
                tooltip.style('display', 'none');
                svg.selectAll('path').attr('opacity', 1)
            });
        
     
    });
});