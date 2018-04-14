angular.module('myApp').controller('BookingController', function($scope, $cookies, $http) {
  var socket = io();
  var allMyMarkers = [];

  $scope.Booking = {
    Pickup: '',
    Dropoff: '',
    Distance: '',
    Duration: '',
    Time: '',
    BookingType: '',
    Cab: ''
  };
  var directionsService;
  var directionsDisplay;

  $(document).ready(function() {
    $(".part2").hide();
    $(".part3").hide();

    $scope.authUser = $cookies.getObject('authUser');
    $scope.authUser = $scope.authUser.userDetails;
    // console.log($scope.authUser);

    $scope.checkL = sessionStorage.getItem('checkL');
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
      map: map,
      icon: '/public/images/person.png'
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


    socket.on('NewMessage', function(data) {
      console.log(data.message);
      if (data.message) {
        $scope.DriverInfo = data.message.driverlocation;
        var DriverLoc = $scope.DriverInfo.Location;
        console.log(DriverLoc);

        var Mymarker = new google.maps.Marker({
          position: DriverLoc,
          map: map,
          icon: '/public/images/car-icon.png'
        });

        allMyMarkers.push(Mymarker);
      } else {
        console.log('Error getting driver info');
      }

      socket.on('DriverArr', function(data) {
        console.log(data.description);
        for (var i = 0; i <= data.description.Arr.length; i++) {
          if (data.description.Arr[i] === data.description.driverId) {
            console.log('Driver exists.');
          } else {
            $scope.DriverInfo = [];
            $scope.DriverInfo = null;
            for (var i = 0; i < allMyMarkers.length; i++) {
              if (allMyMarkers[i].store_id === data.description.driverId) {
                allMyMarkers[i].setMap(null);
                break;
              }
            }
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

        var cabType = $scope.Travel.CarType;
        $http.get('/findtariff/cabrates/' + cabType).then(function(response) {
          $scope.Tariffs = response.data[0];

          var currTime = Date();
          currTime = currTime.toString();
          currTime = currTime.substring(15, 18);

          console.log(currTime);

          var sPeak = $scope.Tariffs.StartPeak.toString().substring(0, 3);
          var ePeak = $scope.Tariffs.EndPeak.toString().substring(0, 3);

          if (currTime >= sPeak && currTime <= ePeak) {
            $scope.Booking.Fare = newdistance * $scope.Tariffs.PeakRate;
            console.log('PeakRate' + sPeak + ' ' + ePeak + ' ' + $scope.Tariffs.NormalRate);
          } else {
            $scope.Booking.Fare = newdistance * $scope.Tariffs.NormalRate;
            console.log('NormalRate' + sPeak + ' ' + ePeak + ' ' + $scope.Tariffs.NormalRate);
          }
        });

      } else {
        alert("Unable to find the distance via road.");
      }
    });
  }

  $scope.travelLaterOps = function() {
    $(".btns2").hide();
    $(".part3").show();
    var today = new Date();
    var tomorrow = new Date();
    var dayafter = new Date();
    tomorrow.setDate(today.getDate() + 1);
    dayafter.setDate(tomorrow.getDate() + 1);
    today = today.toString().substring(0, 3) + ' - ' + today.toString().substring(4, 10) + ', ' + today.toString().substring(11, 15);
    tomorrow = tomorrow.toString().substring(0, 3) + ' - ' + tomorrow.toString().substring(4, 10) + ', ' + tomorrow.toString().substring(11, 15);
    dayafter = dayafter.toString().substring(0, 3) + ' - ' + dayafter.toString().substring(4, 10) + ', ' + dayafter.toString().substring(11, 15);
    $scope.ops = [today, tomorrow, dayafter];

  }

  $scope.travelLater = function() {
    $scope.Booking.CustomerName = $scope.authUser.Name;
    $scope.Booking.CustomerMobile = $scope.authUser.Mobile;
    var time = $scope.Booking.Time.toString();
    $scope.Booking.Time = time.substring(15, 21);
    $scope.Booking.BookingType = "Later"
    $scope.Booking.Cab = $scope.Travel.CarType;
    $scope.saveBooking($scope.Booking);
  }

  $scope.rideNow = function() {
    $scope.Booking.CustomerName = $scope.authUser.Name;
    $scope.Booking.CustomerMobile = $scope.authUser.Mobile;
    var n = new Date().getTime();
    var d = new Date(n);
    $scope.Booking.Time = d.toString().substring(15, 21);
    $scope.Booking.Date = d.toString().substring(3, 15);
    console.log($scope.Booking.Time);
    $scope.Booking.BookingType = "Now"
    $scope.Booking.Cab = $scope.Travel.CarType;
    $scope.saveBooking($scope.Booking);
  }

  $scope.saveBooking = function(Booking) {
    console.log(Booking);
    $http.post('/addtravel', Booking).then(function(response) {});
  }


  $scope.travelNow = function() {
    if ($scope.Travel.CarType == $scope.DriverInfo.CabType) {
      var time = $scope.Booking.Time.toString();
      $scope.Booking.Time = time.substring(15, 21);
      $scope.Booking.BookingType = "Now"
      $scope.Booking.Cab = $scope.Travel.CarType;

      $scope.BookNow = {
        Pickup: $scope.Booking.Pickup,
        Dropoff: $scope.Booking.Dropoff,
        CustName: $scope.authUser.Name,
        CustNumber: $scope.authUser.Mobile,
        Fare: $scope.Booking.Fare
      };

      socket.emit('BookDetail', {
        All: $scope.BookNow
      });

      document.getElementById('clickNewDriver').click();
    } else {
      alert("No Cabs Available");
    }
  }


  function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
      search();
    } else {
      document.getElementById('dropoff').placeholder = 'Enter a city';
    }
  }


  //------------------------------------------------------------

  var socket = io.connect();
  socket = io.connect('http://localhost:3000', {
    reconnect: false
  });


});
