angular.module('myApp').controller('NavBarController', function($scope, $cookies, $http) {

  $scope.authUser = $cookies.getObject('authUser');

  $scope.checkL = function() {
    if ($scope.authUser) {
      return true;
    } else {
      return false;
    }
  }

  $scope.checkAdmin = function() {
    if ($scope.authUser && $scope.authUser.userDetails.Role == 'Admin') {
      return true;
    } else {
      return false;
    }
  }

  $scope.checkDriver = function() {
    if ($scope.authUser && $scope.authUser.userDetails.Role == 'Driver') {
      return true;
    } else {
      return false;
    }
  }

  $scope.checkCustomer = function() {
    if ($scope.authUser && $scope.authUser.userDetails.Role == 'Customer') {
      return true;
    } else {
      return false;
    }
  }
  // console.log($scope.authUser);
});
