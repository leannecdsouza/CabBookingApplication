angular.module('myApp').controller('BookingController', function($scope, $http) {
  $scope.Booking = [];
  var directionsService;
  var directionsDisplay;

  $(document).ready(function() {
    $(".part2").hide();
    $(".part3").hide();
  });

  $scope.initMap = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      document.innerHTML = "Geolocation is not supported by this browser.";
    }

    autocompleteA = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */
      (document.getElementById('pickup')));
    autocompleteB = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */
      (document.getElementById('dropoff')));

    places = new google.maps.places.PlacesService(map);

    autocompleteA.addListener('place_changed', onPlaceChanged)
    autocompleteB.addListener('place_changed', onPlaceChanged)


    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

  }

  function showPosition(position) {
    var uluru = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      draggable: true,
      map: map
    });

    var latlng = uluru;
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({
      'location': latlng
    }, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          document.getElementById('pickup').value = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });


    // Change location based on draggable marker
    google.maps.event.addListener(marker, 'dragend', function() {
      res = marker.getPosition();
      geocoder.geocode({
        'latLng': res
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            start = results[1].formatted_address;
            document.getElementById("pickup").value = start;
          }
        }
      });
    });
  }

  // See route
  function calcRoute(directionService, directionDisplay) {
    var map = new google.maps.Map(document.getElementById('map'));

    directionDisplay.setMap(map);
    directionService.route({
      origin: document.getElementById('pickup').value,
      destination: document.getElementById('dropoff').value,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionDisplay.setDirections(response);
        $(".part1").hide();
        $(".part2").show();
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    directionDisplay.addListener('directions_changed', function() {
      computeTotalDistance();
    });

  }


  $scope.calculateDistance = function() {
    calcRoute(directionsService, directionsDisplay);
  }


  function computeTotalDistance() {
    $scope.Booking.Pickup = document.getElementById('pickup').value;
    $scope.Booking.Dropoff = document.getElementById('dropoff').value;
    var newdistance = 0;

    //Distance and Duration
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [document.getElementById('pickup').value],
      destinations: [document.getElementById('dropoff').value],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function(response, status) {
      if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
        var distance = response.rows[0].elements[0].distance.text;
        var duration = response.rows[0].elements[0].duration.text;
        if (duration.indexOf('hours') != -1) {
          var hours = duration.split('hours')[0].trim();
          var minutes = duration.split('hours')[1].trim().split(' ')[0].trim();
          duration = (parseInt(hours) * 60) + parseInt(minutes) + " mins";
        } else if (duration.indexOf('hour') != -1) {
          var hour = duration.split('hour')[0].trim();
          var minutes = duration.split('hour')[1].trim().split(' ')[0].trim();
          duration = (parseInt(hour) * 60) + parseInt(minutes) + " mins";
        } else {
          duration = response.rows[0].elements[0].duration.text.trim();
        }

        numdist = distance.replace(' m', '');
        numdist = numdist.replace(' km', '');
        newdistance = +numdist;

        $scope.Booking.Distance = distance;
        $scope.Booking.Duration = duration;
        // document.getElementById("Distance").innerHTML = distance;
        // document.getElementById("Duration").innerHTML = duration;

        var cabType = $scope.Travel.CarType;
        $http.get('/findtariff/cabrates/' + cabType).then(function(response) {
          $scope.Tariffs = response.data[0];
          $scope.Booking.Fare = newdistance * $scope.Tariffs.NormalRate;
        });

      } else {
        alert("Unable to find the distance via road.");
      }
    });
  }

  $scope.travelLaterOps = function() {
    $(".btns2").hide();
    $(".part3").show();
    var d = new Date();
    var d = new Date("2015-03-25");
  }

  $scope.travelLater = function() {
    var date = $scope.Booking.Date + "";
    $scope.Booking.Date = date.substring(0, 21);

    var time = $scope.Booking.Time + "";
    $scope.Booking.Time = time.substring(16, 21);

    $scope.Journey = $scope.Booking;
    $scope.Journey.Booking = "Later"
    console.log($scope.Journey);
    $http.post('/addtravel', $scope.Journey).then(function(response) {});
    $scope.AddTravel();

  }


  function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
      search();
    } else {
      document.getElementById('dropoff').placeholder = 'Enter a city';
    }
  }
});
