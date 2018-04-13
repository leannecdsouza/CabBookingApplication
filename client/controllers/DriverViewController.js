angular.module('myApp').controller('DriverViewController', function($scope, $cookies, $http) {

  var socket = io();
  $(document).ready(function() {
    var authUser = $cookies.getObject('authUser');
    var email = authUser.userDetails.Email;
    $http.get('/finddriver/email/' + email).then(function(response) {
      $scope.CurrDriver = response.data[0];
    });
  });

  socket.on('MyBook', function(data) {
    console.log(data.msg);
    $scope.BookingDeets = data.msg;
    console.log($scope.BookingDeets.Pickup);
    document.getElementById('clickNewBooking').click();

    document.getElementById("PickUpp").innerHTML = data.msg.Pickup;
    document.getElementById("DropOfff").innerHTML = data.msg.Dropoff;
    document.getElementById("CustName").innerHTML = data.msg.CustName;
    document.getElementById("CustNumber").innerHTML = data.msg.CustNumber;
    document.getElementById("Fare").innerHTML = data.msg.Fare;
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



});
