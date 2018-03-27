angular.module('myApp').controller('DriverViewController', function($scope, $http) {

  var socket = io();
  $(document).ready(function(){
    
  }

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

  }

});
