angular.module('myApp').controller('DriverViewController', function($scope, $cookies, $http) {

  var socket = io();
  $(document).ready(function() {
    var authUser = $cookies.getObject('authUser');
    var email = authUser.userDetails.Email;
    $http.get('/finddriver/email/' + email).then(function(response) {
      $scope.CurrDriver = response.data[0];
    });
  });


  $scope.initMapD = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      document.innerHTML = "Geolocation is not supported by this browser.";
    }
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
      icon: '/public/images/car-icon.png'
    });

    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({
      'latLng': uluru
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          dloc = results[1].formatted_address;
          $scope.CurrDriver.Location = uluru;
          console.log($scope.CurrDriver);
          socket.emit('MyMessage', {
            message: $scope.CurrDriver
          });
        }
      }
    });
  }

  //------------------------------------------------------------


  var socket = io.connect();
  socket = io.connect('http://localhost:3000', {
    reconnect: false
  });

  socket.on('MyBook', function(data) {
    console.log(data.message);

    // if (data.message.driverArray.length > 0) {
    //
    //   $scope.BookingDeets = data.message.BookNow;
    //   console.log(data.message.BookNow);
    //   console.log($scope.BookingDeets);
    //   document.getElementById('clickNewBooking').click();
    // } else {
    //   console.log('No bookings');
    // }
  });


});
