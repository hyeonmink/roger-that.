//initialize the map
let array = []

function run() {
    console.log("run")
    d3.csv("./data/globalterrorismdb_0616dist.csv", (data) => {
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