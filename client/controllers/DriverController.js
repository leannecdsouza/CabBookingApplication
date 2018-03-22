angular.module('myApp').controller('DriverController', function($scope, $http) {
  var DID;

  // Save changes to driver plans
  $scope.SaveChanges = function() {
    $http.put('/updatedriver/' + DID, $scope.EditDriver).then(function(response) {});
    ShowDrivers();
  }

  // Get driver details
  $scope.GetDriver = function(DriverID) {
    DID = DriverID;
    $http.get('/finddriver/' + DriverID).then(function(response) {
      $scope.EditDriver = {
        Name: response.data[0].Name,
        Mobile: response.data[0].Mobile,
        Email: response.data[0].Email,
        DriverPermit: response.data[0].DriverPermit,
        CabType: response.data[0].CabType,
        CabMake: response.data[0].CabMake,
        CabModel: response.data[0].CabModel,
        CabRegistration: response.data[0].CabRegistration,
      }
    });
  }

  // Delete driver
  $scope.RemoveDriver = function(DriverID) {
    $http.delete('/deletedriver/' + DriverID).then(function(response) {});
    ShowDrivers();
  }

  // Show existing drivers
  var ShowDrivers = function() {
    $http.get('/getdrivers').then(function(response) {
      $scope.Drivers = response.data;
    });
  }
  ShowDrivers();

  // Add new driver
  $scope.AddDriver = function() {
    $http.post('/adddriver', $scope.Driver).then(function(response) {});
    $scope.AddUser();
  }

  // Add new user
  $scope.AddUser = function() {
    $scope.Driver.Password = "duck";
    $scope.Driver.Role = "Driver";
    $http.post('/adduser', $scope.Driver).then(function(response) {});
    ShowDrivers();
  }
});
