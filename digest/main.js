angular.module("app", [])
  .config(function() {
    console.log('Config reached!');
  })
  .controller('Ctrl', function ($scope, $timeout, $http) {

    var ctr = 0;

    var make_request = function() {
      $http({
        url: "http://google.com",
        method: "GET"
      }).success(console.log("GET request success!"));
    };

    // app-wide $digest() watcher
    $scope.$watch(function () {
      ctr += 1;
      console.log("digest called " + ctr);
    });

    $timeout(function() {
      make_request();
      console.log('End timeout!');
    }, 2000);

  });
