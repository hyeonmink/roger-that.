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
    drawBarDots,
    drawTypesChart;


var treeData = {
    "name": "Title Page",
    "children": [{
        "name": "Introduction",
        "children": [{
            "name": "Lives Lost",
            "children": [{
                "name": "How?",
                "children": [{
                    "name": "Attack Types",
                    "children": [{
                        "name": "Incidents"
                    }]
                }]
            }]
        }]
    }]
};

$(function() {
    var myTree = TreeMap()
    var leTree = d3.select('#nav-bar').datum(treeData).call(myTree);


    var update = function(index) {
        if (index == 0) {
            resetTree();
            $("#circle1").css("fill", "rgb(128, 128, 128)");
        } else if (index == 1) {
            resetTree();
            $("#circle2").css("fill", "rgb(128, 128, 128)");
        } else if (index == 2) {
            resetTree();
            $("#circle3").css("fill", "rgb(128, 128, 128)");
        } else if (index == 3) {
            resetTree();
            $("#circle4").css("fill", "rgb(128, 128, 128)");
        } else if (index == 4) {
            resetTree();
            $("#circle5").css("fill", "rgb(128, 128, 128)");
        } else if (index == 5) {
            resetTree();
            $("#circle6").css("fill", "rgb(128, 128, 128)");
        } else {
            nodeFill = 'rgb(128, 128, 128)';
            resetTree();
        }
    }

    var resetTree = function() {
        for (var i = 1; i <= 6; i++) {
            var circleID = "#circle" + i;
            $(circleID).css("fill", "#fff");
        }
    }

    function goToByScroll(id) {
        $('html,body').animate({
                scrollTop: $("#" + id).offset().top - 38
            },
            'slow');
    }

    $("#circle1").on('click', function(e) {
        e.preventDefault();
        goToByScroll("landing");
        update(0);
    });

    $("#circle2").on('click', function(e) {
        e.preventDefault();
        goToByScroll("story");
        writeStory();
        drawStory();
        update(1);
    });

    $("#circle3").on('click', function(e) {
        e.preventDefault();
        goToByScroll("incidents");
        drawBarDots();
        update(2);
    });

    $("#circle4").on('click', function(e) {
        e.preventDefault();
        goToByScroll("toTypes");
        introTypes();
        update(3);
    });

    $("#circle5").on('click', function(e) {
        e.preventDefault();
        goToByScroll("types");
        drawTypesChart();
        update(4);
    });

    $("#circle6").on('click', function(e) {
        e.preventDefault();
        goToByScroll("glance")
        update(5);
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

    var typesText = ["Now you may be wondering which types of attacks have taken the most lives..."]

    var texts = ["1 person is like you and me; and like the population of Bulford, Wyoming",
        "3 people is the average family size in the US",
        "5 people is enough to fill a car",
        "In a group of 20 people, 2 people are likely to have the same birthday",
        "50 people is enough to populate the earth and maintain genetic diversity",
        "100 people is the number of senators in the US",
        "each dot here represents 100 people",
        "200 people are the number of people in the most recent Informatics cohort",
        "700 people are enough to fill the largest classroom at UW",
        "If people were words, then 1000 people would make up a picture"
    ];

    var storyImages = ["person.png",
        "family.png",
        "car.png",
        "bday.png",
        "world.png",
        "senator.png",
        "dot.png",
        "dot2.png",
        "dot7.png",
        "dot10.png"
    ]

    var textToDisplay,
        imgToDisplay,
        typeTextToDisplay;

    var writeStory = function() {
        d3.select("#storyDisplay").text("")
        var counter = 0;

        d3.select("h3")
            .transition()
            .duration(2500)
            .on("start", function repeat() {
                if (texts.length - 1 < counter)
                    counter = 0;
                textToDisplay = texts[counter++];
                var t = d3.active(this)
                    .style("opacity", 0)
                    .remove();

                d3.select("#storyDisplay").append("h3")
                    .attr('id', "storyh3")
                    .style("opacity", 0)
                    .text(textToDisplay)
                    .transition(t)
                    .style("opacity", 1)
                    .transition()
                    .delay(3500)
                    .on("start", repeat);
            });
    }

    var drawStory = function() {
        var counter = 0;

        d3.select("#storyimgsrc")
            .transition()
            .duration(2500)
            .on("start", function repeat() {
                if (storyImages.length - 1 < counter) {
                    counter = 0;
                    if ($('#circle3').css('fill') == 'rgb(128, 128, 128)') {
                        goToByScroll("incidents");
                        drawBarDots();
                        update(2);
                    }
                }
                imgToDisplay = storyImages[counter++];
                var t = d3.active(this)
                    .style("opacity", 0)
                    .remove();

                d3.select("#storyImg").remove();
                d3.select("#story").append("div")
                    .attr("id", "storyImg")

                d3.select("#storyImg").append("img")
                    .style('width', '100px')
                    .style("opacity", 0)
                    .attr("src", "../img/" + imgToDisplay)
                    .transition(t)
                    .style("opacity", 1)
                    .transition()
                    .delay(3500)
                    .on("start", repeat);
            });
    }

    var introTypes = function() {
        d3.select("#typeStoryDisplay").text("hihi")
        // goToByScroll("types");
        // drawTypesChart();
        // update(4);
        // d3.select("#typeStoryDisplay").text("")
        // var counter = 0;

        // d3.select("h4")
        //     .transition()
        //     .duration(2500)
        //     .on("start", function repeat() {
        //         if (typesText.length - 1 < counter) {
        //             drawTypesChart();
        //             update(4)
        //         }
        //         typeTextToDisplay = typesText[counter++];
        //         var t = d3.active(this)
        //             .style("opacity", 0)
        //             .remove();

        //         d3.select("#typeStoryDisplay").append("h4")
        //             .attr('id', "storyh4")
        //             .style("opacity", 0)
        //             .text(typeTextToDisplay)
        //             .transition(t)
        //             .style("opacity", 1)
        //             .transition()
        //             .delay(3500)
        //             .on("start", repeat);
        //     });
    }

});

function run() {
    d3.csv("./data/globalterrorismdb_0616dist.csv", function(error, data) {
        drawBarDots = function() {
            d3.select("#livesLostVis").remove();
            d3.select("#incidents").append("div")
                .attr("id", "livesLostVis")

            var bar = BarChart()
            var peopleChart = d3.select('#livesLostVis')
                .datum(data)

            peopleChart.enter().append('div')
                .attr('class', 'peopleChart')
                .merge(peopleChart)
                .call(bar);

            peopleChart.exit().remove();
        }

        drawTypesChart = function() {
            d3.select("#attackTypesVis").remove();
            d3.select("#types").append("div")
                .attr("id", "attackTypesVis")

            var pie = PieChart()
            var myPieChart = d3.select('#attackTypesVis')
                .datum(data)

            myPieChart.enter().append('div')
                .attr('class', 'myPieChart')
                .merge(myPieChart)
                .call(pie);

            myPieChart.exit().remove();
        }

        var map = googleMap().years(defaultSelectedYear)
            .mapType('terrain')

        var drawMap = d3.select('#mapBox')
            .attr('id', 'googleMap')
            .datum(data)

        drawMap.enter()
            .merge(drawMap)
            .call(map)

    });
}