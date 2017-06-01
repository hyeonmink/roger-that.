const defaultYear = [2015];
const defaultMapType = 'terrain'
const mapRadius = .0002;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

let yearChecked = [1970]

var googleMap = function(){
    let years = defaultYear;
    let mapTypeName = defaultMapType;

    var map = (selection)=>{
        let coords = {}
        function renderBtn(low, high){
            var ul = document.getElementById('radioBtns');
            ul.innerHTML = '';
            var li = document.createElement('li');
            for(var i = low; i <= high; i++){
                var checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.value = i;
                    checkbox.autocomplete = "off"
                    if(yearChecked.indexOf(i) != -1){
                        checkbox.checked = "true"
                    }
                    
                li.appendChild(checkbox)
                li.appendChild(document.createTextNode(i));
                ul.appendChild(li);
            }
        }

        selection.each((data)=>{
            let min = +d3.min(data, function(d) { return d.iyear; })
            let max = +d3.max(data, function(d) { return d.iyear; })
            renderBtn(min, max)


            function draw(){
                    let filteredData = data.filter((d)=>{
                    if ((years.indexOf(+d.iyear) != -1)){
                        return d;
                    }
                })

                //initialize the map
                var drawMap = new google.maps.Map(document.getElementById('map'), {
                    zoom: 2,
                    center: {lat:0,lng:0},
                    mapTypeId: mapTypeName,
                    styles: style
                });

                var markers = filteredData.map((data)=>{
                    
                    //get coordinate and locate the marker
                    //if location overlaps, use offset location
                    let lati = +data.latitude;
                    let longi = +data.longitude;
                    if(!coords[lati]){
                        coords[lati] = [longi]
                    } else {
                        while(coords[lati].indexOf(longi) != -1){
                            var angle = Math.random()*Math.PI*2;                       
                            lati= +data.latitude + Math.round(100000*(Math.cos(angle)*mapRadius))/100000;
                            longi= +data.longitude + Math.round(100000*(Math.sin(angle)*mapRadius))/100000;
                            if(!coords[lati]){
                                coords[lati] = [longi]
                                break;
                            } else {
                                if(coords[lati].indexOf(longi) == -1){
                                    coords[lati].push(longi)
                                    break;
                                }
                            }
                        }
                    }

                    let coord = {                        
                            lat: lati,
                            lng: longi
                    }      
                        
                    var marker = new google.maps.Marker({
                        position: coord,
                        map: drawMap,
                        title: data.country_txt
                    })
                    let month = (data.imonth != 0 ? months[data.imonth-1]+" " : "")
                    let day = (data.iday != 0 ? (data.iday+", ") : "")
                    let year = (data.iyear != 0 ? data.iyear : "")
                    let location = (data.city == 'unknown' ? data.provstate : data.city)
                    var infowindow = new google.maps.InfoWindow({
                        content: `<h2>${month}${day}${year}</h2><p>${location}, ${data.country_txt} (${data.region_txt})</p><p>${data.summary}</p>`
                    });

                    marker.addListener('click', function(){
                        infowindow.open(drawMap, marker);
                    });
                    
                    return marker;  
                });
                var markerCluster = new MarkerClusterer(drawMap, markers,
                    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
                );
            }
            draw()

            document.getElementById('mapBtn').addEventListener('click',(evt)=>{
                evt.preventDefault();
                yearChecked = [];
                $("input:checkbox[type=checkbox]:checked").each(function(){
                    yearChecked.push(+$(this).val());
                });
                years = yearChecked;
                console.log(years)
                draw()
            })           
        })     
    }

    map.years = function(value){
        if (!arguments.length) return years;
        years = value;
        return map;
    }
    
    map.mapType = function(value){
        if (!arguments.length) return mapTypeName;
        mapTypeName = value;
        return map;
    }
     return map
}