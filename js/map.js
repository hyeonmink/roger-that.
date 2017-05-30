
var markers
function initMap() {
    d3.csv("./data/globalterrorismdb_0616dist.csv", (data) => {
    var map = googleMap().year(1970)
                        .mapType('hybrid')

    var drawMap = d3.select('#map')
                    .datum(data)

    drawMap.enter()
           .attr('class', 'map')
           .merge(drawMap)
           .call(map)
    });
}