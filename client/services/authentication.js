angular.module('myApp').service('AuthenticationService', function($http) {
  this.Login = function(user, callback) {
    $http.post('/login', user).then(function(response) {
      if (response.data.success && response.data.token) {
        $sessionStorage.tokenDetails = {
          token: response.data.token
        };

        // $http.defaults.headers.common.Authorization = response.data.token;
        var obj = {
          currentUser: {
            isLoggedIn: true,
            userInfo: {
              id: response.data.userDetails._id,
              name: response.data.userDetails.Name,
              email: response.data.userDetails.Email,
              number: response.data.userDetails.Mobile,
              role: response.data.userDetails.Role
            }
          }
        };

        $cookies.putObject('authUser', obj);
        console.log(obj);

        callback(response);
      } else {
        callback(response);
      }
    });
  }
});
