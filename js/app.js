/* variáveis globais */

var map;
      var markers = [];
      var largeInfowindow;

/* ======= Model ======= */

var model = {
    locations: [
    {title: 'Altice Arena', location: {lat: 38.768628, lng: -9.094068}},
    {title: 'Casino Lisboa', location: {lat: 38.764498, lng: -9.096326}},
    {title: 'Oceanário de Lisboa', location: {lat: 38.763582, lng: -9.093751}},
    {title: 'Pavilhão do Conhecimento', location: {lat: 38.762739, lng: -9.095581}},
    {title: 'Pavilhão de Portugal', location: {lat: 38.765786, lng: -9.094915}}      
    ]
};

/* ======= Octopus ======= */

var octopus = {

      init: function() {
          map = new google.maps.Map(document.getElementById('map'), {
          //Posição do Parque das Nações em Lisboa
          center: {lat: 38.7749537, lng: -9.1152045},
          zoom: 18
       });

            
        largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < model.locations.length; i++) {
          // Get the position from the location array.
          var position = model.locations[i].location;
          var title = model.locations[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            mapView.populateInfoWindow(this, largeInfowindow);
          });
          bounds.extend(markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
        
      }
    }

/* ======= View ======= */

var mapView = { 
      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      populateInfoWindow: function(marker, infowindow) {
        
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;       
          // Montando o conteúdo do Wikipedia
          var wikiUrl = 'http://pt.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
          var wikiRequestTimeout = setTimeout(function(){
            infowindow.setContent('<div><p>Erro ao carregar o wikipedia</p></div>');
          }, 8000);

          $.ajax({
              url: wikiUrl,
              dataType: "jsonp",
              success: function (response) {
                  infowindow.setContent('<div><p>' + response[2] + '</p></div>');
              clearTimeout(wikiRequestTimeout);
              }
          }); 

          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
        }
      },

      // Esconder todos e mostrar apenas o que foi selecionado
      showMarker: function(ponto) {
        //some todos os marcadores
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        //marca apenas o selecionado
        markers[ponto].setMap(map);
        var largeInfowindow = new google.maps.InfoWindow();
        mapView.populateInfoWindow(markers[ponto], largeInfowindow);
      }
}