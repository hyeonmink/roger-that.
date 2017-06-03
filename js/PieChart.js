var PieChart = function() {
    var margin = {
        top: 100,
        right: 10,
        bottom: 150,
        left: 60
    };

    var width = 960;
    var height = 600;
    // var drawWidth = width - margin.left - margin.right;
    // var drawHeight = height - margin.top - margin.bottom;
    var drawWidth = width;
    var drawHeight = height;
    var radius = Math.min(width, height) / 2;
    var donutwidth = radius / 2;

    var color = d3.scaleOrdinal()
        .range(d3.schemeGreys[9]);

    var buttonContainer = $('#attackTypesVis').append('<div class="btn-group" id="buttonContainer" data-toggle="buttons">');
    $('#buttonContainer').append('<label id="test" class="btn btn-primary active"><input type="radio" value="attacktype1_txt" checked> Attack Type<br> </label>');
    $('#buttonContainer').append('<label class="btn btn-primary"><input type="radio" id="test2" value="weaptype1_txt"> Weapon Type </label>')

    var selectedColumn = "attacktype1_txt"




   var chart = function(selection) {

        var svg = d3.select("#attackTypesVis")
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr('id', 'lucy');

        var pie = d3.pie()
            .sort(function(a, b) {
                return a.value - b.value;
            })
            .value(function(d) {
                return d.value;
            });

        var tooltip = d3.select('#attackTypesVis')
            .append('div')
            .attr('class', 'toooltip')
            .style('width', donutwidth + "px")
            .style('left', (drawWidth / 2) - 35 + "px")
            .style('top', (drawHeight / 2) + margin.top + margin.bottom + 35+ "px")
            .style('word-break', 'break-all');

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

        function draw(){
            d3.select('#lucy').remove();
            var g = svg.append('g')
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                .attr('id', 'lucy');

            selection.each(function(data) {
                var prepData = d3.nest()
                    .key(function(d) {
                        return d[selectedColumn];
                    })
                    .rollup(function(d) {
                        return count = d3.sum(d, function(v) {
                            return v.nkill;
                        })
                    })
                    .entries(data);
                color.domain([0, data.length]);

                var arc = g.selectAll(".arc")
                    .data(pie(prepData))
                    .enter().append("g")
                    .attr("class", "arc")

                arc.append("path")
                    .attr('class', 'paths')
                    .attr("d", path)
                    .attr("fill", function(d, idx) {
                        return color(idx + 4);
                    })

                svg.selectAll('path').on('mouseover', function(d) {
                    if (selectedColumn == "attacktype1_txt") {
                        tooltip.select('.type').html(`<p>From<br /><strong>${d.data.key}</strong> type of attacks,</p>`);
                        tooltip.select('.deathcount').html('<p><strong>' + Math.round(d.data.value).toLocaleString() + '</strong> people died. </p>');
                    } else {
                        tooltip.select('.type').html(`<strong>${Math.round(d.data.value).toLocaleString()}</strong> people were killed by</p>`);
                        tooltip.select('.deathcount').html(`<p><strong>${d.data.key}</strong> weapon type</p>`);
                    }
                        tooltip.style('display', 'block');
                        svg.selectAll('path').attr('opacity', 0.3);
                        event.srcElement.attributes.opacity.value = 1;

                    })
                    .on('mouseout', function() {
                        tooltip.style('display', 'none');
                        svg.selectAll('path').attr('opacity', 1);
                    });

                arc.exit().remove();
                d3.selectAll("path").exit().remove();
            });
        }
        draw();

        $('#buttonContainer').click(function(event) {
            selectedColumn = event.target.childNodes[0].defaultValue;
            draw();
        })

    }

    return chart;
}