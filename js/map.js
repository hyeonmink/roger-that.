//initialize the map
let array = []
let checks = [1970]
function initMap() {
    function draw(checks){
        d3.csv("./data/test.csv", (data) => {
            let min = +d3.min(data, function(d) { return d.iyear; })
            let max = +d3.max(data, function(d) { return d.iyear; })
            renderBtn(min, max)
            var map = googleMap().years(checks)
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
        var li = document.createElement('li');
                console.log(checks)
        for(var i = low; i <= high; i++){
            var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = i;
                checkbox.autocomplete = "off"
                console.log(checks.indexOf(i))
                if(checks.indexOf(i) != -1){
                    checkbox.checked = "true"
                }
                

            li.appendChild(checkbox)
            li.appendChild(document.createTextNode(i));
            ul.appendChild(li);
        }
    }

    document.getElementById('mapBtn').addEventListener('click',(evt)=>{
        evt.preventDefault();
        checks = [];
        $("input:checkbox[type=checkbox]:checked").each(function(){
            checks.push(+$(this).val());
        });
        console.log(checks)
        draw(checks);
    })

    draw(checks);
}