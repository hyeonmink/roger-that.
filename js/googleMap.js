var googleMap = function(){
    let year = 1970;
    let mapTypeName = 'terrain'
    var map = (selection)=>{
        selection.each((data)=>{
            let filteredData = data.filter((d)=>{
                if (d.iyear == year){
                    return d;
                }
            })
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 2,
                center: {lat:0,lng:0},
                mapTypeId: mapTypeName
            });

            var markers = filteredData.map((data)=>{
                var marker = new google.maps.Marker({
                    position: {
                        lat: +data.latitude,
                        lng: +data.longitude
                    },
                    map: map,
                    title: data.country_txt
                })
                google.maps.event.addListener(marker, 'click', function() { 
                alert("I am marker " + marker.title); 
                }); 
                return marker;  
            });
            var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        })
    }
    map.year = function(value){
        if (!arguments.length) return year;
        year = value;
        return map;
    }
    
    map.mapType = function(value){
        if (!arguments.length) return mapTypeName;
        mapTypeName = value;
        return map;
    }
    return map
}