const defaultYear = 1970;
const defaultMapType = 'terrain'
var googleMap = function(){
    let year = defaultYear;
    let mapTypeName = defaultMapType;
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
                let year = (data.iyear != 0 ? data.iyear : "unknown")
                let month = (data.imonth != 0 ? data.imonth : "unknown")
                let day = (data.iday != 0 ? data.iday : "unknown")
                let location = (data.city == 'unknown' ? provstate : data.city)
                let currentMark
                var infowindow = new google.maps.InfoWindow({
                    content: `<h2>${year}/${month}/${day}</h2><p>${location}, ${data.country_txt} (${data.region_txt})</p><p>${data.summary}</p>`
                });

                marker.addListener('click', function(){
                    infowindow.open(map, marker);
                });
                
                return marker;  
            });
            var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
            );
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