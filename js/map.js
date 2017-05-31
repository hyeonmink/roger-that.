//initialize the map
let year = 1970;
let array = []
function initMap() {
    function draw(year){
        d3.csv("./data/globalterrorismdb_0616dist.csv", (data) => {
            let min = +d3.min(data, function(d) { return d.iyear; })
            let max = +d3.max(data, function(d) { return d.iyear; })
            renderBtn(min, max)

            var map = googleMap().year(year)
                                .mapType('terrain')

            var drawMap = d3.select('#map').append("div")
                            .attr('id', 'googleMap')
                            .datum(data)

            drawMap.enter()
                .merge(drawMap)
                .call(map)
        });
    }

    function renderBtn(low, high){
        var ul = document.getElementById('radioBtns');
        ul.innerHTML = '';
        var li = document.createElement('li');//li

        for(var i = low; i <= high; i++){
            var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = i;

            li.appendChild(checkbox)
            li.appendChild(document.createTextNode(i));
            ul.appendChild(li);
        }
        
    }

    draw(year);
}