'use strict';

function PeopleChart() {
    var personSize = 8,
        personMargin = 5,
        personCols = 7,
        color = d3.scaleOrdinal(d3.schemeCategory10);
    var transitionDelay = 1500;

    var width = 450,
        height = 500;

    var margin = { left: 10, top: 10, bottom: 20, right: 10 };

    var chart = function (selection) {
        selection.each(function (data) {
            console.log(data)
            var categories = []; //List of all the catories - in this case country names
            data.forEach(function (x) {
                if (!categories.includes(x.natlty1_txt)) { //assumes category is country name so natlty1_txt
                    categories.push(x.natlty1_txt); // For reusability replace natlty1_txt with variable that represents user input later
                }
            });
            categories = categories.sort();
            var xScale = d3.scaleBand().domain(categories).range([margin.left, width - margin.right], 0);
            var rowScale = d3.scaleLinear().domain([0, personCols - 1]).range([0, personSize * personCols + ((personCols - 1) * personMargin)]);

            var deathCounter = [];

            for (var i = 0; i < categories.length; i++) {
                deathCounter.push({
                    xCounter: 0, // x counter is the correct x position (each country hsa a different one)
                    yCounter: 0, //total number of kills
                    hCounter: 0 // height
                });
            }

            var svg = d3.select(this)
                .selectAll('.peopleCharts')
                .data(data, function (d) {
                    return [d.natlty1_txt, +d.nkill]
                });

            var svgEnter = svg.enter()
                .append('svg')
                .attr('class', 'peopleCharts')
                .attr('width', width)
                .attr('height', height);

            var xAxisLabel = svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + margin.left + ',' + (height - margin.top - margin.bottom) + ')');

            var xAxis = d3.axisBottom()
                .scale(xScale)
            xAxisLabel.transition().duration(400).call(xAxis);

            svg.exit().remove();

            var allData = [];
            var counter = 0
            data.forEach(function(node) { // enter function can only take in one kill at a time
                for(i = 0; i < node.nkill; i++) {
                    allData.push([node.natlty1_txt, 1])
                }
            });

            var people = svgEnter.selectAll('.people').data(allData);

            people.enter()
                .append('rect')
                .attr('class', 'people')
                .attr('width', personSize)
                .attr('height', personSize)
                .style('fill', function (d) { return color(d[0]) })
                .attr("x", width / 2)
                .attr("y", 0)
                .attr("title", function (x, i) { return x[0] + '-' + i })
                .on('mouseover', function (d) {
                    d3.select(this)
                        .style('fill', 'cyan');
                })
                .on('mouseout', function (d) {
                    d3.select(this)
                        .style('fill', function (d) { return color(d[0]) });
                })
                .append("rect:title")
                .text(function (d, i) { return i })
                .transition()
                .duration(function (d, i) { return i / allData.length * transitionDelay; })
                .duration(100)
                .attr("x", function (d) {
                    var index = categories.indexOf(d[0]);

                    deathCounter[index].xCounter++;
                    var adjustment = xScale.range() / 2 - (personSize * personCols + personMargin * (personCols - 1)) / 2;

                    return margin.left + xScale(d[0]) + adjustment + rowScale((deathCounter[index].xCounter - 1) % personCols);
                })
                .attr("y", function (d) {
                    var index = categories.indexOf(d[0]);
                    deathCounter[index].yCounter++;
                    
                    if ((deathCounter[index].yCounter - 1) % personCols == 0) {
                        deathCounter[index].hCounter++;
                    }

                    return (height - margin.bottom - margin.top) - (deathCounter[index].hCounter * (personMargin + personSize));
                });

            people.exit().transition().duration(function (d, i) { return i / allData.length * transitionDelay }).remove();
        })
    }
    console.log('done')
    return chart;
}


