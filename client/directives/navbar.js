angular.module('myApp').directive('navbar', () => ({
  templateUrl: '/views/navbar.html',
  controller: 'NavBarController',
  restrict: 'E'
}));
