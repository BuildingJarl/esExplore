'use strict';

describe('Controller: HomeCtrl', function () {

  // load the controller's module
  beforeEach(module('esExploreApp'));

  var HomeCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach( inject( function ( $controller, $rootScope ) {
    
    scope = $rootScope.$new();
    HomeCtrl = $controller('HomeCtrl', {
      $scope: scope
    });
  }));

  it('should return true just to test if its working', function () {
    expect(true).toBe(true);
  });
});
