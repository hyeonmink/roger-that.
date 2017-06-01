const defaultYear = [2015];
const defaultMapType = 'terrain'
const mapRadius = 3;
var googleMap = function(){
    let years = defaultYear;
    let mapTypeName = defaultMapType;
    let coords = {}
    var map = (selection)=>{
        selection.each((data)=>{
            let filteredData = data.filter((d)=>{
                if (years.indexOf(+d.iyear) != -1){
                    return d;
                }
            })
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 2,
                center: {lat:0,lng:0},
                mapTypeId: mapTypeName
            });

            var markers = filteredData.map((data)=>{
                var coord = {                        
                        lat: +data.latitude,
                        lng: +data.longitude
                }
                if(!coords[+coord.lat]){
                    coords[+coord.lat] = [+coord.lng]
                }
                console.log(coords[+coord.lat].indexOf(+coord.lng))
                while(coords[+coord.lat].indexOf(+coord.lng) != -1){
                    console.log("?")
                    var angle = Math.random()*Math.PI*2;
                    coord = {
                        lat: +data.latitude + Math.cos(angle)*mapRadius,
                        lng: +data.longitude + Math.sin(angle)*mapRadius
                    }
                    if(!coords[+coord.lat]){
                        coords[+coord.lat] = [+coord.lng]
                    }                    
                }           
                       
                var marker = new google.maps.Marker({
                    position: coord,
                    map: map,
                    title: data.country_txt
                })
                let year = (data.iyear != 0 ? data.iyear : "unknown")
                let month = (data.imonth != 0 ? data.imonth : "unknown")
                let day = (data.iday != 0 ? data.iday : "unknown")
                let location = (data.city == 'unknown' ? data.provstate : data.city)
                var infowindow = new google.maps.InfoWindow({
                    content: `<h2>${year}/${month}/${day}</h2><p>${location}, ${data.country_txt} (${data.region_txt})</p><p>${data.summary}</p>`
                });

                marker.addListener('click', function(){
                    infowindow.open(map, marker);
                });
                
                return marker;  
            });
            console.log(coords)
            var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
            );
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