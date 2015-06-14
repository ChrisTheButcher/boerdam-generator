app.controller('HelloController', ['$scope', function($scope) {
  $scope.hello = 'Hello World!';

  console.log($scope.hello);
}]);