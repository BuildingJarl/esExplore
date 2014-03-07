'use strict';

describe('Controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('esExploreApp'));

  var AboutCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach( inject( function ( $controller, $rootScope ) {
    
    scope = $rootScope.$new();
    AboutCtrl = $controller('AboutCtrl', {
      $scope: scope
    });
  }));

  it('should return true just to test if its working', function () {
    expect(true).toBe(true);
  });
});
