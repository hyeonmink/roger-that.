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

    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var pie = d3.pie()
        .sort(null)
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
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.key); });

    arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data.key; });
    });
});