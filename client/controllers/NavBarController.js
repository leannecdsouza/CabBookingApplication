angular.module('myApp').controller('NavBarController', function($scope, $http, $cookies, AuthenticationService) {

  $scope.checkL = function() {
    if ($cookies.getObject('authUser')) {
      $scope.authUser = $cookies.getObject('authUser');
      $scope.authUser = $scope.authUser.userDetails;
      return true;
    } else {
      return false;
    }
  }

  $scope.checkAdmin = function() {
    $scope.authUser = $cookies.getObject('authUser');
    if ($scope.authUser && $scope.authUser.userDetails.Role == 'Admin') {
      return true;
    } else {
      return false;
    }
  }

  $scope.checkDriver = function() {
    $scope.authUser = $cookies.getObject('authUser');
    if ($scope.authUser && $scope.authUser.userDetails.Role == 'Driver') {
      return true;
    } else {
      return false;
    }
  }

  $scope.checkCustomer = function() {
    $scope.authUser = $cookies.getObject('authUser');
    if ($scope.authUser && $scope.authUser.userDetails.Role == 'Customer') {
      return true;
    } else {
      return false;
    }
  }
});
