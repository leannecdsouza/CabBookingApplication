angular.module('myApp').controller('LoginController', function($scope, $http, $location, $cookies, AuthenticationService) {
  $scope.LoginUser = function() {
    AuthenticationService.Login($scope.User, function(response) {
      if (response.data.isLoggedIn) {
        var role = response.data.userDetails.Role;
        if (role == 'Admin') {
          $location.path('/add_driver');
        }
        if (role == 'Customer') {
          $location.path('/booking');
        }
        if (role == 'Driver') {
          $location.path('/driver');
        }
        $cookies.putObject('authUser', response.data);
        console.log(response.data.userDetails.Role);
      }
    });
  }
});
