angular.module('myApp').controller('RegisterController', function($scope, $http) {

  $scope.AddUser = function() {
    $scope.User.Role = 'Customer';
    $http.post('/adduser', $scope.User).then(function(response) {
      $scope.User.Name = '';
      $scope.User.Email = '';
      $scope.User.Mobile = '';
    });
  }

});
