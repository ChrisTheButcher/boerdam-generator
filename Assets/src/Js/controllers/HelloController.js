app.controller('HelloController', $scope => {
  $scope.hello = 'Hello World!';
  $scope.babelTest = (...values) => `Babel.js is working ${values}`;

  console.log($scope.hello);  
  console.log($scope.babelTest(1,2,3));
});