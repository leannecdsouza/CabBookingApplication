angular.module('myApp').controller('LoginController', function($scope, $http, $location, $cookies, AuthenticationService) {
  $scope.LoginUser = function() {
    sessionStorage.setItem('checkL', false);
    sessionStorage.setItem('customerL', false);
    sessionStorage.setItem('driverL', false);
    sessionStorage.setItem('adminL', false);
    AuthenticationService.Login($scope.User, function(response) {
      if (response.data.isLoggedIn) {
        var role = response.data.userDetails.Role;
        if (role == 'Admin') {
          sessionStorage.setItem('checkL', true);
          sessionStorage.setItem('adminL', true);
          $location.path('/add_driver');
        }
        if (role == 'Customer') {
          sessionStorage.setItem('checkL', true);
          sessionStorage.setItem('customerL', true);
          $location.path('/booking');
        }
        if (role == 'Driver') {
          sessionStorage.setItem('checkL', true);
          sessionStorage.setItem('driverL', true);
          $location.path('/driver');
        }
        $cookies.putObject('authUser', response.data);
      }
    });
  }

  function init(){
    AuthenticationService.Logout();
  }
  init();
});
