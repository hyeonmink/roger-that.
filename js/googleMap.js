const defaultSelectedYear = 1970
const defaultMapType = 'terrain'
const mapRadius = .0002;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let mapMap = {}
var googleMap = function() {
    let selectedYear = defaultSelectedYear;
    let mapTypeName = defaultMapType;
    let mapContainer = document.getElementById("mapBox")
    var map = (selection) => {
        let coords = {}

        function renderSlider(low, high) {
            var sliderDiv = document.createElement('div');
            sliderDiv.setAttribute('class', 'sdiv')
            var lowest = document.createElement('b');
            lowest.innerHTML = low;
            var highest = document.createElement('b');
            highest.innerHTML = high;
            var slider = document.createElement('input')
            slider.setAttribute('id', 'slider')
            slider.setAttribute('type', 'text')
            slider.setAttribute('data-slider-id', 'ex1Slider')
            slider.setAttribute('data-slider-min', low)
            slider.setAttribute('data-slider-max', high)
            slider.setAttribute('data-slider-step', '1')
            slider.setAttribute('data-slider-value', selectedYear)

            var submitBtn = document.createElement('button')
            submitBtn.setAttribute('class', 'btn btn-primary')
            submitBtn.setAttribute('id', 'mapBtn')
            submitBtn.innerHTML = 'Search'

            sliderDiv.appendChild(lowest);
            sliderDiv.appendChild(slider);
            sliderDiv.appendChild(highest);
            mapContainer.appendChild(sliderDiv)
            mapContainer.appendChild(submitBtn)

            var mapCanvas = document.createElement('div')
            mapCanvas.setAttribute('id', 'map')
            mapContainer.appendChild(mapCanvas)

            $("#slider").slider({});
        }

        selection.each((data) => {
            for (var i = 0; i < data.length; i++) {
                if (!mapMap[data[i].iyear]) {
                    mapMap[data[i].iyear] = []
                }
                mapMap[data[i].iyear].push(data[i])
            }

            let min = +d3.min(data, function(d) {
                return d.iyear;
            })
            let max = +d3.max(data, function(d) {
                return d.iyear;
            })

            function draw() {
                mapContainer.innerHTML = ''
                let filteredData = mapMap[selectedYear] ?  mapMap[selectedYear] : []
                //initialize the map
                renderSlider(min, max)

                var drawMap = new google.maps.Map(document.getElementById('map'), {
                    zoom: 2,
                    center: {
                        lat: 0,
                        lng: 0
                    },
                    mapTypeId: mapTypeName,
                    styles: style
                });

                var markers = filteredData.map((data) => {

                    //get coordinate and locate the marker
                    //if location overlaps, use offset location
                    let lati = +data.latitude;
                    let longi = +data.longitude;
                    
                    // //offset function
                    if (!coords[lati]) {
                        coords[lati] = [longi]
                    } else {
                        while (coords[lati].indexOf(longi) != -1) {
                            var angle = Math.random() * Math.PI * 2;
                            lati = +data.latitude + Math.round(1000000 * (Math.cos(angle) * mapRadius)) / 1000000;
                            longi = +data.longitude + Math.round(1000000 * (Math.sin(angle) * mapRadius)) / 1000000;
                            if (!coords[lati]) {
                                coords[lati] = [longi]
                                break;
                            } else {
                                if (coords[lati].indexOf(longi) == -1) {
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


                    let month = (data.imonth != 0 ? months[data.imonth - 1] + " " : "")
                    let day = (data.iday != 0 ? (data.iday + ", ") : "")
                    let year = (data.iyear != 0 ? data.iyear : "")
                    let location = (data.city == 'unknown' ? data.provstate : data.city)
                    var infowindow = new google.maps.InfoWindow({
                        content: `<h2>${month}${day}${year}</h2><p>${location}, ${data.country_txt} (${data.region_txt})</p><p>${data.summary}</p>`
                    });

                    marker.addListener('click', function() {
                        infowindow.open(drawMap, marker);
                    });

                    return marker;
                });
                var markerCluster = new MarkerClusterer(drawMap, markers, {
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                });

                document.getElementById("mapBtn").addEventListener('click', () => {
                    selectedYear = +document.getElementById('slider').value
                    if(mapMap[selectedYear]){
                        // console.log(selectedYear)
                        // console.log("Button Pressed: " + (new Date()).getSeconds()+"."+(new Date()).getMilliseconds())
                        coords = {}
                        // console.log(mapMap)
                        draw()
                    } else {
                        draw()
                    }

                })
            }
            draw()
        })
    }

    map.years = function(value) {
        if (!arguments.length) return years;
        years = value;
        return map;
    }

    map.mapType = function(value) {
        if (!arguments.length) return mapTypeName;
        mapTypeName = value;
        return map;
    }
    return map
}