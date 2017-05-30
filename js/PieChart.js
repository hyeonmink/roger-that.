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
                .attr('width', width)
                .attr('height', height);

    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory20b);

    var pie = d3.pie()
        .sort(function(a, b) {
            return a.value - b.value;
        })
        .value(function(d) { return d.value; });


    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius - 40)
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
            
            // .on("mouseover", function(d) {
            //     //console.log(d);
            //     //console.log(d3.selectAll(".tooltip")._groups[0]);
            //     // d3.selectAll(".tooltip")[d.index].style('opacity', 1);
            //         // .select("#value").text(d.data.value);
            // })
            // .on("mousemove", function(d) {
            //     d3.selectAll(".tooltip").style("top", (d3.event.pageY - 10) + "px")
            //     .style("left", (d3.event.pageX + 10) + "px");
            // })
            // .on("mouseout", function() {
            //     d3.selectAll(".tooltip").style('opacity', 0);
            // });

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d) { console.log(d); return color(d.data.key); })

        arc.append("text")
            .attr("class", "tooltip")
            .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
            .attr("dy", "0.35em")
            .text(function(d) { console.log(d.data.key); return d.data.key; });

        
     
    });
});