var app = angular.module('myApp', ['ngRoute', 'ngCookies', 'ngStorage']);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider.when('/', {
    templateUrl: '/views/home.html',
    controller: 'HomeController'
  }).when('/booking', {
    templateUrl: '/views/booking.html',
    controller: 'BookingController'
  }).when('/tariff', {
    templateUrl: '/views/tariff.html',
    controller: 'TariffController'
  }).when('/add_driver', {
    templateUrl: '/views/driver.html',
    controller: 'DriverController'
  }).when('/driver', {
    templateUrl: '/views/driverview.html',
    controller: 'DriverViewController'
  }).when('/register', {
    templateUrl: '/views/register.html',
    controller: 'RegisterController'
  }).when('/login', {
    templateUrl: '/views/login.html',
    controller: 'LoginController'
  }).when('/unauthorised', {
    templateUrl: '/views/unauthorised.html',
    controller: 'UnauthorisedController'
  }).when('/myrides', {
    templateUrl: '/views/myrides.html',
    controller: 'MyRidesController'
  });
});


// var clients = 0;
//
// io.on('connect', function(socket) {
//   // sending to all clients except sender
//   socket.broadcast.emit('broadcast', 'hello friends!');
// });




app.run(function($rootScope, $http, $location, $sessionStorage, $cookies) {
  if ($sessionStorage.tokenDetails) {
    $http.defaults.headers.common.Authorization = $sessionStorage.tokenDetails.token;
  }

  //Redirect to login page if not logged in and trying to access restricted page
  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    var publicPages = ['/', '/login', '/register'];

    var authUser = $cookies.getObject('authUser');
    if (authUser != undefined) {
      var UserLoggedIn = authUser.userDetails;
    }


    //----------------------------------------


    var restrictedPage = publicPages.indexOf($location.path()) === -1;
    if (restrictedPage && !$sessionStorage.tokenDetails && $location.path() == '') {
      $location.path('/');
    } else {
      if (restrictedPage && UserLoggedIn.Role != 'Admin' && $location.path() == '/tariff') {
        $location.path('/unauthorised');
      }
      if (restrictedPage && UserLoggedIn.Role != 'Admin' && $location.path() == '/add_driver') {
        $location.path('/unauthorised');
      }
      if (restrictedPage && UserLoggedIn.Role != 'Customer' && $location.path() == '/booking') {
        $location.path('/unauthorised');
      }
      if (restrictedPage && UserLoggedIn.Role != 'Driver' && $location.path() == '/driver') {
        $location.path('/unauthorised');
      }
    }
  });
});
