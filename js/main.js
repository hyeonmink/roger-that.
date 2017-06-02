// Main.js
var data = [{
    name: 'Left Bar',
    value: 11
}, {
    name: 'Right Bar',
    value: 34
}];

var fillColor,
    nodeFill,
    drawBarDots;


var treeData = {
    "name": "Title Page",
    "children": [{ 
        "name": "At a Glance",
        "children": [{
            "name": "People",
            "children": [{
                "name": "Lives Lost",
                "children": [{
                        "name": "Attack Types"
                }]
            }]
        }]
    }]
};

$(function() {
    $("#ex2").slider({});
    // // Instantiate your chart with given settings
    // var myChart = BarChart().xVar('name')
    //     .yVar('value')
    //     .xAxisLabel('Bar')
    //     .yAxisLabel('Arbitrary Value');

    // // Build chart
    // var chart = d3.select('#vis').datum(data).call(myChart);

    var myTree = TreeMap()
    var leTree = d3.select('#nav-bar').datum(treeData).call(myTree);


    var update = function(index){
        if (index == 0) {
            fillColor = 'blue';
            resetTree();
            $("#circle1").css("fill", "#fff");
        } else if (index == 1) {
            fillColor = 'red';
            nodeFill = 'red';
            resetTree();
            $("#circle2").css("fill", "#fff");
        } else if (index == 2) {
            fillColor = 'orange';
            resetTree();
            $("#circle3").css("fill", "#fff");
        } else if (index == 3) {
            fillColor = 'green';
            resetTree();
            $("#circle4").css("fill", "#fff");
        } else if (index == 4) {
            fillColor = 'green';
            resetTree();
            $("#circle5").css("fill", "#fff");
        } else {
            fillColor = 'black';
            nodeFill = '#fff';
            resetTree();
        }
    }

    var resetTree = function() {
        for (var i = 1; i <= 6; i++) {
            var circleID = "#circle"+i;
            $(circleID).css("fill", "grey");
        }
    }

    function goToByScroll(id){
        $('html,body').animate({
            scrollTop: $("#"+id).offset().top - 38},
            'slow');
    }

    $("#circle1").on('click', function(e) {
        e.preventDefault();
        goToByScroll("landing");
        update(0);
    });

    $("#circle2").on('click', function(e) {
        e.preventDefault();
        goToByScroll("glance");
        update(1);
    });

    $("#circle3").on('click', function(e) {
        e.preventDefault();
        goToByScroll("story");
        writeStory();
        update(2);
    });

    $("#circle4").on('click', function(e) {
        e.preventDefault();
        goToByScroll("incidents");
        drawBarDots();
        update(3);
    });

    $("#circle5").on('click', function(e) {
        e.preventDefault();
        goToByScroll("types")
        update(4);
    });

    // Define a new scroller, and use the `.container` method to specify the desired container
    var scroll = scroller()
        .container(d3.select('#graphic'));

    // Pass in a selection of all elements that you wish to fire a step event:
    scroll(d3.selectAll('.step')); // each section with class `step` is a new step

    // Specify the function you wish to activate when a section becomes active
    scroll.on('active', function(index) {
        update(index);
    })

    d3.csv("./data/globalterrorismdb_0616dist.csv", function(error, data) {
        drawBarDots = function() {
            var bar = BarChart()
            var peopleChart = d3.select('#livesLostVis')
                .datum(data)

            peopleChart.enter().append('div')
                .attr('class', 'peopleChart')
                .merge(peopleChart)
                .call(bar);
            
            peopleChart.exit().remove();
        }

        var pie = PieChart()
        var myPieChart = d3.select('#attackTypesVis')
                            .datum(data)



        myPieChart.enter().append('div')
                    .attr('class', 'myPieChart')
                    .merge(myPieChart)
                    .call(pie);

        myPieChart.exit().remove();
    });

    var texts = ["1 person is like you and me; and like the population of Bulford, Wyoming",
                "3 people is the average family size in the US",
                "5 people is enough to fill a car",
                "In a group of 20 people, 2 people are likely to have the same birthday",
                "50 people is enough to populate the earth and maintain genetic diversity",
                "100 people is the number of senators in the US",
                "200 people are the number of people in the most recent Informatics cohort",
                "700 people are enough to fill the largest classroom at UW",
                "If people were words, then 1000 people would make up a picture"];
    var textToDisplay;

    var writeStory = function() {
        console.log('hi')
        d3.select("#storyDisplay").text("")
        var counter = 0;

        d3.select("h3")
            .transition()
            .duration(2500)
            .on("start", function repeat() {
                if (texts.length < counter)
                    counter = 0;
                textToDisplay = texts[counter++];
                var t = d3.active(this)
                    .style("opacity", 0)
                    .remove();

                d3.select("#storyDisplay").append("h3")
                    .style("opacity", 0)
                    .text(textToDisplay)
                    .transition(t)
                    .style("opacity", 1)
                    .transition()
                    .delay(3500)
                    .on("start", repeat);
        });
    }

});