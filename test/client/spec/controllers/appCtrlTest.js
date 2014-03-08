'use strict';

describe('Controller: appCtrl', function () {

  // load the controller's module
  beforeEach(module('esExploreApp'));

  var appCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach( inject( function ( $controller, $rootScope ) {
    
    scope = $rootScope.$new();
    appCtrl = $controller('appCtrl', {
      $scope: scope
    });
  }));

  it('should return true just to test if its working', function () {
    expect(true).toBe(true);
  });
});
