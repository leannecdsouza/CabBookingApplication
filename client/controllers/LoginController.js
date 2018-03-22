angular.module('myApp').controller('LoginController', function($scope, $http, $location, AuthenticationService) {
  $scope.LoginUser = function() {
    AuthenticationService.Login($scope.User, function(response) {
      if (response.data.isLoggedIn) {
        var role = response.data.userDetails.Role;
        if (role == 'Admin') {
          $location.path('/add_driver');
          console.log("still not redirecting to admin");
        }
        if (role == 'Customer') {
          $location.path('/booking');
          console.log("still not redirecting to customer");
        }
        if (role == 'Driver') {
          $location.path('/driver');
          console.log("still not redirecting to driver");
        }
        console.log(response.data.userDetails.Role);
      }
    });
  }
});
