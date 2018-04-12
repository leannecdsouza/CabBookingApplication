angular.module('myApp').controller('TariffController', function($scope, $http) {
  var TID;

  // Save changes to tariff plans
  $scope.SaveChanges = function() {
    $http.put('/updatetariff/' + TID, $scope.EditTariff).then(function(response) {});
    ShowTariffs();
  }


  // Get a tariff plan
  $scope.GetTariff = function(TariffID) {
    TID = TariffID;

    var etime1 = $scope.EditTariff.StartPeak.toString();
    $scope.EditTariff.StartPeak = etime1.substring(15, 21);
    var etime2 = $scope.EditTariff.EndPeak.toString();
    $scope.EditTariff.EndPeak = etime2.substring(15, 21);

    $http.get('/findtariff/' + TariffID).then(function(response) {
      $scope.EditTariff = {
        Cab: response.data[0].Cab,
        NormalRate: response.data[0].NormalRate,
        PeakRate: response.data[0].PeakRate,
        StartPeak: response.data[0].StartPeak,
        EndPeak: response.data[0].EndPeak,
      }
    });
  }

  // Delete tariff plans
  $scope.RemoveTariff = function(cabid) {
    $http.delete('/deletetariff/' + cabid).then(function(response) {});
    ShowTariffs();
  }

  // Show existing tariff plans
  var ShowTariffs = function() {
    $http.get('/gettariffs').then(function(response) {
      $scope.Tariffs = response.data;
    });
  }


  ShowTariffs();

  // Add new tariff plan
  $scope.AddTariff = function() {
    var time1 = $scope.Tariff.StartPeak.toString();
    $scope.Tariff.StartPeak = time1.substring(15, 21);
    var time2 = $scope.Tariff.EndPeak.toString();
    $scope.Tariff.EndPeak = time2.substring(15, 21);
    $http.post('/addtariff', $scope.Tariff).then(function(response) {});
    ShowTariffs();
    $scope.Tariff = {
      Cab: '',
      NormalRate: '',
      PeakRate: '',
      StartPeak: '',
      EndPeak: '',
    }
  }
});
