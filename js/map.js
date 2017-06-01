//initialize the map
let array = []

function run(){
    console.log("run")
    d3.csv("./data/globalterrorismdb_0616dist.csv", (data) => {
        var map = googleMap().years(yearChecked)
                            .mapType('terrain')

        var drawMap = d3.select('#map').append("div")
                        .attr('id', 'googleMap')
                        .datum(data)

        drawMap.enter()
            .merge(drawMap)
            .call(map)
    });
}
//run()


// function initMap() {
//     function draw(checks){
//         d3.csv("./data/globalterrorismdb_0616dist.csv", (data) => {
//             // let min = +d3.min(data, function(d) { return d.iyear; })
//             // let max = +d3.max(data, function(d) { return d.iyear; })
//             // renderBtn(min, max)
//             var map = googleMap().years(yearChecked)
//                                 .mapType('terrain')

//             var drawMap = d3.select('#map').append("div")
//                             .attr('id', 'googleMap')
//                             .datum(data)

//             drawMap.enter()
//                 .merge(drawMap)
//                 .call(map)
//         });
//     }

//     // function renderBtn(low, high){
//     //     var ul = document.getElementById('radioBtns');
//     //     ul.innerHTML = '';
//     //     var li = document.createElement('li');
//     //     for(var i = low; i <= high; i++){
//     //         var checkbox = document.createElement('input');
//     //             checkbox.type = "checkbox";
//     //             checkbox.value = i;
//     //             checkbox.autocomplete = "off"
//     //             if(yearChecked.indexOf(i) != -1){
//     //                 checkbox.checked = "true"
//     //             }
                
//     //         li.appendChild(checkbox)
//     //         li.appendChild(document.createTextNode(i));
//     //         ul.appendChild(li);
//     //     }
//     // }

//     // document.getElementById('mapBtn').addEventListener('click',(evt)=>{
//     //     evt.preventDefault();
//     //     yearChecked = [];
//     //     $("input:checkbox[type=checkbox]:checked").each(function(){
//     //         yearChecked.push(+$(this).val());
//     //     });
//     //     draw(yearChecked);
//     // })

//     draw(yearChecked);
// }

